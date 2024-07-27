import { arm } from '$lib/server/arm';
import { omv } from '$lib/server/omv';
import { rclone } from '$lib/server/rclone';
import { transmission } from '$lib/server/transmission';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends }) => {
	depends('mc:stats');

	// OMV
	const sysInfo = omv.getSystemInformation();
	const cpuTemp = omv.getCpuTemp();
	const devices = omv.getDevices();
	const smartDevices = omv.getSmartDevices();
	const fileSystems = omv.getFileSystems();

	const containers = omv.getComposeContainers();

	// rclone
	const stats = rclone.coreStats();

	// ARM
	const jobs = arm.getJobList();

	// Transmission
	const torrents = transmission.getTorrents();

	return {
		omv: {
			sysInfo,
			cpuTemp,
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
