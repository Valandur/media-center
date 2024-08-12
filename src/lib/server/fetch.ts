import { fetch as rawFetch, Agent, type Response, type RequestInit } from 'undici';
export { type Response, type RequestInit, FormData } from 'undici';

import { Logger } from './logger';

const logger = new Logger('FETCH');
const agent = new Agent({ connect: { rejectUnauthorized: false } });

export async function fetch(url: string, init?: RequestInit): Promise<Response> {
	let status = 0;
	const start = process.hrtime.bigint();

	try {
		const res = await rawFetch(url, { ...init, dispatcher: agent });
		status = res.status;
		return res;
	} finally {
		const diff = (process.hrtime.bigint() - start) / 1000000n;
		logger.debug(init?.method ?? 'GET', url, status, `${diff}ms`);
	}
}
