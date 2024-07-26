import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

import type { Title } from '$lib/models/title';

import { Service } from './service';

const BASE_URL = `http://www.omdbapi.com/?apikey=${env.OMDB_API_KEY}&`;

class OMDB extends Service {
	public constructor() {
		super('OMDB');
	}

	public async search(title: string): Promise<Title[]> {
		try {
			let status = 0;
			const url = `${BASE_URL}s=${title}`;

			try {
				const res = await fetch(url);
				status = res.status;

				const data = await res.json();
				return data.Search ?? [];
			} finally {
				this.logger.debug('GET', url, status);
			}
		} catch (err) {
			error(500, (err as Error).message);
		}
	}
}

export const omdb = new OMDB();
