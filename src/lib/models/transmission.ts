export interface Torrent {
	id: number;
	name: string;
	status: Status;
	isFinished: boolean;
	isStalled: boolean;
	peersConnected: number;
	peersSendingToUs: number;
	percentDone: number;
	rateDownload: number;
	sizeWhenDone: number;
	eta: number;
	rateUpload: number;
	peersGettingFromUs: number;
	uploadedEver: number;
	etaIdle: number;
}

export enum Status {
	Stopped = 0, // Torrent is stopped
	VerifyingQueued = 1, // Torrent is queued to verify local data
	Verifying = 2, // Torrent is verifying local data
	DownloadingQueued = 3, // Torrent is queued to download
	Downloading = 4, // Torrent is downloading
	SeedingQueued = 5, // Torrent is queued to seed
	Seeding = 6 // Torrent is seeding
}
