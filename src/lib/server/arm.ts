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

// Title search
// await fetch("https://arm.home/titlesearch?csrf_token=ImIyZjA5MzNlZDIxNmIzY2E1YzJlMDhjYzA4YTE0NWQxZDUyMmZkYjYi.ZqJsbA.m0rgtfG85OT1uSEgW-_4SUiDBUg&title=7th+heaven&year=1978%E2%80%93&save=save&job_id=19", {
// 	"credentials": "include",
// 	"headers": {
// 			"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0",
// 			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8",
// 			"Accept-Language": "en,en-US;q=0.7,de;q=0.3",
// 			"Upgrade-Insecure-Requests": "1",
// 			"Sec-Fetch-Dest": "document",
// 			"Sec-Fetch-Mode": "navigate",
// 			"Sec-Fetch-Site": "same-origin",
// 			"Sec-Fetch-User": "?1",
// 			"Priority": "u=0, i"
// 	},
// 	"referrer": "https://arm.home/titlesearch?job_id=19",
// 	"method": "GET",
// 	"mode": "cors"
// });

// await fetch("https://arm.home/list_titles?title=7th+heaven&year=1978%E2%80%93&job_id=19", {
// 	"credentials": "include",
// 	"headers": {
// 			"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0",
// 			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8",
// 			"Accept-Language": "en,en-US;q=0.7,de;q=0.3",
// 			"Upgrade-Insecure-Requests": "1",
// 			"Sec-Fetch-Dest": "document",
// 			"Sec-Fetch-Mode": "navigate",
// 			"Sec-Fetch-Site": "same-origin",
// 			"Sec-Fetch-User": "?1",
// 			"Priority": "u=0, i"
// 	},
// 	"referrer": "https://arm.home/titlesearch?job_id=19",
// 	"method": "GET",
// 	"mode": "cors"
// });

// await fetch("https://arm.home/gettitle?imdbID=tt0115083&job_id=19", {
// 	"credentials": "include",
// 	"headers": {
// 			"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0",
// 			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8",
// 			"Accept-Language": "en,en-US;q=0.7,de;q=0.3",
// 			"Upgrade-Insecure-Requests": "1",
// 			"Sec-Fetch-Dest": "document",
// 			"Sec-Fetch-Mode": "navigate",
// 			"Sec-Fetch-Site": "same-origin",
// 			"Sec-Fetch-User": "?1",
// 			"Priority": "u=0, i"
// 	},
// 	"referrer": "https://arm.home/list_titles?title=7th+heaven&year=1978%E2%80%93&job_id=19",
// 	"method": "GET",
// 	"mode": "cors"
// });

// await fetch("https://arm.home/updatetitle?title=7th%20Heaven&year=1996%E2%80%932007&imdbID=tt0115083&type=series&poster=https://m.media-amazon.com/images/M/MV5BZGEzZDJiYjUtMjU3Yy00YjBmLWE4OWQtYjM4ZDhlZTg3Zjk0XkEyXkFqcGdeQXVyNjU2NjA5NjM@._V1_SX300.jpg&job_id=19", {
// 	"credentials": "include",
// 	"headers": {
// 			"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:128.0) Gecko/20100101 Firefox/128.0",
// 			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8",
// 			"Accept-Language": "en,en-US;q=0.7,de;q=0.3",
// 			"Upgrade-Insecure-Requests": "1",
// 			"Sec-Fetch-Dest": "document",
// 			"Sec-Fetch-Mode": "navigate",
// 			"Sec-Fetch-Site": "same-origin",
// 			"Sec-Fetch-User": "?1",
// 			"Priority": "u=0, i"
// 	},
// 	"referrer": "https://arm.home/gettitle?imdbID=tt0115083&job_id=19",
// 	"method": "GET",
// 	"mode": "cors"
// });
