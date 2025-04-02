import { XMLParser } from 'fast-xml-parser';
import { error } from '@sveltejs/kit';
import { exec } from 'node:child_process';

import { Service } from './service';

const CMD = 'nvidia-smi -q -x';

export class Gpu extends Service {
	private readonly parser = new XMLParser();

	public constructor() {
		super('GPU');
	}

	public async getStats(): Promise<void> {
		try {
			const res = await new Promise<string>((resolve, reject) =>
				exec(CMD, (err, stdout) => (err ? reject(err) : resolve(stdout)))
			);
			console.log('gpu xml', res);

			const json = this.parser.parse(res);
			console.log('gpu json', json);
		} catch (err) {
			error(500, (err as Error).message);
		}
	}
}

export const gpu = new Gpu();
