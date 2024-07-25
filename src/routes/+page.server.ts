import { getJobList } from '$lib/server/arm';
import { getComposeContainers, getDevices, getFileSystems, getSmartDevices } from '$lib/server/omv';
import { coreStats } from '$lib/server/rclone';
import { getTorrents } from '$lib/server/transmission';

import type { PageServerLoad } from './$types';

let index = 0;
const map: Map<string, number> = new Map();

export const load: PageServerLoad = async ({ depends }) => {
	depends('mc:stats');

	// OMV
	const devices = getDevices();
	const smartDevices = getSmartDevices();
	const fileSystems = getFileSystems();

	const containers = getComposeContainers();

	// rclone
	const stats = coreStats().then((stats) => {
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

	// ARM
	const jobs = getJobList();

	// Transmission
	const torrents = getTorrents();

	return {
		omv: {
			devices,
			smartDevices,
			fileSystems,
			containers
		},
		rclone: {
			stats
		},
		arm: {
			jobs
		},
		transmission: {
			torrents
		}
	};
};
