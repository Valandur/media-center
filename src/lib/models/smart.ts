export interface SmartInfo {
	total: number;
	data: SmartDevice[];
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
