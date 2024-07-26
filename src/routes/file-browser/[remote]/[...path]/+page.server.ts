import { formatNode } from '$lib/models/tree';
import { rclone } from '$lib/server/rclone';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, params }) => {
	depends('file-browser');

	const remote = params.remote;
	const path = params.path;

	const [about, tree, files] = await Promise.all([
		rclone.opAbout(remote).catch(() => null),
		rclone.opList(remote, '', { dirsOnly: true }).then((dirs) => dirs.map(formatNode)),
		rclone.opList(remote, path).then((files) => files.map(formatNode))
	]);

	return {
		remote,
		about,
		path,
		files,
		tree
	};
};
