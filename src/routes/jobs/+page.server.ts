import { coreTransferred } from '$lib/server/rclone';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const jobs = await coreTransferred(fetch);
	return { jobs };
};
