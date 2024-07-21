import type { ListEntry } from './list';

export interface TreeNode {
	path: string;
	name: string;
	dir: boolean;
	mimeType: string;
	modTime: string;
	size: number;
}

export function formatNode(entry: ListEntry): TreeNode {
	return {
		name: entry.Name,
		path: entry.Path,
		dir: entry.IsDir,
		mimeType: entry.MimeType,
		modTime: entry.ModTime,
		size: entry.Size
	};
}
