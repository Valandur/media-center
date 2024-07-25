<script lang="ts">
</script>

<div class="relative flex flex-col {$$props.class ?? ''}">
	{#if $$slots.header}
		<div
			class="text-primary uppercase font-bold bg-primary/5 border-b border-primary/30 py-2 px-4 text-nowrap text-ellipsis overflow-hidden"
		>
			<slot name="header" />
		</div>
	{/if}

	<div class="flex-1 p-4">
		<slot />
	</div>

	<div class="absolute top-0 bottom-0 left-0 right-0 -z-10">
		<div class="absolute top-0 left-0 border-t-2 border-l-2 border-primary/75 h-2 w-2"></div>
		<div class="absolute top-0 right-0 border-t-2 border-r-2 border-primary/75 h-2 w-2"></div>
		<div class="absolute bottom-0 left-0 border-b-2 border-l-2 border-primary/75 h-2 w-2"></div>
		<div class="absolute bottom-0 right-0 border-b-2 border-r-2 border-primary/75 h-2 w-2"></div>
		<div class="absolute top-4 left-0 bottom-4 right-0 border-l border-r border-primary/30"></div>
		<div class="absolute top-0 left-4 bottom-0 right-4 border-t border-b border-primary/30"></div>
	</div>
</div>
