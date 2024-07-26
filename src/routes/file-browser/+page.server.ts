import { rclone } from '$lib/server/rclone';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const remotes = await rclone.configListRemotes();
	return { remotes };
};
