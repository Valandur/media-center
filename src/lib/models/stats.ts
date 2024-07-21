import type { Transfer } from './transfer';

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
