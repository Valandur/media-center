import { env } from '$env/dynamic/private';

import type { Torrent } from '$lib/models/torrent';
import { error } from '@sveltejs/kit';

import { Service } from './service';

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
						'eta',
						'isFinished',
						'isStalled',
						'peersConnected',
						'peersSendingToUs',
						'percentDone',
						'rateDownload',
						'sizeWhenDone'
					]
				},
				method: 'torrent-get'
			});
			return res.arguments.torrents;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	private async request<T = unknown>(body: Record<string, unknown>, retry = true): Promise<T> {
		let status = 0;
		const url = env.TRANSMISSION_URL;

		try {
			const res = await fetch(url, {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					'x-transmission-session-id': this.sessionId
				},
				body: JSON.stringify(body)
			});
			status = res.status;

			if (res.status === 409 && retry) {
				this.sessionId = res.headers.get('x-transmission-session-id') ?? '';
				return this.request(body, false);
			}

			if (res.status !== 200) {
				throw new Error('Invalid transmission response: ' + res.status);
			}

			const data = await res.json();
			if (data.result !== 'success') {
				throw new Error('Transmission request not successfull: ' + data.result);
			}

			return data;
		} finally {
			this.logger.debug('POST', url, body.method, status);
		}
	}
}

export const transmission = new Transmission();
