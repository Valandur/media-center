import WebSocket from 'ws';
import { env } from '$env/dynamic/private';

import type { WorkerInfo, WorkersInfoResponse } from '$lib/models/unmanic';

import { Service } from './service';

const URL = `${env.UNMANIC_URL}/unmanic/websocket`;

class Unmanic extends Service {
	public constructor() {
		super('UNMANIC');
	}

	public getWorkersInfo() {
		return new Promise<WorkerInfo[]>((resolve, reject) => {
			let dataSent = false;
			const socket = new WebSocket(URL, {
				rejectUnauthorized: false
			});

			socket.on('open', () => {
				this.logger.debug('WebSocket connection established!');
				socket.send('{"command":"start_workers_info","params":{}}');
			});

			socket.on('message', (event) => {
				const data: WorkersInfoResponse = JSON.parse(event.toString());
				this.logger.debug('WS', data.type);

				if (data.type === 'workers_info') {
					dataSent = true;
					socket.close();
					resolve(data.data);
				}
			});

			socket.on('close', (event) => {
				if (!dataSent) {
					this.logger.warn('WS', 'close', event);
					reject(new Error('Closed before data'));
				}
			});

			socket.on('error', (error) => {
				if (!dataSent) {
					this.logger.error('WS', 'error', error);
					reject(error);
				}
			});
		});
	}
}

export const unmanic = new Unmanic();
