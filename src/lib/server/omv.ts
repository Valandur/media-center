import makeFetchCookie from 'fetch-cookie';
import { CookieJar } from 'tough-cookie';
import { env } from '$env/dynamic/private';
import { differenceInSeconds } from 'date-fns/differenceInSeconds';

import type { SmartDevice } from '$lib/models/smart';
import type { Container } from '$lib/models/docker';
import type { FileSystem } from '$lib/models/file-system';
import type { Device } from '$lib/models/device';
import type { Output } from '$lib/models/output';
import type { ZfsPool } from '$lib/models/zfs';

import { Service } from './service';

const OUTPUT_CHECK_INTERVAL = 1000;

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

	public async getDevices(): Promise<Device[]> {
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
	}

	public async getSmartDevices(): Promise<SmartDevice[]> {
		const res = await this.requestAsync<{ data: SmartDevice[] }>('Smart', 'getListBg', {
			start: 0,
			limit: -1
		});
		return res.data;
	}

	public async getFileSystems(): Promise<FileSystem[]> {
		const res = await this.requestAsync<{ data: FileSystem[] }>('FileSystemMgmt', 'getListBg', {
			start: 0,
			limit: -1
		});
		return res.data;
	}

	public async getComposeContainers(): Promise<Container[]> {
		const res = await this.request<Container[]>('Compose', 'getContainers');
		return res;
	}

	public async getZfsPools(): Promise<ZfsPool[]> {
		const res = await this.requestAsync<{ data: ZfsPool[] }>('Zfs', 'listPoolsBg', {
			start: 0,
			limit: -1
		});
		return res.data;
	}

	private async request<T>(
		service: string,
		method: string,
		params?: Record<string, unknown>,
		retry = true
	): Promise<T> {
		let status = 0;
		const url = env.OMV_RPC;

		try {
			const res = await this.fetch(url, {
				method: 'POST',
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
						console.error(wrapper.error.message);
						throw new Error(wrapper.error.message);
					}
				}
				console.error(wrapper.error);
				throw new Error(JSON.stringify(wrapper.error));
			}

			if (!('response' in wrapper)) {
				console.error(wrapper);
				throw new Error('Missing response!');
			}

			return wrapper.response;
		} finally {
			this.logger.debug('GET', url, service, method, status);
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
		const res = await this.fetch(env.OMV_RPC, {
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
