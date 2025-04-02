import { arm } from '$lib/server/arm';
import { gpu } from '$lib/server/gpu';
import { jellyfin } from '$lib/server/jellyfin';
import { nextcloud } from '$lib/server/nextcloud';
import { omv } from '$lib/server/omv';
import { radarr } from '$lib/server/radarr';
import { rclone } from '$lib/server/rclone';
import { sonarr } from '$lib/server/sonarr';
import { transmission } from '$lib/server/transmission';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends }) => {
	depends('mc:stats');

	// OMV
	const sysInfo = omv.getSystemInformation();
	const cpuTemp = omv.getCpuTemp();
	const fileSystems = omv.getFileSystems();
	const zfsStats = omv.getZfsStats();
	const devices = omv.getDevices();
	const smartDevices = omv.getSmartDevices();
	const compose = omv.getCompose();

	// Rclone
	const rcloneStats = rclone.coreStats();

	// ARM
	const jobs = arm.getJobList();

	// Transmission
	const torrents = transmission.getTorrents();

	// Nextcloud
	const nextcloudInfo = nextcloud.getInfo();

	// Jellyfin
	const jellyfinInfo = jellyfin.getInfo();

	// Radarr
	const radarrQueue = radarr.getQueueWithMovies();

	// Sonarr
	const sonarrQueue = sonarr.getQueueWithSeries();

	// GPU
	const gpuStats = gpu.getStats();

	return {
		omv: {
			sysInfo,
			cpuTemp,
			devices,
			smartDevices,
			fileSystems,
			compose,
			zfsStats
		},
		rclone: {
			stats: rcloneStats
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
		},
		radarr: {
			queue: radarrQueue
		},
		sonarr: {
			queue: sonarrQueue
		},
		gpu: {
			stats: gpuStats
		}
	};
};
