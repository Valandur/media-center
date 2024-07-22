<script lang="ts">
	import { slide } from 'svelte/transition';

	import type { TreeNode } from '$lib/models/tree';

	export let basePath: string;
	export let node: TreeNode;
	export let current: string | null;

	let isExpanded = false;
	let isLoading = false;
	let treeLoaded = false;
	let subTree: TreeNode[] = [];

	$: {
		if (current && (current === node.path || current.startsWith(node.path + '/'))) {
			onExpand(true);
		}
	}

	async function onExpand(expand: boolean) {
		if (treeLoaded) {
			isExpanded = expand;
			return;
		}

		isLoading = true;
		try {
			const res = await fetch(`${basePath}?path=${encodeURIComponent(node.path)}`);
			const data = await res.json();
			subTree = data;
			isExpanded = expand;
			treeLoaded = true;
		} catch (err) {
			console.error(err);
		} finally {
			isLoading = false;
		}
	}
</script>

<li>
	<div class="flex cursor-pointer items-center py-1">
		{#if isLoading}
			<div class="spinner size-4 me-2 flex-shrink-0" />
		{:else if !treeLoaded || subTree.length > 0}
			<button class="btn me-1 size-5 p-0 flex-shrink-0" on:click={() => onExpand(!isExpanded)}>
				<i
					class="fa-solid fa-caret-right me-1 fa-lg transition-transform"
					class:rotate-90={isExpanded}
				></i>
			</button>
		{:else}
			<div class="me-1 flex size-5 items-center justify-center flex-shrink-0"></div>
		{/if}

		<i class="fa-solid fa-folder me-2 fa-lg text-warning"></i>

		<a href="{basePath}/{encodeURI(node.path)}" class="text-nowrap">{node.name}</a>
	</div>
	{#if isExpanded}
		<div class="ps-4" transition:slide>
			<ul>
				{#each subTree as node}
					<svelte:self {basePath} {node} {current} />
				{/each}
			</ul>
		</div>
	{/if}
</li>
