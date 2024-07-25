export interface Torrent {
	id: number;
	name: string;
	isFinished: boolean;
	isStalled: boolean;
	peersConnected: number;
	peersSendingToUs: number;
	percentDone: number;
	rateDownload: number;
	sizeWhenDone: number;
	eta: number;
}
