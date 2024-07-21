import { formatNode, type TreeNode } from '$lib/models/tree';
import { opAbout, opList } from '$lib/server/rclone';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, depends, params }) => {
	depends('file-browser');

	const remote = params.remote;
	const path = params.path;

	const [about, files] = await Promise.all([
		opAbout(fetch, remote).catch(() => null),
		opList(fetch, remote, path).then((files) => files.map(formatNode))
	]);

	const tree = new Promise<TreeNode[]>((resolve) => {
		opList(fetch, remote, '', { dirsOnly: true }).then((dirs) => resolve(dirs.map(formatNode)));
	});

	return {
		remote,
		about,
		path,
		files,
		tree
	};
};
