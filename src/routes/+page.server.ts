import { arm } from '$lib/server/arm';
import { jellyfin } from '$lib/server/jellyfin';
import { nextcloud } from '$lib/server/nextcloud';
import { omv } from '$lib/server/omv';
import { rclone } from '$lib/server/rclone';
import { transmission } from '$lib/server/transmission';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends }) => {
	depends('mc:stats');

	// OMV
	const sysInfo = await omv.getSystemInformation(); // this prevents all OMV requests from triggering 401 errors at once
	const cpuTemp = omv.getCpuTemp();
	const devices = omv.getDevices();
	const smartDevices = omv.getSmartDevices();
	const fileSystems = omv.getFileSystems();
	const zfsStats = omv.getZfsStats();
	const services = omv.getComposeServices();

	// rclone
	const stats = rclone.coreStats();

	// ARM
	const jobs = arm.getJobList();

	// Transmission
	const torrents = transmission.getTorrents();

	// Nextcloud
	const nextcloudInfo = nextcloud.getInfo();

	// Jellyfin
	const jellyfinInfo = jellyfin.getInfo();

	return {
		omv: {
			sysInfo,
			cpuTemp,
			devices,
			smartDevices,
			fileSystems,
			services,
			zfsStats
		},
		rclone: {
			stats
		},
		arm: {
			jobs
		},
		transmission: {
			torrents
		},
		nextcloud: {
			info: nextcloudInfo
		},
		jellyfin: {
			info: jellyfinInfo
		}
	};
};
