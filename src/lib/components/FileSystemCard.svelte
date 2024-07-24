<script lang="ts">
	import type { FileSystem } from '$lib/models/file-system';
	import { formatSize } from '$lib/util';

	import Card from './Card.svelte';
	import Progress from './Progress.svelte';

	export let fs: FileSystem;
</script>

<Card class="w-full h-full flex flex-col transition-colors {$$props.class}">
	<div class="flex flex-row items-center justify-between mb-2">
		<h3 class="flex-1 text-primary text-xl overflow-hidden text-nowrap text-ellipsis">
			{fs.devicename}
		</h3>
		<div class="flex-shrink-0">
			{fs.type}
		</div>
	</div>
	<div class="flex flex-row items-center justify-between mb-2">
		<div class="text-secondary">
			{formatSize(Number(fs.size) - Number(fs.available))}
		</div>
		<div class="text-secondary">
			{formatSize(Number(fs.size))}
		</div>
	</div>

	<Progress total={Number(fs.size)} remaining={Number(fs.available)} />
</Card>
