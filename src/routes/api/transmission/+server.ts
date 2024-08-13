import { json } from '@sveltejs/kit';

import { transmission } from '$lib/server/transmission';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	const { torrent } = data;
	await transmission.addTorrent(torrent);

	return json({});
};
