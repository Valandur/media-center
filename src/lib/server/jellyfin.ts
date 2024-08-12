import { env } from '$env/dynamic/private';
import { differenceInSeconds } from 'date-fns/differenceInSeconds';

import type { Session } from '$lib/models/jellyfin';

import { Service } from './service';
import { fetch } from './fetch';

const BASE_URL = env.JELLYFIN_URL;
const URL = `${BASE_URL}/Sessions?ActiveWithinSeconds=960`;
const API_KEY = env.JELLYFIN_API_KEY;
const MAX_CACHE_TIME = 10; // in seconds

class Jellyfin extends Service {
	private sessionsUpdate = new Date(0);
	private sessionsCache: Session[] | null = null;

	public constructor() {
		super('JELLYFIN');
	}

	async getInfo(): Promise<Session[]> {
		if (
			this.sessionsCache &&
			differenceInSeconds(new Date(), this.sessionsUpdate) < MAX_CACHE_TIME
		) {
			return this.sessionsCache;
		}

		const res = await fetch(URL, {
			headers: { Authorization: `MediaBrowser Token="${API_KEY}"` }
		});

		if (res.status !== 200) {
			throw new Error(`Failed to fetch Jellyfin info: ${res.status}`);
		}

		const data = (await res.json()) as Session[];

		this.sessionsCache = data;
		this.sessionsUpdate = new Date();
		return data;
	}
}

export const jellyfin = new Jellyfin();
