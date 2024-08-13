export interface QueueResponse {
	page: number;
	pageSize: number;
	sortKey: string;
	sortDirection: string;
	totalRecords: number;
	records: QueueItem[];
}

export interface QueueItem {
	movieId: number;
	movie: Movie;
	languages: Language[];
	quality: {
		quality: {
			id: number;
			name: string;
			source: string;
			resolution: number;
			modifier: string;
		};
		revision: {
			version: number;
			real: number;
			isRepack: boolean;
		};
	};
	customFormats: unknown[];
	customFormatScore: number;
	size: number;
	title: string;
	sizeleft: number;
	timeleft?: string;
	estimatedCompletionTime?: string;
	added: string;
	status: string;
	trackedDownloadStatus: string;
	trackedDownloadState: string;
	statusMessages: unknown[];
	downloadId: string;
	protocol: string;
	downloadClient: string;
	downloadClientHasPostImportCategory: boolean;
	indexer: string;
	outputPath: string;
	id: number;
}

export interface Movie {
	title: string;
	originalTitle: string;
	originalLanguage: Language;
	alternateTitles: AlternateTitle[];
	secondaryYearSourceId: number;
	sortTitle: string;
	sizeOnDisk: number;
	status: string;
	overview: string;
	inCinemas?: string;
	physicalRelease?: string;
	digitalRelease?: string;
	images: Image[];
	website: string;
	year: number;
	youTubeTrailerId: string;
	studio: string;
	path: string;
	qualityProfileId: number;
	hasFile: boolean;
	movieFileId: number;
	monitored: boolean;
	minimumAvailability: string;
	isAvailable: boolean;
	folderName: string;
	runtime: number;
	cleanTitle: string;
	imdbId: string;
	tmdbId: number;
	titleSlug: string;
	rootFolderPath: string;
	certification?: string;
	genres: string[];
	tags: number[];
	added: string;
	ratings: {
		imdb?: {
			votes: number;
			value: number;
			type: string;
		};
		tmdb: {
			votes: number;
			value: number;
			type: string;
		};
		metacritic?: {
			votes: number;
			value: number;
			type: string;
		};
		rottenTomatoes?: {
			votes: number;
			value: number;
			type: string;
		};
	};
	movieFile?: {
		movieId: number;
		relativePath: string;
		path: string;
		size: number;
		dateAdded: string;
		sceneName?: string;
		releaseGroup?: string;
		edition?: string;
		languages: Language[];
		quality: {
			quality: {
				id: number;
				name: string;
				source: string;
				resolution: number;
				modifier: string;
			};
			revision: {
				version: number;
				real: number;
				isRepack: boolean;
			};
		};
		customFormatScore: number;
		indexerFlags: number;
		mediaInfo?: {
			audioBitrate: number;
			audioChannels: number;
			audioCodec?: string;
			audioLanguages: string;
			audioStreamCount: number;
			videoBitDepth: number;
			videoBitrate: number;
			videoCodec: string;
			videoFps: number;
			videoDynamicRange: string;
			videoDynamicRangeType: string;
			resolution: string;
			runTime: string;
			scanType: string;
			subtitles: string;
		};
		originalFilePath?: string;
		qualityCutoffNotMet: boolean;
		id: number;
	};
	popularity: number;
	statistics: {
		movieFileCount: number;
		sizeOnDisk: number;
		releaseGroups: string[];
	};
	id: number;
	collection?: {
		title: string;
		tmdbId: number;
	};
	secondaryYear?: number;
}

export interface Language {
	id: number;
	name: string;
}

export interface AlternateTitle {
	sourceType: string;
	movieMetadataId: number;
	title: string;
	id: number;
}

export interface Image {
	coverType: string;
	url: string;
	remoteUrl: string;
}

export interface Language {
	id: number;
	name: string;
}
