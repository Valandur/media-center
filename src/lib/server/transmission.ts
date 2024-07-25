import { env } from '$env/dynamic/private';
import type { Torrent } from '$lib/models/transmission';

type Fetch = typeof fetch;

let sessionId = '';

export async function getTorrents(fetch: Fetch): Promise<Torrent[]> {
	const res = await request(fetch, {
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
			],
			format: 'json'
		},
		method: 'torrent-get'
	});
	return res.arguments.torrents;
}

async function request(fetch: Fetch, body: Record<string, unknown>, retry = true) {
	const res = await fetch(env.TRANSMISSION_URL, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'x-transmission-session-id': sessionId
		},
		body: JSON.stringify(body)
	});
	if (res.status === 409 && retry) {
		sessionId = res.headers.get('x-transmission-session-id') ?? '';
		return request(fetch, body, false);
	}
	if (res.status !== 200) {
		throw new Error('Invalid transmission response: ' + res.status);
	}

	const data = await res.json();
	if (data.result !== 'success') {
		throw new Error('Transmission request not successfull: ' + data.result);
	}

	return data;
}
