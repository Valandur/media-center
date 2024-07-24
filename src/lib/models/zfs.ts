export interface ZfsPool {
	id: string;
	parentid: string;
	name: string;
	type: string;
	icon: string;
	expanded: boolean;
	path: string;
	origin: string;
	size: number;
	used: number;
	usedpercent: number;
	available: number;
	mountpoint: string;
	lastscrub: unknown;
	state: string;
	status: string;
}
