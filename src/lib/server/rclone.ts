import { env } from '$env/dynamic/private';

import type { About } from '$lib/models/about';
import type { FsInfo } from '$lib/models/fsinfo';
import type { ListEntry } from '$lib/models/list';
import type { Stats } from '$lib/models/stats';
import type { CompletedTransfer } from '$lib/models/transfer';
import type { Version } from '$lib/models/version';

const AUTH = btoa(`${env.RCLONE_USERNAME}:${env.RCLONE_PASSWORD}`);
const HEADERS = { Authorization: `Basic ${AUTH}`, 'content-type': 'application/json' };

let version: Version | null = null;
export async function coreVersion(): Promise<Version> {
	if (version) {
		return version;
	}

	const res = await fetch(`${env.RCLONE_URL}/core/version`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({})
	});
	const newVersion = await res.json();
	version = newVersion;
	return newVersion;
}

export async function coreStats(): Promise<Stats> {
	const res = await fetch(`${env.RCLONE_URL}/core/stats`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({})
	});
	const data = await res.json();
	return data;
}

export async function coreTransferred(): Promise<CompletedTransfer[]> {
	const res = await fetch(`${env.RCLONE_URL}/core/transferred`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({})
	});
	const data = await res.json();
	return data.transferred;
}

export async function jobList(): Promise<number[]> {
	const res = await fetch(`${env.RCLONE_URL}/job/list`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({})
	});
	const data = await res.json();
	return data.jobids;
}

export async function jobStatus(jobId: number): Promise<unknown[]> {
	const res = await fetch(`${env.RCLONE_URL}/job/status`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({ jobid: jobId })
	});
	const data = await res.json();
	return data;
}

export async function configListRemotes(): Promise<string[]> {
	const res = await fetch(`${env.RCLONE_URL}/config/listremotes`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({})
	});
	const data = await res.json();
	return data.remotes;
}

export async function opFsInfo(fs: string): Promise<FsInfo> {
	const res = await fetch(`${env.RCLONE_URL}/operations/fsinfo`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({ fs: `${fs}:` })
	});
	const data = await res.json();
	if ('error' in data) {
		throw new Error('Could not get fs info: ' + data.error);
	}
	return data;
}

export async function opAbout(fs: string): Promise<About> {
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
