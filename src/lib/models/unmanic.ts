export interface WorkersInfoResponse {
	success: boolean;
	server_id: string;
	type: string;
	data: WorkerInfo[];
}

export interface WorkerInfo {
	id: string;
	name: string;
	idle: boolean;
	paused: boolean;
	start_time: string;
	current_task?: number;
	current_file: string;
	worker_log_tail: string[];
	runners_info: RunnersInfo;
	subprocess: Subprocess;
}

export interface RunnersInfo {
	video_transcoder?: VideoTranscoder;
}

export interface VideoTranscoder {
	plugin_id: string;
	status: string;
	name: string;
	author: string;
	version: string;
	icon: string;
	description: string;
	success: boolean;
}

export interface Subprocess {
	pid: string;
	percent: string;
	elapsed: number;
	cpu_percent: string;
	mem_percent: string;
	rss_bytes: string;
	vms_bytes: string;
}
