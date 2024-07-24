export interface ArmResult {
	arm_name: string;
	mode: string;
	notes: unknown[];
	results: ArmJobs;
	success: boolean;
}

export type ArmJobs = Record<string, ArmJob>;

export interface ArmJob {
	arm_version: string;
	config: Record<string, string>;
	crc_id: string;
	devpath: string;
	disctype: string;
	ejected: string;
	errors: string;
	eta: string;
	hasnicetitle: string;
	imdb_id: string;
	imdb_id_auto: string;
	imdb_id_manual: string;
	is_iso: string;
	job_id: string;
	job_length: string;
	label: string;
	logfile: string;
	mountpoint: string;
	no_of_titles: string;
	path: string;
	pid: string;
	pid_hash: string;
	poster_url: string;
	poster_url_auto: string;
	poster_url_manual: string;
	progress: string;
	progress_round: string;
	stage: string;
	start_time: string;
	status: string;
	stop_time: string;
	title: string;
	title_auto: string;
	title_manual: string;
	updated: string;
	video_type: string;
	video_type_auto: string;
	video_type_manual: string;
	year: string;
	year_auto: string;
	year_manual: string;
}
