import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

import type { Stats } from '$lib/models/stats';
import type { Version } from '$lib/models/version';

import { Service } from './service';
import { fetch } from './fetch';

const AUTH = btoa(`${env.RCLONE_USERNAME}:${env.RCLONE_PASSWORD}`);
const HEADERS = { Authorization: `Basic ${AUTH}`, 'content-type': 'application/json' };

class Rclone extends Service {
	private version: Version | null = null;
	private transferIndex = 0;
	private transferMap: Map<string, number> = new Map();

	public constructor() {
		super('RCLONE');
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

	private async request<T>(op: string, body?: Record<string, unknown>): Promise<T> {
		const res = await fetch(`${env.RCLONE_URL}/${op}`, {
			method: 'POST',
			headers: HEADERS,
			body: JSON.stringify(body ?? {})
		});
		const data = await res.json();
		return data as T;
	}
}

export const rclone = new Rclone();
