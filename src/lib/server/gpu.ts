import { XMLParser } from 'fast-xml-parser';
import { error } from '@sveltejs/kit';
import { exec } from 'node:child_process';

import type { GpuInfo, GpuRaw } from '$lib/models/gpu';

import { Service } from './service';

const CMD = 'nvidia-smi -q -x';

export class Gpu extends Service {
	private readonly parser = new XMLParser();

	public constructor() {
		super('GPU');
	}

	public async getStats(): Promise<GpuInfo> {
		try {
			const res = await new Promise<string>((resolve, reject) =>
				exec(CMD, (err, stdout) => (err ? reject(err) : resolve(stdout)))
			);
			const json: GpuRaw = this.parser.parse(res);

			const name = json.nvidia_smi_log.gpu.product_name;
			const temp = parseFloat(json.nvidia_smi_log.gpu.temperature.gpu_temp);
			const processes = json.nvidia_smi_log.gpu.processes;
			const encoderSessions = json.nvidia_smi_log.gpu.encoder_stats.session_count;
			const fanSpeed = parseFloat(json.nvidia_smi_log.gpu.fan_speed);
			const memTotal = parseFloat(json.nvidia_smi_log.gpu.fb_memory_usage.total);
			const memUsed = parseFloat(json.nvidia_smi_log.gpu.fb_memory_usage.used);

			return {
				name,
				temp,
				processes,
				encoderSessions,
				fanSpeed,
				memTotal,
				memUsed
			};
		} catch (err) {
			error(500, (err as Error).message);
		}
	}
}

export const gpu = new Gpu();
