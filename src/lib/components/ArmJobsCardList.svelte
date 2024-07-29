<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { fade, scale } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';

	import type { ArmJob } from '$lib/models/arm';
	import type { Title } from '$lib/models/title';

	import Card from './Card.svelte';
	import Progress from './Progress.svelte';

	export let jobsPromise: Promise<ArmJob[]>;

	let loading = true;
	let jobs: ArmJob[] = [];
	let selectedId = '';
	let search = '';
	let titles: Title[] = [];
	let error = '';

	$: jobsPromise, setup();

	function setup() {
		jobsPromise
			.then((newJobs) => {
				jobs = newJobs;
				loading = false;
				error = '';
			})
			.catch((err) => {
				console.error(err);
				jobs = [];
				loading = false;
				error = err.message;
			});
	}

	async function onSubmit(event: SubmitEvent) {
		if (event.target instanceof HTMLFormElement) {
			try {
				const res = await fetch('/api/omdb', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ search })
				});
				const data = await res.json();
				titles = data;
			} catch (err) {
				console.error(err);
			}
		}
	}

	async function onSelect(title: Title) {
		try {
			await fetch('/api/arm', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ ...title, selectedId })
			});
			selectedId = '';
			invalidate('mc:stats');
		} catch (err) {
			console.error(err);
		}
	}
</script>

{#if error}
	<div transition:scale>
		<Card>
			<svelte:fragment slot="header">ARM Error</svelte:fragment>
			<div class="text-error text-xl font-bold">{error}</div>
		</Card>
	</div>
{/if}

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

			<div class="flex flex-col">
				<button on:click={() => (selectedId = job.job_id)} class="self-center mb-2">
					<img src={job.poster_url} alt="Poster" />
				</button>
				<div>{job.stage}</div>
				<div>
					<Progress total={100} progress={Number(job.progress_round)} />
				</div>
			</div>
		</Card>
	</div>
{/each}

{#if selectedId}
	<button
		class="fixed top-0 left-0 right-0 bottom-0 bg-dark/95 flex flex-col items-center justify-center z-20"
		transition:fade
		on:click={() => (selectedId = '')}
	>
		<div
			class="flex flex-row items-center justify-center text-primary cursor-default"
			role="button"
			on:click|stopPropagation
			on:keydown|stopPropagation
			tabindex={0}
		>
			<div class="border border-primary/75 bg-dark">
				<div class="border-b border-primary/75 p-4 uppercase">Find movie / show by title</div>
				<div class="p-4">
					<form on:submit|preventDefault|stopPropagation={onSubmit}>
						<input type="text" placeholder="Title" class="input me-2" bind:value={search} />
						<button type="submit" class="btn btn-primary">Search</button>
					</form>
					{#if titles}
						<div class="flex flex-col gap-4 mt-4">
							{#each titles as title}
								<div class="flex flex-row items-center gap-4">
									<div class="basis-1/6 flex-grow">
										{#if title.Poster !== 'N/A'}
											<img src={title.Poster} alt="Poster" class="w-24" />
										{/if}
									</div>
									<div class="basis-3/6 flex-grow text-2xl">{title.Title}</div>
									<div class="basis-1/6 flex-grow text-2xl">{title.Year}</div>
									<div class="basis-1/6 flex-grow text-2xl">
										<button type="button" class="btn btn-primary" on:click={() => onSelect(title)}>
											Select
										</button>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</button>
{/if}
