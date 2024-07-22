export interface FsInfo {
	Features: Features;
	Hashes: string[];
	Name: string;
	Precision: number;
	Root: string;
	String: string;
	MetadataInfo: MetadataInfo;
}

export interface Features {
	About: boolean;
	BucketBased: boolean;
	BucketBasedRootOK: boolean;
	CanHaveEmptyDirectories: boolean;
	CaseInsensitive: boolean;
	ChangeNotify: boolean;
	CleanUp: boolean;
	Command: boolean;
	Copy: boolean;
	DirCacheFlush: boolean;
	DirMove: boolean;
	Disconnect: boolean;
	DuplicateFiles: boolean;
	GetTier: boolean;
	IsLocal: boolean;
	ListR: boolean;
	MergeDirs: boolean;
	MetadataInfo: boolean;
	Move: boolean;
	OpenWriterAt: boolean;
	PublicLink: boolean;
	Purge: boolean;
	PutStream: boolean;
	PutUnchecked: boolean;
	ReadMetadata: boolean;
	ReadMimeType: boolean;
	ServerSideAcrossConfigs: boolean;
	SetTier: boolean;
	SetWrapper: boolean;
	Shutdown: boolean;
	SlowHash: boolean;
	SlowModTime: boolean;
	UnWrap: boolean;
	UserInfo: boolean;
	UserMetadata: boolean;
	WrapFs: boolean;
	WriteMetadata: boolean;
	WriteMimeType: boolean;
}

export interface MetadataInfo {
	System: System;
	Help: string;
}

export interface System {
	atime: Def;
	btime: Def;
	gid: Def;
	mode: Def;
	mtime: Def;
	rdev: Def;
	uid: Def;
}

export interface Def {
	Help: string;
	Type: string;
	Example: string;
}
