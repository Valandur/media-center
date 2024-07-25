import { coreTransferred } from '$lib/server/rclone';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const jobs = await coreTransferred();
	return { jobs };
};
