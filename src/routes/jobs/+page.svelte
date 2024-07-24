<script lang="ts">
	import { formatDistanceStrict } from 'date-fns/formatDistanceStrict';

	import PageTitle from '$lib/components/PageTitle.svelte';
	import { formatSize } from '$lib/util';

	import type { PageServerData } from './$types';

	export let data: PageServerData;

	$: jobs = data.jobs;
</script>

<PageTitle title="Jobs" />

<div
	class="grid grid-rows-none auto-rows-auto items-stretch grid-cols-[1fr_repeat(6,auto)] overflow-auto"
>
	<div class="text-primary p-2">File</div>
	<div class="text-primary p-2">Size</div>
	<div class="text-primary p-2">From</div>
	<div class="text-primary p-2">To</div>
	<div class="text-primary p-2">Time</div>
	<div class="p-2">Checked</div>
	<div class="p-2">Error</div>

	{#each jobs as job, i}
		<div class="text-ellipsis p-2 {i % 2 === 0 ? 'bg-secondary/50' : ''}">
			{job.name.substring(job.name.lastIndexOf('/') + 1)}
		</div>
		<div class="text-nowrap p-2 {i % 2 === 0 ? 'bg-secondary/50' : ''}">
			{formatSize(job.size)}
		</div>
		<div class="text-nowrap p-2 {i % 2 === 0 ? 'bg-secondary/50' : ''}">
			{job.srcFs ?? ''}
		</div>
		<div class="text-nowrap p-2 {i % 2 === 0 ? 'bg-secondary/50' : ''}">
			{job.dstFs ?? ''}
		</div>
		<div class="text-nowrap p-2 {i % 2 === 0 ? 'bg-secondary/50' : ''}">
			{formatDistanceStrict(new Date(job.started_at), new Date(job.completed_at))}
		</div>
		<div class="p-2 {i % 2 === 0 ? 'bg-secondary/50' : ''}">
			{#if job.checked}
				<i class="fa-solid fa-check fa-xl font-extrabold text-success"></i>
			{:else}
				<i class="fa-solid fa-xmark fa-xl font-extrabold text-error"></i>
			{/if}
		</div>
		<div class="p-2 {i % 2 === 0 ? 'bg-secondary/50' : ''}">
			{#if job.error}
				<i class="fa-solid fa-xmark fa-xl font-extrabold text-error"></i>
			{:else}
				<i class="fa-solid fa-check fa-xl font-extrabold text-success"></i>
			{/if}
		</div>
	{/each}
</div>
