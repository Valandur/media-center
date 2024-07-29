import makeFetchCookie from 'fetch-cookie';
import { CookieJar } from 'tough-cookie';
import { env } from '$env/dynamic/private';
import { differenceInSeconds } from 'date-fns/differenceInSeconds';
import { error } from '@sveltejs/kit';

import type { SmartDevice } from '$lib/models/smart';
import type { Container, Service as DockerService } from '$lib/models/docker';
import type { FileSystem } from '$lib/models/file-system';
import type { Device } from '$lib/models/device';
import type { Output } from '$lib/models/output';
import type { ZfsPool, ZfsStats } from '$lib/models/zfs';
import type { SystemInfo } from '$lib/models/system';

import { Service } from './service';

const OUTPUT_CHECK_INTERVAL = 1000;
const RPC_URL = `${env.OMV_URL}/rpc.php`;
const DOWNLOAD_URL = `${env.OMV_URL}/download.php`;

class OMV extends Service {
	private cookieJar = new CookieJar();
	private fetch = makeFetchCookie(fetch, this.cookieJar);

	private devUpdate = new Date(0);
	private devCache: Device[] = [];

	private authPending = false;
	private authCallbacks: Set<[() => void, (err: Error) => void]> = new Set();

	public constructor() {
		super('OMV');
	}

	public async getSystemInformation(): Promise<SystemInfo> {
		try {
			const res = await this.request<SystemInfo>('System', 'getInformation');
			return res;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async getCpuTemp(): Promise<number> {
		try {
			const res = await this.request<{ cputemp: number }>('CpuTemp', 'get');
			return res.cputemp;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async getCpuUsage(): Promise<string> {
		try {
			this.logger.debug(
				`${DOWNLOAD_URL}?service=Rrd&method=getGraph&params={"kind":"cpu-0","period":"hour"}`
			);
			const res = await this.fetch(
				`${DOWNLOAD_URL}?service=Rrd&method=getGraph&params={"kind":"cpu-0","period":"hour"}`,
				{
					credentials: 'include'
				}
			);
			if (res.status !== 200) {
				throw new Error('Could not load cpu usage: ' + res.status);
			}
			const img = Buffer.from(await res.arrayBuffer());
			return `data:image/png;base64,${img.toString('base64')}`;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async getZfsStats(): Promise<ZfsStats> {
		try {
			const res = await this.request<ZfsStats>('Zfs', 'getStats');
			return res;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async getDevices(): Promise<Device[]> {
		try {
			if (this.devCache && differenceInSeconds(new Date(), this.devUpdate) < 60) {
				return this.devCache;
			}

			const res = await this.request<Device[]>('DiskMgmt', 'enumerateDevices', {
				start: 0,
				limit: -1
			});
			this.devCache = res;
			this.devUpdate = new Date();
			return this.devCache;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async getSmartDevices(): Promise<SmartDevice[]> {
		try {
			const res = await this.requestAsync<{ data: SmartDevice[] }>('Smart', 'getListBg', {
				start: 0,
				limit: -1
			});
			return res.data;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async getFileSystems(): Promise<FileSystem[]> {
		try {
			const res = await this.requestAsync<{ data: FileSystem[] }>('FileSystemMgmt', 'getListBg', {
				start: 0,
				limit: -1
			});
			return res.data;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async getComposeServices(): Promise<DockerService[]> {
		try {
			const res = await this.requestAsync<{ data: DockerService[] }>(
				'Compose',
				'getServicesListBg',
				{ start: 0, limit: -1, sortdir: 'asc', sortfield: 'name' }
			);
			return res.data;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async doComposeServiceCommand(
		cmd: string,
		service: string,
		filepath: string,
		envpath: string
	): Promise<void> {
		try {
			const res = await this.requestAsync('Compose', 'doServiceCommand', {
				command: cmd,
				command2: '',
				service: service,
				envpath: envpath,
				path: filepath
			});
			this.logger.info('Compose', 'doServiceCommand', cmd, service, res);
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async getComposeContainers(): Promise<Container[]> {
		try {
			const res = await this.requestAsync<Container[]>('Compose', 'getContainerListBg', {
				start: 0,
				limit: -1,
				sortdir: 'asc',
				sortfield: 'name'
			});
			return res;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async getZfsPools(): Promise<ZfsPool[]> {
		try {
			const res = await this.requestAsync<{ data: ZfsPool[] }>('Zfs', 'listPoolsBg', {
				start: 0,
				limit: -1
			});
			return res.data;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	private async request<T>(
		service: string,
		method: string,
		params?: Record<string, unknown>,
		retry = true
	): Promise<T> {
		let status = 0;
		const url = RPC_URL;
		const httpMethod = 'POST';

		try {
			const res = await this.fetch(url, {
				method: httpMethod,
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					service,
					method,
					params
				}),
				credentials: 'include'
			});
			status = res.status;

			const wrapper = await res.json();

			if ('error' in wrapper && wrapper.error) {
				if (typeof wrapper.error === 'object' && 'message' in wrapper.error) {
					if (wrapper.error.message === 'Session not authenticated.' && retry) {
						await this.auth();
						return this.request(service, method, params, false);
					} else {
						this.logger.error(httpMethod, url, service, method, wrapper.error.message);
						throw new Error(wrapper.error.message);
					}
				}
				this.logger.error(httpMethod, url, service, method, wrapper.error);
				throw new Error(JSON.stringify(wrapper.error));
			}

			if (!('response' in wrapper)) {
				this.logger.error(httpMethod, url, service, method, wrapper);
				throw new Error('Missing response!');
			}

			return wrapper.response;
		} finally {
			this.logger.debug(httpMethod, url, service, method, status);
		}
	}

	private async requestAsync<T>(service: string, method: string, params?: Record<string, unknown>) {
		const filename = await this.request<string>(service, method, params);
		const res = await this.waitForOutput<T>(filename);
		return res;
	}

	private async waitForOutput<T>(filename: string): Promise<T> {
		let output: T | null = null;
		let i = 0;
		while (output === null) {
			await new Promise((resolve) => setTimeout(resolve, OUTPUT_CHECK_INTERVAL));
			const res = await this.request<Output>('Exec', 'getOutput', { filename, pos: 0 });
			if (!res.running && !res.pendingOutput) {
				output = JSON.parse(res.output);
				break;
			}
			i++;
			if (i >= 10) {
				throw new Error('Timed out waiting for output result');
			}
		}
		if (output === null) {
			throw new Error('Could not get output');
		}
		return output;
	}

	private async auth() {
		if (this.authPending) {
			return new Promise<void>((resolve, reject) => {
				this.authCallbacks.add([resolve, reject]);
			});
		}

		this.authPending = true;
		const res = await this.fetch(RPC_URL, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				service: 'Session',
				method: 'login',
				params: { username: env.OMV_USERNAME, password: env.OMV_PASSWORD }
			}),
			credentials: 'include'
		});
		const wrapper = await res.json();

		if ('error' in wrapper && wrapper.error) {
			const err = new Error('Could not authenticate: ' + JSON.stringify(wrapper.error));
			this.authPending = false;
			this.authCallbacks.forEach(([, reject]) => reject(err));
			this.authCallbacks.clear();
			throw err;
		}

		this.authPending = false;
		this.authCallbacks.forEach(([resolve]) => resolve());
		this.authCallbacks.clear();
	}
}

export const omv = new OMV();
