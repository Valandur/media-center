export interface KopiaSourcesResponse {
	localUsername: string;
	localHost: string;
	multiUser: boolean;
	sources: Source[];
}

export interface Source {
	source: SourceLocation;
	status: string;
	schedule: Schedule;
	lastSnapshot?: LastSnapshot;
	upload?: Upload;
	currentTask?: string;
}

export interface SourceLocation {
	host: string;
	userName: string;
	path: string;
}

export interface Schedule {
	cron: string[];
	runMissed: boolean;
}

export interface LastSnapshot {
	id: string;
	source: SourceLocation;
	description: string;
	startTime: string;
	endTime: string;
	stats: Stats;
	incomplete: string;
	rootEntry: RootEntry;
}

export interface Stats {
	totalSize: number;
	excludedTotalSize: number;
	fileCount: number;
	cachedFiles: number;
	nonCachedFiles: number;
	dirCount: number;
	excludedFileCount: number;
	excludedDirCount: number;
	ignoredErrorCount: number;
	errorCount: number;
}

export interface RootEntry {
	name: string;
	type: string;
	mode: string;
	mtime: string;
	uid: number;
	gid: number;
	obj: string;
	summ: Summ;
}

export interface Summ {
	size: number;
	files: number;
	symlinks: number;
	dirs: number;
	maxTime: string;
	incomplete: string;
	numFailed: number;
}

export interface Upload {
	cachedBytes: number;
	hashedBytes: number;
	uploadedBytes: number;
	estimatedBytes: number;
	cachedFiles: number;
	hashedFiles: number;
	excludedFiles: number;
	excludedDirs: number;
	errors: number;
	ignoredErrors: number;
	estimatedFiles: number;
	directory: string;
	lastErrorPath: string;
	lastError: string;
}
