import { env } from '$env/dynamic/private';
import type { Title } from '$lib/models/title';

const BASE_URL = `http://www.omdbapi.com/?apikey=${env.OMDB_API_KEY}&`;

export async function search(title: string): Promise<Title[]> {
	const res = await fetch(`${BASE_URL}s=${title}`);
	const data = await res.json();
	return data.Search ?? [];
}
