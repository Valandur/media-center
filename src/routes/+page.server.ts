import type { Version } from '$lib/models/version';
import { getSmartDevices } from '$lib/server/omv';
import { coreStats, coreVersion } from '$lib/server/rclone';

import type { PageServerLoad } from './$types';

let index = 0;
const map: Map<string, number> = new Map();

let version: Version | null = null;

export const load: PageServerLoad = async ({ fetch, depends }) => {
	if (!version) {
		version = await coreVersion(fetch);
	}

	depends('stats');

	const devices = getSmartDevices().then((devices) =>
		devices.sort((a, b) => a.devicename.localeCompare(b.devicename))
	);

	const stats = await coreStats(fetch);
	if (stats.transferring) {
		for (const transfer of stats.transferring) {
			let id = map.get(transfer.name);
			if (!id) {
				id = index++;
				map.set(transfer.name, id);
			}
			transfer.id = id;
		}
	}

	return { version, stats, devices };
};
