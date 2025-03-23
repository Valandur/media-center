export interface Output {
	filename: string;
	pos: number;
	output: string;
	pendingOutput: boolean;
	running: boolean;
}

export interface Device {
	devicename: string;
	canonicaldevicefile: string;
	devicefile: string;
	devicelinks: string[];
	model: string;
	size: string;
	description: string;
	vendor: string;
	serialnumber: string;
	wwn: string;
	israid: boolean;
	isroot: boolean;
	isreadonly: boolean;
	powermode: string;
	temperature: number;
	hotpluggable: boolean;
}

export interface DockerContainer extends DockerService, DockerStats {
	runningAction: string | null;
}

export interface DockerService {
	name: string;
	image: string;
	project: string;
	service: string;
	ports: string;
	created: string;
	state: string;
	status: string;
	filepath: string;
	envpath: string;
}

export interface DockerStats {
	id: string;
	name: string;
	cpu: number;
	memuse: number;
	memlim: number;
	mem: number;
	netin: number;
	netout: number;
	blockin: number;
	blockout: number;
	pids: number;
}

export interface FileSystem {
	devicename: string;
	devicefile: string;
	predictabledevicefile: string;
	canonicaldevicefile: string;
	parentdevicefile: string;
	devlinks: string[];
	uuid: string;
	label: string;
	type: string;
	blocks: string;
	mounted: boolean;
	mountpoint: string;
	used: string;
	available: string;
	size: string;
	percentage: number;
	description: string;
	propposixacl: boolean;
	propquota: boolean;
	propresize: boolean;
	propfstab: boolean;
	propcompress: boolean;
	propautodefrag: boolean;
	hasmultipledevices: boolean;
	devicefiles: string[];
	comment: string;
	_readonly: boolean;
	_used: boolean;
	propreadonly: boolean;
	usagewarnthreshold: number;
	mountopts: string;
	status: number;
}

export interface SmartDevice {
	devicename: string;
	canonicaldevicefile: string;
	devicefile: string;
	devicelinks: string[];
	model: string;
	size: string;
	temperature: number;
	description: string;
	vendor: string;
	serialnumber: string;
	wwn: string;
	overallstatus: string;
	uuid: string;
	monitor: boolean;
	_used: boolean;
}

export interface SystemInfo {
	ts: number;
	time: string;
	hostname: string;
	version: string;
	cpuModelName: string;
	cpuUtilization: number;
	cpuCores: string;
	cpuMhz: string;
	memTotal: string;
	memFree: string;
	memUsed: string;
	memAvailable: string;
	memUtilization: string;
	kernel: string;
	uptime: number;
	loadAverage: LoadAverage;
	configDirty: boolean;
	dirtyModules: Record<string, string>;
	rebootRequired: boolean;
	availablePkgUpdates: number;
	displayWelcomeMessage: boolean;
}

export interface LoadAverage {
	'1min': number;
	'5min': number;
	'15min': number;
}

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

export interface ZfsStats {
	hits: string;
	misses: string;
	hitsMisses: number;
	ratio: number;
	size: string;
}
