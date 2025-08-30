import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';

import type { KopiaSourcesResponse, Source } from '$lib/models/kopia';

import { Service } from './service';
import { fetch } from './fetch';

const AUTH = btoa(`${env.KOPIA_USERNAME}:${env.KOPIA_PASSWORD}`);
const HEADERS = { Authorization: `Basic ${AUTH}`, 'content-type': 'application/json' };

class Kopia extends Service {
	public constructor() {
		super('KOPIA');
	}

	public async getSources(): Promise<Source[]> {
		try {
			const data: KopiaSourcesResponse = await this.request('sources');
			console.log(data.sources);
			return data.sources;
		} catch (err) {
			error(500, (err as Error).message);
		}
	}

	private async request<T>(path: string): Promise<T> {
		const res = await fetch(`${env.KOPIA_URL}/api/v1/${path}`, {
			method: 'GET',
			headers: HEADERS
		});
		const data = await res.json();
		return data as T;
	}
}

export const kopia = new Kopia();
