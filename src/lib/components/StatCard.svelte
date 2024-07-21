<script lang="ts">
	export let label: string;
	export let value: string | number;
	export let suffix: string | undefined = undefined;
	export let type: 'primary' | 'secondary' | 'info' | 'success' | 'error' = 'primary';
	export let wide = false;
</script>

<div
	class="card flex-row overflow-hidden {wide
		? 'col-span-12 sm:col-span-12 md:col-span-8 lg:col-span-6 xl:col-span-4'
		: 'col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2'}"
>
	<div
		class="h-full w-1 shrink-0"
		class:bg-primary={type === 'primary'}
		class:dark:bg-accent={type === 'primary'}
		class:bg-secondary={type === 'secondary'}
		class:bg-success={type === 'success'}
		class:bg-info={type === 'info'}
		class:bg-error={type === 'error'}
	></div>
	<div class="p-4 font-inter">
		<div class="flex items-baseline space-x-2">
			<p class="text-2xl font-semibold text-slate-700 dark:text-navy-100">
				{value}
			</p>
			{#if suffix}
				<p class="text-xs">{suffix}</p>
			{/if}
		</div>
		<p class="text-xs">{label}</p>
	</div>
</div>
