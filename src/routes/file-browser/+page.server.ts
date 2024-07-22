import { configListRemotes } from '$lib/server/rclone';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const remotes = await configListRemotes(fetch);
	return { remotes };
};
