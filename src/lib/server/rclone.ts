import { env } from '$env/dynamic/private';

import type { About } from '$lib/models/about';
import type { FsInfo } from '$lib/models/fsinfo';
import type { ListEntry } from '$lib/models/list';
import type { Stats } from '$lib/models/stats';
import type { CompletedTransfer } from '$lib/models/transfer';
import type { Version } from '$lib/models/version';

import { Service } from './service';

const AUTH = btoa(`${env.RCLONE_USERNAME}:${env.RCLONE_PASSWORD}`);
const HEADERS = { Authorization: `Basic ${AUTH}`, 'content-type': 'application/json' };

class Rclone extends Service {
	private version: Version | null = null;
	private transferIndex = 0;
	private transferMap: Map<string, number> = new Map();

	public constructor() {
		super('RCLONE');
	}

	public async coreVersion(): Promise<Version> {
		if (this.version) {
			return this.version;
		}

		const newVersion = await this.request('core/version');
		this.version = newVersion;
		return newVersion;
	}

	public async coreStats(): Promise<Stats> {
		const data: Stats = await this.request('core/stats');
		if (data.transferring) {
			for (const transfer of data.transferring) {
				let id = this.transferMap.get(transfer.name);
				if (!id) {
					id = this.transferIndex++;
					this.transferMap.set(transfer.name, id);
				}
				transfer.id = id;
			}
		}
		return data;
	}

	public async coreTransferred(): Promise<CompletedTransfer[]> {
		const data = await this.request('core/transferred');
		return data.transferred;
	}

	public async jobList(): Promise<number[]> {
		const data = await this.request('job/list');
		return data.jobids;
	}

	public async jobStatus(jobId: number): Promise<unknown[]> {
		const data = await this.request('job/status', { jobid: jobId });
		return data;
	}

	public async configListRemotes(): Promise<string[]> {
		const data = await this.request('config/listremotes');
		return data.remotes;
	}

	public async opFsInfo(fs: string): Promise<FsInfo> {
		const data = await this.request('operations/fsinfo', { fs: `${fs}:` });
		if ('error' in data) {
			throw new Error('Could not get fs info: ' + data.error);
		}
		return data;
	}

	public async opAbout(fs: string): Promise<About> {
		const data = await this.request('operations/about', { fs: `${fs}:` });
		if ('error' in data) {
			throw new Error('Could not get about: ' + data.error);
		}
		return data;
	}

	public async opList(
		fs: string,
		dir: string,
		options?: { recurse?: boolean; dirsOnly?: boolean; filesOnly?: boolean }
	): Promise<ListEntry[]> {
		const data = await this.request('operations/list', { fs: `${fs}:`, remote: dir, opt: options });
		if ('error' in data) {
			throw new Error('Could not get about: ' + data.error);
		}
		return data.list;
	}

	private async request(op: string, body?: Record<string, unknown>) {
		let status = 0;
		const url = `${env.RCLONE_URL}/${op}`;

		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: HEADERS,
				body: JSON.stringify(body ?? {})
			});
			status = res.status;
			const data = await res.json();
			return data;
		} finally {
			this.logger.debug('POST', url, JSON.stringify(body), status);
		}
	}
}

export const rclone = new Rclone();
