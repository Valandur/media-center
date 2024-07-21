<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	$: remotes = data.remotes;
</script>

<main class="main-content w-full px-[var(--margin-x)] pb-4 flex flex-col overflow-y-auto">
	<div class="mt-5 flex items-center justify-between">
		<h3 class="text-lg font-medium text-slate-700 line-clamp-1 dark:text-navy-50">Remotes</h3>
	</div>

	<div
		class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6"
	>
		{#each remotes as remote}
			<a
				href="/file-browser/{remote}"
				class="rounded-lg bg-primary px-4 py-4 text-white dark:bg-accent sm:px-5"
			>
				<div>
					<h2 class="text-lg font-medium tracking-wide line-clamp-1">{remote}</h2>
				</div>
			</a>
		{/each}
	</div>
</main>
