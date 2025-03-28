import { error, json } from '@sveltejs/kit';

import { omv } from '$lib/server/omv';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const action = data.action;
	const service = data.service;
	const filepath = data.filepath;
	const envpath = data.envpath;

	switch (action) {
		case 'pull': {
			await omv.doComposeServiceCommand(action, service, filepath, envpath);
			break;
		}

		case 'restart': {
			await omv.doComposeServiceCommand('up -d', service, filepath, envpath);
			await omv.doComposeServiceCommand('restart', service, filepath, envpath);
			break;
		}

		default: {
			error(500, 'Invalid action');
		}
	}

	return json({});
};
