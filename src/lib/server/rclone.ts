import { env } from '$env/dynamic/private';

import type { About } from '$lib/models/about';
import type { ListEntry } from '$lib/models/list';
import type { Stats } from '$lib/models/stats';
import type { Version } from '$lib/models/version';

type Fetch = typeof fetch;

const AUTH = btoa(`${env.RCLONE_USERNAME}:${env.RCLONE_PASSWORD}`);
const HEADERS = { Authorization: `Basic ${AUTH}`, 'Content-Type': 'application/json' };

export async function coreVersion(fetch: Fetch): Promise<Version> {
	const res = await fetch(`${env.RCLONE_URL}/core/version`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({})
	});
	return res.json();
}

export async function coreStats(fetch: Fetch): Promise<Stats> {
	const res = await fetch(`${env.RCLONE_URL}/core/stats`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({})
	});
	return res.json();
}

export async function jobList(fetch: Fetch): Promise<number[]> {
	const res = await fetch(`${env.RCLONE_URL}/job/list`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({})
	});
	const data = await res.json();
	return data.jobids;
}

export async function configListRemotes(fetch: Fetch): Promise<string[]> {
	const res = await fetch(`${env.RCLONE_URL}/config/listremotes`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({})
	});
	const data = await res.json();
	return data.remotes;
}

export async function opAbout(fetch: Fetch, fs: string): Promise<About> {
	const res = await fetch(`${env.RCLONE_URL}/operations/about`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({ fs: `${fs}:` })
	});
	const data = await res.json();
	if ('error' in data) {
		throw new Error('Could not get about: ' + data.error);
	}
	return data;
}

export async function opList(
	fetch: Fetch,
	fs: string,
	dir: string,
	options?: { recurse?: boolean; dirsOnly?: boolean; filesOnly?: boolean }
): Promise<ListEntry[]> {
	const res = await fetch(`${env.RCLONE_URL}/operations/list`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({ fs: `${fs}:`, remote: dir, opt: options })
	});
	const data = await res.json();
	if ('error' in data) {
		throw new Error('Could not get about: ' + data.error);
	}
	return data.list;
}
