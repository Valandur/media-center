export interface NextcloudResponse {
	ocs: Ocs;
}

export interface Ocs {
	meta: Meta;
	data: NextcloudInfo;
}

export interface Meta {
	status: string;
	statuscode: number;
	message: string;
}

export interface NextcloudInfo {
	nextcloud: Nextcloud;
	server: Server;
	activeUsers: ActiveUsers;
}

export interface Nextcloud {
	system: System;
	storage: Storage;
	shares: Shares;
}

export interface System {
	version: string;
	theme: string;
	enable_avatars: string;
	enable_previews: string;
	'memcache.local': string;
	'memcache.distributed': string;
	'filelocking.enabled': string;
	'memcache.locking': string;
	debug: string;
	freespace: number;
	cpuload: number[];
	mem_total: number;
	mem_free: number;
	swap_total: number;
	swap_free: number;
	update: Update;
}

export interface Update {
	lastupdatedat: number;
	available: boolean;
}

export interface Storage {
	num_users: number;
	num_files: number;
	num_storages: number;
	num_storages_local: number;
	num_storages_home: number;
	num_storages_other: number;
}

export interface Shares {
	num_shares: number;
	num_shares_user: number;
	num_shares_groups: number;
	num_shares_link: number;
	num_shares_mail: number;
	num_shares_room: number;
	num_shares_link_no_password: number;
	num_fed_shares_sent: number;
	num_fed_shares_received: number;
	permissions_0_31: number;
}

export interface Server {
	webserver: string;
	php: Php;
	database: Database;
}

export interface Php {
	version: string;
	memory_limit: number;
	max_execution_time: number;
	upload_max_filesize: number;
	opcache_revalidate_freq: number;
	opcache: Opcache;
	apcu: Apcu;
	extensions: string[];
}

export interface Opcache {
	opcache_enabled: boolean;
	cache_full: boolean;
	restart_pending: boolean;
	restart_in_progress: boolean;
	memory_usage: MemoryUsage;
	interned_strings_usage: InternedStringsUsage;
	opcache_statistics: OpcacheStatistics;
	jit: Jit;
}

export interface MemoryUsage {
	used_memory: number;
	free_memory: number;
	wasted_memory: number;
	current_wasted_percentage: number;
}

export interface InternedStringsUsage {
	buffer_size: number;
	used_memory: number;
	free_memory: number;
	number_of_strings: number;
}

export interface OpcacheStatistics {
	num_cached_scripts: number;
	num_cached_keys: number;
	max_cached_keys: number;
	hits: number;
	start_time: number;
	last_restart_time: number;
	oom_restarts: number;
	hash_restarts: number;
	manual_restarts: number;
	misses: number;
	blacklist_misses: number;
	blacklist_miss_ratio: number;
	opcache_hit_rate: number;
}

export interface Jit {
	enabled: boolean;
	on: boolean;
	kind: number;
	opt_level: number;
	opt_flags: number;
	buffer_size: number;
	buffer_free: number;
}

export interface Apcu {
	cache: Cache;
	sma: Sma;
}

export interface Cache {
	num_slots: number;
	ttl: number;
	num_hits: number;
	num_misses: number;
	num_inserts: number;
	num_entries: number;
	expunges: number;
	start_time: number;
	mem_size: number;
	memory_type: string;
}

export interface Sma {
	num_seg: number;
	seg_size: number;
	avail_mem: number;
}

export interface Database {
	type: string;
	version: string;
	size: string;
}

export interface ActiveUsers {
	last5minutes: number;
	last1hour: number;
	last24hours: number;
}
