export interface Transfer {
	id: number;

	name: string;
	srcFs: string;
	dstFs: string;
	size: number;
}

export interface TransferInProgress extends Transfer {
	bytes: number;
	eta: number;
	group: string;
	percentage: number;
	speed: number;
	speedAvg: number;
}

export function isInProgress(transfer: Transfer): transfer is TransferInProgress {
	return 'bytes' in transfer && typeof transfer.bytes === 'number';
}
