import { json } from '@sveltejs/kit';
import { invalidate } from '$app/navigation';

import { transmission } from '$lib/server/transmission';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	const { torrent } = data;
	await transmission.addTorrent(torrent);

	invalidate('mc:stats');

	return json({});
};
