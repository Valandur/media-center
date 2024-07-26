import makeFetchCookie from 'fetch-cookie';
import { CookieJar } from 'tough-cookie';
import { env } from '$env/dynamic/private';

import type { ArmJob, ArmResult } from '$lib/models/arm';
import type { Title } from '$lib/models/title';

import { Service } from './service';

const LOGIN_URL = `${env.ARM_URL}/login`;
const JOB_LIST_URL = `${env.ARM_URL}/json?mode=joblist`;
const SET_TITLE_URL = `${env.ARM_URL}/updatetitle`;
const CSRF_REGEX = /name="csrf_token" type="hidden" value="(.*?)"/i;

class ARM extends Service {
	private readonly cookieJar = new CookieJar();
	private readonly fetch = makeFetchCookie(fetch, this.cookieJar);

	public constructor() {
		super('ARM');
	}

	public async getJobList(): Promise<ArmJob[]> {
		const res = await this.request(JOB_LIST_URL);
		const data: ArmResult = await res.json();
		const jobs = Object.keys(data.results).map((key) => data.results[key]);
		return jobs;
	}

	public async setTitle(id: string, title: Title) {
		const params = new URLSearchParams();
		params.set('title', title.Title);
		params.set('year', title.Year);
		params.set('imdbID', title.imdbID);
		params.set('type', title.Type);
		params.set('poster', title.Poster);
		params.set('job_id', id);
		const url = `${SET_TITLE_URL}?${params.toString()}`;
		const res = await this.request(url);
		if (res.status !== 200) {
			throw new Error('Could not set title: ' + res.status);
		}
	}

	private async request(url: string, retry = true): Promise<Response> {
		let status = 0;

		try {
			const res = await this.fetch(url);
			status = res.status;

			if (res.redirected && res.url.endsWith('/login') && retry) {
				await this.auth();
				return this.request(url, false);
			}
			return res;
		} finally {
			this.logger.debug('GET', url, status);
		}
	}

	private async auth() {
		const tokenRes = await this.fetch(LOGIN_URL);
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

		const res = await this.fetch(LOGIN_URL, { method: 'POST', body: form });
		if (res.status !== 200) {
			throw new Error('Authentication not successfull: ' + res.status);
		}
	}
}

export const arm = new ARM();
