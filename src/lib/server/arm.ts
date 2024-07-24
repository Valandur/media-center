import makeFetchCookie from 'fetch-cookie';
import { CookieJar } from 'tough-cookie';
import { env } from '$env/dynamic/private';

import type { ArmJob, ArmResult } from '$lib/models/arm';

const LOGIN_URL = `${env.ARM_URL}/login`;
const JOB_LIST_URL = `${env.ARM_URL}/json?mode=joblist`;
const CSRF_REGEX = /name="csrf_token" type="hidden" value="(.*?)"/i;

const cookieJar = new CookieJar();
const fetchWithCookies = makeFetchCookie(fetch, cookieJar);

export async function getJobList(): Promise<ArmJob[]> {
	const res = await request(JOB_LIST_URL);
	const data: ArmResult = await res.json();
	const jobs = Object.keys(data.results).map((key) => data.results[key]);
	return jobs;
}

async function request(url: string, retry = true) {
	const res = await fetchWithCookies(url);
	if (res.redirected && res.url.endsWith('/login') && retry) {
		await auth();
		return request(url, false);
	}
	return res;
}

async function auth() {
	const tokenRes = await fetchWithCookies(LOGIN_URL);
	const tokenText = await tokenRes.text();
	const tokenMatch = CSRF_REGEX.exec(tokenText);
	if (!tokenMatch) {
		throw new Error('Could not find CSRF token');
	}

	const token = tokenMatch[1];

	const form = new FormData();
	form.set('username', env.ARM_USERNAME);
	form.set('password', env.ARM_PASSWORD);
	form.set('save', 'save');
	form.set('csrf_token', token);

	await fetchWithCookies(LOGIN_URL, { method: 'POST', body: form });
}
