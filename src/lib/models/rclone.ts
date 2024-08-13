export interface Stats {
	bytes: number;
	checks: number;
	deletedDirs: number;
	deletes: number;
	elapsedTime: number;
	errors: number;
	eta: number | null;
	fatalError: boolean;
	renames: number;
	retryError: boolean;
	serverSideCopies: number;
	serverSideCopyBytes: number;
	serverSideMoveBytes: number;
	serverSideMoves: number;
	speed: number;
	totalBytes: number;
	totalChecks: number;
	totalTransfers: number;
	transferTime: number;
	transfers: number;

	checking?: string[];
	transferring?: Transfer[];
}

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
