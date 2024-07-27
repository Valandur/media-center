import { json } from '@sveltejs/kit';

import { omdb } from '$lib/server/omdb';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	const search = data.search;
	const titles = await omdb.search(search);

	return json(titles);
};
