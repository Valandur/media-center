import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

import type { Torrent } from '$lib/models/transmission';

import { Service } from './service';
import { fetch } from './fetch';

const URL = `${env.TRANSMISSION_URL}/transmission/rpc`;
const AUTH = `Basic ${btoa(`${env.TRANSMISSION_USERNAME}:${env.TRANSMISSION_PASSWORD}`)}`;

class Transmission extends Service {
	protected sessionId = '';

	public constructor() {
		super('TRANSMISSION');
	}

	public async getTorrents(): Promise<Torrent[]> {
		try {
			const res = await this.request<{ arguments: { torrents: Torrent[] } }>({
				arguments: {
					fields: [
						'id',
						'name',
						'status',
						'eta',
						'isFinished',
						'isStalled',
						'peersConnected',
						'peersSendingToUs',
						'percentDone',
						'sizeWhenDone',
						'rateDownload',
						'uploadedEver',
						'peersGettingFromUs',
						'rateUpload',
						'etaIdle'
					]
				},
				method: 'torrent-get'
			});
			return res.arguments.torrents;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async addTorrent(filename: string): Promise<void> {
		try {
			await this.request({
				arguments: { 'download-dir': '/downloads/complete', filename, paused: false },
				method: 'torrent-add'
			});
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async removeTorrent(id: number): Promise<void> {
		try {
			await this.request({
				arguments: { 'delete-local-data': false, ids: [id] },
				method: 'torrent-remove'
			});
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	private async request<T = unknown>(body: Record<string, unknown>, retry = true): Promise<T> {
		const res = await fetch(URL, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'x-transmission-session-id': this.sessionId,
				Authorization: AUTH
			},
			body: JSON.stringify(body)
		});

		if (res.status === 409 && retry) {
			this.sessionId = res.headers.get('x-transmission-session-id') ?? '';
			return this.request(body, false);
		}

		if (res.status !== 200) {
			throw new Error('Invalid transmission response: ' + res.status);
		}

		const data = await res.json();
		if (!data || typeof data !== 'object' || !('result' in data)) {
			throw new Error(`Response data has incorrect format: ${data}`);
		}
		if (data.result !== 'success') {
			throw new Error(`Transmission request not successfull: ${data.result}`);
		}

		return data as T;
	}
}

export const transmission = new Transmission();
