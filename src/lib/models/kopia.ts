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
	task?: KopiaTaskResponse;
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

export interface KopiaTaskResponse {
	id: string;
	startTime: string;
	kind: string;
	description: string;
	status: string;
	progressInfo: string;
	counters: Counters;
}

export interface Counters {
	'Cached Bytes': CachedBytes;
	'Cached Files': CachedFiles;
	Errors: Errors;
	'Estimated Bytes': EstimatedBytes;
	'Estimated Files': EstimatedFiles;
	'Excluded Directories': ExcludedDirectories;
	'Excluded Files': ExcludedFiles;
	'Hashed Bytes': HashedBytes;
	'Hashed Files': HashedFiles;
	'Processed Bytes': ProcessedBytes;
	'Processed Files': ProcessedFiles;
	'Uploaded Bytes': UploadedBytes;
}

export interface CachedBytes {
	value: number;
	units: string;
	level: string;
}

export interface CachedFiles {
	value: number;
	level: string;
}

export interface Errors {
	value: number;
	level: string;
}

export interface EstimatedBytes {
	value: number;
	units: string;
	level: string;
}

export interface EstimatedFiles {
	value: number;
	level: string;
}

export interface ExcludedDirectories {
	value: number;
	level: string;
}

export interface ExcludedFiles {
	value: number;
	level: string;
}

export interface HashedBytes {
	value: number;
	units: string;
	level: string;
}

export interface HashedFiles {
	value: number;
	level: string;
}

export interface ProcessedBytes {
	value: number;
	units: string;
	level: string;
}

export interface ProcessedFiles {
	value: number;
	level: string;
}

export interface UploadedBytes {
	value: number;
	units: string;
	level: string;
}
