import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

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
		try {
			if (this.version) {
				return this.version;
			}

			const newVersion = await this.request('core/version');
			this.version = newVersion;
			return newVersion;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async coreStats(): Promise<Stats> {
		try {
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
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async coreTransferred(): Promise<CompletedTransfer[]> {
		try {
			const data = await this.request('core/transferred');
			return data.transferred;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async jobList(): Promise<number[]> {
		try {
			const data = await this.request('job/list');
			return data.jobids;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async jobStatus(jobId: number): Promise<unknown[]> {
		try {
			const data = await this.request('job/status', { jobid: jobId });
			return data;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async configListRemotes(): Promise<string[]> {
		try {
			const data = await this.request('config/listremotes');
			return data.remotes;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async opFsInfo(fs: string): Promise<FsInfo> {
		try {
			const data = await this.request('operations/fsinfo', { fs: `${fs}:` });
			if ('error' in data) {
				throw new Error('Could not get fs info: ' + data.error);
			}
			return data;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async opAbout(fs: string): Promise<About> {
		try {
			const data = await this.request('operations/about', { fs: `${fs}:` });
			if ('error' in data) {
				throw new Error('Could not get about: ' + data.error);
			}
			return data;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async opList(
		fs: string,
		dir: string,
		options?: { recurse?: boolean; dirsOnly?: boolean; filesOnly?: boolean }
	): Promise<ListEntry[]> {
		try {
			const data = await this.request('operations/list', {
				fs: `${fs}:`,
				remote: dir,
				opt: options
			});
			if ('error' in data) {
				throw new Error('Could not get about: ' + data.error);
			}
			return data.list;
		} catch (err) {
			error(500, (err as Error).message);
		}
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
