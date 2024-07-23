<script lang="ts">
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { cubicInOut } from 'svelte/easing';

	import type { Device } from '$lib/models/device';
	import type { SmartDevice } from '$lib/models/smart';
	import type { FileSystem } from '$lib/models/file-system';

	import DeviceCard from './DeviceCard.svelte';
	import Card from './Card.svelte';

	interface DeviceWithExtra extends Device {
		smart: SmartDevice | null;
		fs: FileSystem[];
	}

	export let devices: Promise<Device[]>;
	export let fileSystems: Promise<FileSystem[]>;
	export let smartDevices: Promise<SmartDevice[]>;

	let loading = true;
	let pendingSmart: Map<string, SmartDevice> = new Map();
	let pendingFileSystems: Map<string, FileSystem[]> = new Map();
	let devicesWithExtra: (DeviceWithExtra | null)[] = [null];

	$: devices, smartDevices, fileSystems, setup();

	function setup() {
		devices.then((newDevices) => {
			loading = false;

			devicesWithExtra = newDevices
				.map((dev) => {
					const smart = pendingSmart.get(dev.canonicaldevicefile) ?? null;
					const fs = pendingFileSystems.get(dev.canonicaldevicefile) ?? [];
					return { ...dev, smart, fs };
				})
				.sort((a, b) => a.devicename.localeCompare(b.devicename));
		});
		smartDevices.then((newSmartDevices) => {
			const pending: Map<string, SmartDevice> = new Map();
			for (const newSmartDevice of newSmartDevices) {
				pending.set(newSmartDevice.canonicaldevicefile, newSmartDevice);
			}

			pendingSmart = pending;
			if (!loading) {
				devicesWithExtra = devicesWithExtra.map((dev) =>
					dev ? { ...dev, smart: pending.get(dev.canonicaldevicefile) ?? null } : null
				);
			}
		});
		fileSystems.then((newFileSystems) => {
			const pending: Map<string, FileSystem[]> = new Map();
			for (const newFileSystem of newFileSystems) {
				pending.set(
					newFileSystem.parentdevicefile,
					(pending.get(newFileSystem.parentdevicefile) ?? [])?.concat(newFileSystem)
				);
			}

			pendingFileSystems = pending;
			if (!loading) {
				devicesWithExtra = devicesWithExtra.map((dev) =>
					dev ? { ...dev, fs: pending.get(dev.canonicaldevicefile) ?? [] } : null
				);
			}
		});
	}
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
	{#each devicesWithExtra as device (device?.devicename)}
		<div
			in:scale={{ delay: 250, duration: 200, easing: cubicInOut }}
			out:scale={{ duration: 200, easing: cubicInOut }}
			animate:flip={{ delay: 250, duration: 200, easing: cubicInOut }}
		>
			{#if !device}
				<Card class="w-full h-full flex flex-col justify-between transition-colors">
					<div class="flex flex-row items-center justify-between">
						<h3 class="flex-1 text-primary text-xl overflow-hidden text-nowrap text-ellipsis">
							...
						</h3>
						<div class="flex-shrink-0 spinner"></div>
					</div>

					<div class="flex flex-row items-center justify-between mb-4">
						<div class="text-secondary">&nbsp;</div>
						<div class="text-secondary">&nbsp;</div>
					</div>

					<h3 class="text-primary text-sm mb-1">&nbsp;</h3>
				</Card>
			{:else}
				<DeviceCard {device} smart={device.smart} fileSystems={device.fs} />
			{/if}
		</div>
	{/each}
</div>
