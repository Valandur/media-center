export interface Job {
	duration: number;
	endTime: string;
	error: string;
	finished: boolean;
	group: string;
	id: number;
	output?: Output;
	startTime: string;
	success: boolean;
}

export interface Output {
	duration?: number;
	endTime?: string;
	error?: string;
	finished?: boolean;
	group?: string;
	id?: number;
	output?: Output2;
	startTime?: string;
	success?: boolean;
	executeId?: string;
	jobids?: number[];
}

export interface Output2 {
	executeId?: string;
	jobids?: number[];
	duration?: number;
	endTime?: string;
	error?: string;
	finished?: boolean;
	group?: string;
	id?: number;
	output?: Output3;
	startTime?: string;
	success?: boolean;
}

export interface Output3 {
	executeId: string;
	jobids: number[];
}
