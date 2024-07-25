import { formatNode } from '$lib/models/tree';
import { opAbout, opList } from '$lib/server/rclone';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, params }) => {
	depends('file-browser');

	const remote = params.remote;
	const path = params.path;

	const [about, tree, files] = await Promise.all([
		opAbout(remote).catch(() => null),
		opList(remote, '', { dirsOnly: true }).then((dirs) => dirs.map(formatNode)),
		opList(remote, path).then((files) => files.map(formatNode))
	]);

	return {
		remote,
		about,
		path,
		files,
		tree
	};
};
