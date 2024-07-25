<script lang="ts">
	import { scale } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';

	import type { ArmJob } from '$lib/models/arm';

	import Card from './Card.svelte';
	import Progress from './Progress.svelte';

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

{#each jobs as job (job.job_id)}
	<div
		class={$$props.class ?? ''}
		style="order: {job.job_id};"
		in:scale={{ delay: 250, duration: 200, easing: cubicInOut }}
		out:scale={{ duration: 200, easing: cubicInOut }}
		animate:flip={{ delay: 250, duration: 200, easing: cubicInOut }}
	>
		<Card>
			<svelte:fragment slot="header">
				ARM - {job.title}
			</svelte:fragment>
			<img src={job.poster_url} alt="Poster" class="mb-2" />
			<div>{job.stage}</div>
			<div>
				<Progress total={100} progress={Number(job.progress_round)} />
			</div>
		</Card>
	</div>
{/each}
