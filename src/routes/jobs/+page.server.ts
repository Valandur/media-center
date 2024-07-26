import { rclone } from '$lib/server/rclone';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const jobs = await rclone.coreTransferred();
	return { jobs };
};
