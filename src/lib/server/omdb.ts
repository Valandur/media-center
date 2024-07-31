import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

import type { Title } from '$lib/models/title';

import { Service } from './service';
import { fetch } from './fetch';

const BASE_URL = `http://www.omdbapi.com/?apikey=${env.OMDB_API_KEY}&`;

class OMDB extends Service {
	public constructor() {
		super('OMDB');
	}

	public async search(title: string): Promise<Title[]> {
		try {
			const res = await fetch(`${BASE_URL}s=${title}`);
			const data = await res.json();
			return data.Search ?? [];
		} catch (err) {
			error(500, (err as Error).message);
		}
	}
}

export const omdb = new OMDB();
