import { json } from '@sveltejs/kit';

import { setTitle } from '$lib/server/arm';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	const { selectedId, ...rest } = data;
	await setTitle(selectedId, rest);

	return json({});
};
