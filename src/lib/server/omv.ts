import makeFetchCookie from 'fetch-cookie';
import { CookieJar } from 'tough-cookie';
import { env } from '$env/dynamic/private';
import { differenceInSeconds } from 'date-fns/differenceInSeconds';
import { error } from '@sveltejs/kit';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import type {
	Device,
	FileSystem,
	Output,
	DockerService,
	SmartDevice,
	SystemInfo,
	ZfsPool,
	ZfsStats,
	DockerStats,
	DockerContainer
} from '$lib/models/omv';

import { Service } from './service';
import { fetch } from './fetch';

const OUTPUT_CHECK_INTERVAL = 1000;
const URL = `${env.OMV_URL}/rpc.php`;
const DOWNLOAD_URL = `${env.OMV_URL}/download.php`;
const MAX_CACHE_TIME = 60; // in seconds
const COOKIE_FILE = '.cache/omv/cookies.json';

class OMV extends Service {
	private cookieJar = new CookieJar();
	private fetch = makeFetchCookie(fetch, this.cookieJar);

	private devUpdate = new Date(0);
	private devCache: Device[] | null = null;

	private authPending = false;
	private authCallbacks: Set<[() => void, (err: Error) => void]> = new Set();

	private runningComposeActions: Map<string, string> = new Map();

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
			if (this.devCache && differenceInSeconds(new Date(), this.devUpdate) < MAX_CACHE_TIME) {
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

	public async getCompose(): Promise<DockerContainer[]> {
		try {
			const [resServices, resStats] = await Promise.all([
				this.requestAsync<{ data: DockerService[] }>('Compose', 'getServicesListBg', {
					start: 0,
					limit: -1,
					sortdir: 'asc',
					sortfield: 'name'
				}),
				this.requestAsync<{ data: DockerStats[] }>('Compose', 'getStatsBg', {
					start: 0,
					limit: -1,
					sortdir: 'asc',
					sortfield: 'name'
				})
			]);
			return resServices.data.map((service) => ({
				...service,
				...resStats.data.find((s) => s.name === service.name)!,
				runningAction: this.runningComposeActions.get(service.name) ?? null
			}));
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async doComposeServiceCommand(
		cmd: string,
		service: string,
		filepath: string,
		envpath: string
	): Promise<string> {
		try {
			this.runningComposeActions.set(service, cmd);
			this.logger.info('Compose', 'doServiceCommand', cmd, service);
			const res = await this.requestAsync<string>(
				'Compose',
				'doServiceCommand',
				{
					command: cmd,
					command2: '',
					service: service,
					envpath: envpath,
					path: filepath
				},
				true
			);
			return res;
		} catch (err) {
			this.logger.error(err);
			error(500, (err as Error).message);
		} finally {
			this.runningComposeActions.delete(service);
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
		const res = await this.fetch(URL, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				service,
				method,
				params
			}),
			credentials: 'include'
		});

		const wrapper = await res.json();

		if (!wrapper || typeof wrapper !== 'object') {
			throw new Error(`Response data has incorrect format: ${wrapper}`);
		}
		if ('error' in wrapper && wrapper.error) {
			if (typeof wrapper.error === 'object' && 'message' in wrapper.error) {
				if (wrapper.error.message === 'Session not authenticated.' && retry) {
					await this.auth();
					return this.request(service, method, params, false);
				} else {
					throw new Error(`${wrapper.error.message}`);
				}
			}
			throw new Error(`Error with unknown format: ${JSON.stringify(wrapper.error)}`);
		}

		if (!('response' in wrapper)) {
			throw new Error('Missing response!');
		}

		return wrapper.response as T;
	}

	private async requestAsync<T>(
		service: string,
		method: string,
		params?: Record<string, unknown>,
		raw = false
	) {
		const filename = await this.request<string>(service, method, params);
		const res = await this.waitForOutput<T>(filename, raw);
		return res;
	}

	private async waitForOutput<T>(filename: string, raw = false): Promise<T> {
		let output: T | null = null;
		let i = 0;
		while (output === null) {
			await new Promise((resolve) => setTimeout(resolve, (i + 1) * OUTPUT_CHECK_INTERVAL));
			const res = await this.request<Output>('Exec', 'getOutput', { filename, pos: 0 });
			if (!res.running && !res.pendingOutput) {
				output = raw ? res.output : JSON.parse(res.output);
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

		const cookieJarStr = await readFile(COOKIE_FILE, 'utf-8').catch(() => null);
		if (cookieJarStr) {
			const cookieJar = JSON.parse(cookieJarStr);
			this.cookieJar = await CookieJar.deserialize(cookieJar);
			this.fetch = makeFetchCookie(fetch, this.cookieJar);
			this.logger.debug('Restored cookies from file');
		}

		const res = await this.fetch(URL, {
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

		if (!wrapper || typeof wrapper !== 'object' || ('error' in wrapper && wrapper.error)) {
			const err = new Error(`Could not authenticate: ${JSON.stringify(wrapper)}`);
			this.authPending = false;
			this.authCallbacks.forEach(([, reject]) => reject(err));
			this.authCallbacks.clear();
			throw err;
		}

		// Save cookies to disk
		const jar = await this.cookieJar.serialize();
		await mkdir(dirname(COOKIE_FILE), { recursive: true });
		await writeFile(COOKIE_FILE, JSON.stringify(jar), 'utf-8');

		this.authPending = false;
		this.authCallbacks.forEach(([resolve]) => resolve());
		this.authCallbacks.clear();
	}
}

export const omv = new OMV();
