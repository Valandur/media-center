import { env } from '$env/dynamic/private';

import type { NextcloudInfo, NextcloudResponse } from '$lib/models/nextcloud';
import { differenceInSeconds } from 'date-fns/differenceInSeconds';

import { Service } from './service';
import { fetch } from './fetch';

const BASE_URL = env.NEXTCLOUD_URL;
const URL = `${BASE_URL}/ocs/v2.php/apps/serverinfo/api/v1/info?format=json`;
const API_KEY = env.NEXTCLOUD_API_KEY;
const MAX_CACHE_TIME = 600; // in seconds

class Nextcloud extends Service {
	private infoUpdate = new Date(0);
	private infoCache: NextcloudInfo | null = null;

	public constructor() {
		super('NEXTCLOUD');
	}

	async getInfo(): Promise<NextcloudInfo> {
		if (this.infoCache && differenceInSeconds(new Date(), this.infoUpdate) < MAX_CACHE_TIME) {
			return this.infoCache;
		}

		const res = await fetch(URL, {
			headers: { 'NC-Token': API_KEY }
		});

		if (res.status !== 200) {
			throw new Error(`Failed to fetch Nextcloud info: ${res.status}`);
		}

		const data = (await res.json()) as NextcloudResponse;

		this.infoCache = data.ocs.data;
		this.infoUpdate = new Date();
		return data.ocs.data;
	}
}

export const nextcloud = new Nextcloud();
