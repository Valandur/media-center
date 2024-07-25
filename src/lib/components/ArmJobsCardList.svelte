<script lang="ts">
	import { scale } from 'svelte/transition';

	import type { ArmJob } from '$lib/models/arm';

	import Card from './Card.svelte';
	import Progress from './Progress.svelte';
	import { cubicInOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';

	export let jobsPromise: Promise<ArmJob[]>;

	let loading = true;
	let jobs: ArmJob[] = [];

	$: jobsPromise, setup();

	function setup() {
		jobsPromise.then((newJobs) => {
			jobs = newJobs;
			loading = false;
		});
	}
</script>

<div class="grid-data">
	{#if loading}
		<div
			style="order: 0;"
			in:scale={{ delay: 250, duration: 200, easing: cubicInOut }}
			out:scale={{ duration: 200, easing: cubicInOut }}
		>
			<Card>
				<div class="spinner"></div>
			</Card>
		</div>
	{/if}
	{#each jobs as job (job.job_id)}
		<div
			style="order: {job.job_id};"
			in:scale={{ delay: 250, duration: 200, easing: cubicInOut }}
			out:scale={{ duration: 200, easing: cubicInOut }}
			animate:flip={{ delay: 250, duration: 200, easing: cubicInOut }}
		>
			<Card>
				<svelte:fragment slot="header">
					{job.title}
				</svelte:fragment>
				<img src={job.poster_url} alt="Poster" class="mb-2" />
				<div>
					<Progress total={100} progress={Number(job.progress_round)} />
				</div>
				<div>{job.stage}</div>
			</Card>
		</div>
	{/each}
</div>
