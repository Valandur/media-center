export interface Container {
	id: string;
	name: string;
	image: string;
	ports: string;
	mounts: string;
	created: string;
	state: string;
	status: string;
	running: string;
	command: string;
	network: string;
}

export interface Service {
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
