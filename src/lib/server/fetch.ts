import { Logger } from './logger';

const logger = new Logger('FETCH');

export async function fetch(url: string, init?: RequestInit): Promise<Response> {
	let status = 0;
	const start = process.hrtime.bigint();

	try {
		const res = await globalThis.fetch(url, init);
		status = res.status;
		return res;
	} finally {
		const diff = (process.hrtime.bigint() - start) / 1000000n;
		logger.debug(init?.method ?? 'GET', url, status, `${diff}ms`);
	}
}
