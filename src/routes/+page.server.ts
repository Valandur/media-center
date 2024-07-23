import { getComposeContainers, getDevices, getFileSystems, getSmartDevices } from '$lib/server/omv';
import { coreStats, coreVersion } from '$lib/server/rclone';

import type { PageServerLoad } from './$types';

let index = 0;
const map: Map<string, number> = new Map();

export const load: PageServerLoad = async ({ fetch, depends }) => {
	depends('stats');

	// OMV
	const devices = getDevices();
	const smartDevices = getSmartDevices();
	const fileSystems = getFileSystems();

	const containers = getComposeContainers();

	// rclone
	const version = coreVersion(fetch);
	const stats = coreStats(fetch).then((stats) => {
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
		return stats;
	});

	return {
		omv: {
			devices,
			smartDevices,
			fileSystems,
			containers
		},
		rclone: {
			version,
			stats
		}
	};
};
