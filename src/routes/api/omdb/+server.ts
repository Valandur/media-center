import { error, json } from '@sveltejs/kit';

import { omdb } from '$lib/server/omdb';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();

	const title = data.get('title');
	if (typeof title !== 'string') {
		error(400, 'Invalid title');
	}

	const titles = await omdb.search(title);
	return json(titles);
};
