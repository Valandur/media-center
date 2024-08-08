import makeFetchCookie from 'fetch-cookie';
import { CookieJar } from 'tough-cookie';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname } from 'path';

import type { ArmJob, ArmResult } from '$lib/models/arm';
import type { Title } from '$lib/models/title';

import { Service } from './service';
import { fetch } from './fetch';

const LOGIN_URL = `${env.ARM_URL}/login`;
const JOB_LIST_URL = `${env.ARM_URL}/json?mode=joblist`;
const SET_TITLE_URL = `${env.ARM_URL}/updatetitle`;
const CSRF_REGEX = /name="csrf_token" type="hidden" value="(.*?)"/i;
const COOKIE_FILE = '.cache/arm/cookies.json';

class ARM extends Service {
	private cookieJar = new CookieJar();
	private fetch = makeFetchCookie(fetch, this.cookieJar);

	public constructor() {
		super('ARM');
	}

	public async getJobList(): Promise<ArmJob[]> {
		try {
			const res = await this.request(JOB_LIST_URL);
			const data: ArmResult = await res.json();
			const jobs = Object.keys(data.results).map((key) => data.results[key]);
			return jobs;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	public async setTitle(id: string, title: Title) {
		try {
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
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	private async request(url: string, retry = true): Promise<Response> {
		const res = await this.fetch(url);

		if (res.redirected && res.url.endsWith('/login') && retry) {
			await this.auth();
			return this.request(url, false);
		}
		return res;
	}

	private async auth() {
		const cookieJarStr = await readFile(COOKIE_FILE, 'utf-8').catch(() => null);
		if (cookieJarStr) {
			const cookieJar = JSON.parse(cookieJarStr);
			this.cookieJar = await CookieJar.deserialize(cookieJar);
			this.fetch = makeFetchCookie(fetch, this.cookieJar);
			this.logger.debug('Restored cookies from file');
		}

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

		// Save cookies to disk
		const jar = await this.cookieJar.serialize();
		await mkdir(dirname(COOKIE_FILE), { recursive: true });
		await writeFile(COOKIE_FILE, JSON.stringify(jar), 'utf-8');
	}
}

export const arm = new ARM();
