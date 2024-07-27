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
