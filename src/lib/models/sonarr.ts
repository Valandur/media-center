export interface QueueResponse {
	page: number;
	pageSize: number;
	sortKey: string;
	sortDirection: string;
	totalRecords: number;
	records: QueueItem[];
}

export interface QueueItem {
	seriesId: number;
	series: Series;
	episodeId: number;
	episodeNumber: number;
	seasonNumber: number;
	languages: Language[];
	quality: {
		quality: {
			id: number;
			name: string;
			source: string;
			resolution: number;
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
	episodeHasFile: boolean;
	id: number;
}

export interface Series {
	title: string;
	alternateTitles: AlternateTitle[];
	sortTitle: string;
	status: string;
	ended: boolean;
	overview: string;
	previousAiring?: string;
	network: string;
	airTime?: string;
	images: Image[];
	originalLanguage: Language;
	seasons: Season[];
	year: number;
	path: string;
	qualityProfileId: number;
	seasonFolder: boolean;
	monitored: boolean;
	monitorNewItems: string;
	useSceneNumbering: boolean;
	runtime: number;
	tvdbId: number;
	tvRageId: number;
	tvMazeId: number;
	tmdbId: number;
	firstAired: string;
	lastAired: string;
	seriesType: string;
	cleanTitle: string;
	imdbId: string;
	titleSlug: string;
	rootFolderPath: string;
	certification: string;
	genres: string[];
	tags: number[];
	added: string;
	ratings: {
		votes: number;
		value: number;
	};
	statistics: {
		seasonCount: number;
		episodeFileCount: number;
		episodeCount: number;
		totalEpisodeCount: number;
		sizeOnDisk: number;
		releaseGroups: string[];
		percentOfEpisodes: number;
	};
	languageProfileId: number;
	id: number;
}

export interface Language {
	id: number;
	name: string;
}

export interface AlternateTitle {
	title: string;
	sceneSeasonNumber?: number;
	seasonNumber?: number;
	sceneOrigin?: string;
	comment?: string;
}

export interface Image {
	coverType: string;
	url: string;
	remoteUrl: string;
}

export interface Season {
	seasonNumber: number;
	monitored: boolean;
	statistics: {
		previousAiring?: string;
		episodeFileCount: number;
		episodeCount: number;
		totalEpisodeCount: number;
		sizeOnDisk: number;
		releaseGroups: string[];
		percentOfEpisodes: number;
	};
}

export interface Episode {
	seriesId: number;
	tvdbId: number;
	episodeFileId: number;
	seasonNumber: number;
	episodeNumber: number;
	title: string;
	airDate: string;
	airDateUtc: string;
	runtime: number;
	overview: string;
	hasFile: boolean;
	monitored: boolean;
	absoluteEpisodeNumber?: number;
	unverifiedSceneNumbering: boolean;
	id: number;
	finaleType?: string;
}
