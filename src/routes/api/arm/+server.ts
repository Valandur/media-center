import { json } from '@sveltejs/kit';

import { arm } from '$lib/server/arm';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	const { selectedId, ...rest } = data;
	await arm.setTitle(selectedId, rest);

	return json({});
};
