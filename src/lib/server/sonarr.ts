import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

import type { Series, QueueResponse, QueueItem, Episode } from '$lib/models/sonarr';

import { Service } from './service';
import { fetch } from './fetch';

const BASE_URL = `${env.SONARR_URL}/api/v3`;
const QUEUE_PATH =
	'/queue?page=1&pageSize=100&sortDirection=ascending&sortKey=series.sortTitle&includeUnknownMovieItems=true';
const API_KEY = env.SONARR_API_KEY;

export class Sonarr extends Service {
	public constructor() {
		super('SONARR');
	}

	public async getQueueWithSeries(): Promise<QueueItem[]> {
		try {
			const [resQueue, resSeries] = await Promise.all([
				this.request<QueueResponse>(QUEUE_PATH),
				this.request<Series[]>('/series')
			]);
			const resEpisodes = await this.request<Episode[]>(
				`/episode?${resQueue.records.map((r) => `episodeIds=${r.episodeId}`).join('&')}`
			);
			for (const record of resQueue.records) {
				record.episodeNumber = resEpisodes.find((e) => e.id === record.episodeId)!.episodeNumber;
				record.series = resSeries.find((s) => s.id === record.seriesId)!;
			}
			return resQueue.records;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	private async request<T = unknown>(path: string): Promise<T> {
		const res = await fetch(`${BASE_URL}${path}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				'X-Api-Key': API_KEY
			}
		});

		if (res.status !== 200) {
			throw new Error('Invalid sonarr response: ' + res.status);
		}

		const data = await res.json();
		return data as T;
	}
}

export const sonarr = new Sonarr();
