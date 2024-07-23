import makeFetchCookie from 'fetch-cookie';
import { CookieJar } from 'tough-cookie';
import { env } from '$env/dynamic/private';
import { differenceInSeconds } from 'date-fns/differenceInSeconds';

import type { SmartDevice } from '$lib/models/smart';
import type { Container } from '$lib/models/docker';
import type { FileSystem } from '$lib/models/file-system';
import type { Device } from '$lib/models/device';

const cookieJar = new CookieJar();
const fetchWithCookies = makeFetchCookie(fetch, cookieJar);

let devUpdate = new Date(0);
let devCache: Device[] = [];
export async function getDevices(): Promise<Device[]> {
	if (devCache && differenceInSeconds(new Date(), devUpdate) < 60) {
		return devCache;
	}

	const res = await request<Device[]>({
		service: 'DiskMgmt',
		method: 'enumerateDevices',
		params: { start: 0, limit: -1 }
	});
	devCache = res;
	devUpdate = new Date();
	return devCache;
}

export async function getSmartDevices(): Promise<SmartDevice[]> {
	const res = await request<{ data: SmartDevice[] }>({
		service: 'Smart',
		method: 'getList',
		params: { start: 0, limit: -1 }
	});
	return res.data;
}

export async function getFileSystems(): Promise<FileSystem[]> {
	const res = await request<{ data: FileSystem[] }>({
		service: 'FileSystemMgmt',
		method: 'getList',
		params: { start: 0, limit: -1 }
	});
	return res.data;
}

export async function getComposeContainers(): Promise<Container[]> {
	const res = await request<Container[]>({
		service: 'Compose',
		method: 'getContainers'
	});
	return res;
}

async function request<T>(body: Record<string, unknown>, retry = true): Promise<T> {
	const res = await fetchWithCookies(env.OMV_RPC, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
		credentials: 'include'
	});

	const wrapper = await res.json();

	if ('error' in wrapper && wrapper.error) {
		if (typeof wrapper.error === 'object' && 'message' in wrapper.error) {
			if (wrapper.error.message === 'Session not authenticated.' && retry) {
				await auth();
				return request(body, false);
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
}

let authPending = false;
const authCallbacks: Set<[() => void, (err: Error) => void]> = new Set();
async function auth() {
	if (authPending) {
		return new Promise<void>((resolve, reject) => {
			authCallbacks.add([resolve, reject]);
		});
	}

	authPending = true;
	const res = await fetchWithCookies(env.OMV_RPC, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
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
		authPending = false;
		authCallbacks.forEach(([, reject]) => reject(err));
		authCallbacks.clear();
		throw err;
	}

	authPending = false;
	authCallbacks.forEach(([resolve]) => resolve());
	authCallbacks.clear();
}
