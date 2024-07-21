<script lang="ts">
	import { untrack } from 'svelte';
	import { slide } from 'svelte/transition';

	import type { TreeNode } from '$lib/models/tree';

	let {
		basePath,
		node,
		current
	}: {
		basePath: string;
		node: TreeNode;
		current: string | null;
	} = $props();

	let isExpanded = $state(false);
	let isLoading = $state(false);
	let treeLoaded = $state(false);
	let subTree: TreeNode[] = $state([]);

	$effect(() => {
		if (current && (current === node.path || current.startsWith(node.path + '/'))) {
			untrack(() => onExpand(true));
		}
	});

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
	<div
		class="flex cursor-pointer items-center rounded px-2 py-1 tracking-wide text-slate-800 outline-none transition-all hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:text-navy-100 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
	>
		{#if isLoading}
			<div
				class="spinner is-elastic size-4 animate-spin rounded-full border-2 border-slate-150 border-r-slate-500 dark:border-navy-500 dark:border-r-navy-300 me-2 my-0.5 flex-shrink-0"
			></div>
		{:else if !treeLoaded || subTree.length > 0}
			<button
				class="btn me-1 size-5 rounded-lg p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 flex-shrink-0"
				onclick={() => onExpand(!isExpanded)}
			>
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
		<div class="ps-4" transition:slide|global>
			<ul>
				{#each subTree as node}
					<svelte:self {basePath} {node} {current} />
				{/each}
			</ul>
		</div>
	{/if}
</li>
