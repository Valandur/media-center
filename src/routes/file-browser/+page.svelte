<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	$: remotes = data.remotes;
</script>

<div class="flex items-center justify-between">
	<h3 class="text-lg font-medium">Remotes</h3>
</div>

<div
	class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6"
>
	{#each remotes as remote}
		<a href="/file-browser/{remote}" class="btn btn-primary">
			<div>
				<h2 class="text-lg font-medium">{remote}</h2>
			</div>
		</a>
	{/each}
</div>
