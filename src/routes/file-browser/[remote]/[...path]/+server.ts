import { error, json } from '@sveltejs/kit';

import { opList } from '$lib/server/rclone';
import { formatNode } from '$lib/models/tree';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url }) => {
	const remote = params.remote;

	const path = url.searchParams.get('path');
	if (!path) {
		error(400, 'Invalid path');
	}

	const dirs = await opList(fetch, remote, path, { dirsOnly: true });
	return json(dirs.map(formatNode));
};
