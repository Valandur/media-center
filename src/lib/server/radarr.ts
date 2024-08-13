import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

import type { Movie, QueueResponse, QueueItem } from '$lib/models/radarr';

import { Service } from './service';
import { fetch } from './fetch';

const BASE_URL = `${env.RADARR_URL}/api/v3`;
const QUEUE_PATH =
	'/queue?page=1&pageSize=100&sortDirection=ascending&sortKey=movies.sortTitle&includeUnknownMovieItems=true';
const API_KEY = env.RADARR_API_KEY;

export class Radarr extends Service {
	public constructor() {
		super('RADARR');
	}

	public async getQueueWithMovies(): Promise<QueueItem[]> {
		try {
			const [resQueue, resMovie] = await Promise.all([
				this.request<QueueResponse>(QUEUE_PATH),
				this.request<Movie[]>('/movie')
			]);
			resQueue.records.forEach((r) => (r.movie = resMovie.find((m) => m.id === r.movieId)!));
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
			throw new Error('Invalid radarr response: ' + res.status);
		}

		const data = await res.json();
		return data as T;
	}
}

export const radarr = new Radarr();
