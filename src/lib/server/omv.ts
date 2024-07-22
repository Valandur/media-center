import makeFetchCookie from 'fetch-cookie';
import { CookieJar } from 'tough-cookie';
import { env } from '$env/dynamic/private';

import type { SmartDevice } from '$lib/models/smart';

const cookieJar = new CookieJar();
const fetchWithCookies = makeFetchCookie(fetch, cookieJar);
let isAuth = false;

export async function getSmartDevices(): Promise<SmartDevice[]> {
	if (!isAuth) {
		await fetchWithCookies(env.OMV_RPC, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				service: 'Session',
				method: 'login',
				params: { username: env.OMV_USERNAME, password: env.OMV_PASSWORD }
			}),
			credentials: 'include'
		});
		isAuth = true;
	}

	const res = await fetchWithCookies(env.OMV_RPC, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			service: 'Smart',
			method: 'getList',
			params: { limit: -1, start: 0 }
		}),
		credentials: 'include'
	});
	const wrapper = await res.json();
	if ('error' in wrapper && wrapper.error) {
		throw new Error(wrapper.error);
	}
	if (!('response' in wrapper)) {
		throw new Error('Missing response!');
	}
	return wrapper.response.data;
}
