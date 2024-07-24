<script lang="ts">
	import { parseISO } from 'date-fns/parseISO';
	import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
	import { slide } from 'svelte/transition';

	import PageTitle from '$lib/components/PageTitle.svelte';
	import { formatSize } from '$lib/util';

	import About from './About.svelte';
	import FileTreeLevel from './FileTreeNode.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	let showTree = false;

	$: remote = data.remote;
	$: tree = data.tree;
	$: about = data.about;
	$: currentPath = data.path;
	$: files = data.files;
	$: basePath = `/file-browser/${remote}`;
	$: pathParts = currentPath.split('/');

	function toggle() {
		showTree = !showTree;
	}
</script>

<PageTitle title="File Browser - {remote}" />

<div class="relative mt-8 flex-1 grid grid-cols-4 overflow-hidden">
	<div class="contents md:hidden">
		{#if showTree}
			<div
				class="absolute top-0 left-0 bottom-0 right-0 bg-dark flex flex-col overflow-hidden"
				transition:slide={{ axis: 'x' }}
			>
				<div class="flex-1 overflow-y-auto p-2 border border-primary/30">
					<div class="absolute top-2 right-3">
						<button on:click={toggle} class="text-primary">
							<i class="fa-solid fa-xmark"></i>
						</button>
					</div>

					<ul class="space-y-1 text-sm">
						{#each tree as node}
							<FileTreeLevel {node} {currentPath} {basePath} />
						{/each}
					</ul>
				</div>

				<About {about} />
			</div>
		{/if}
	</div>
	<div class="hidden md:contents">
		<div class="relative flex flex-col overflow-hidden" transition:slide={{ axis: 'x' }}>
			<div class="flex-1 overflow-y-auto p-2 border border-primary/30">
				<ul class="space-y-1 text-sm">
					{#each tree as node}
						<FileTreeLevel {node} {currentPath} {basePath} />
					{/each}
				</ul>
			</div>

			<About {about} />
		</div>
	</div>

	<div
		class="col-span-4 md:col-span-3 flex flex-col overflow-hidden p-2 border md:border-l-0 border-primary/30"
	>
		<div class="flex flex-row items-start justify-between">
			<ul class="flex flex-wrap space-x-2">
				<li class="flex items-center space-x-2">
					{#if currentPath}
						<a class="transition-colors hover:text-accent" href="/file-browser/{remote}">
							{remote}
						</a>
						<span class="text-secondary">/</span>
					{:else}
						<p class="text-primary">{remote}</p>
					{/if}
				</li>
				{#each pathParts as part, index}
					<li class="flex items-center space-x-2">
						{#if index < pathParts.length - 1}
							<a
								class="transition-colors hover:text-accent"
								href="/file-browser/{remote}/{pathParts.slice(0, index + 1).join('/')}"
							>
								{part}
							</a>
						{:else}
							<p class="text-primary">{part}</p>
						{/if}
						{#if index < pathParts.length - 1}
							<span class="text-secondary">/</span>
						{/if}
					</li>
				{/each}
			</ul>

			{#if !showTree}
				<button on:click={toggle} class="text-primary md:hidden me-1">
					<i class="fa-solid fa-folder-tree"></i>
				</button>
			{/if}
		</div>

		<div class="card mt-3 overflow-y-auto">
			<table class="is-hoverable w-full text-left">
				<thead>
					<tr>
						<th
							class="whitespace-nowrap rounded-tl-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
						>
							Name
						</th>
						<th
							class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
						>
							Last edit
						</th>
						<th
							class="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
						>
							Size
						</th>

						<th
							class="whitespace-nowrap rounded-tr-lg bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5"
						></th>
					</tr>
				</thead>

				<tbody>
					{#each files as file}
						{@const modTime = parseISO(file.modTime)}
						<tr class="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
							<td class="whitespace-nowrap px-4 py-3 sm:px-5">
								<div class="flex items-center space-x-4">
									{#if file.dir}
										<i class="fa-solid fa-folder fa-xl w-6 text-warning"></i>
										<a
											href="/file-browser/{remote}/{file.path}"
											class="font-medium text-slate-700 dark:text-navy-100">{file.name}</a
										>
									{:else}
										<i class="fa-solid fa-file fa-xl w-6"></i>
										<span class="font-medium text-slate-700 dark:text-navy-100">{file.name}</span>
									{/if}
								</div>
							</td>
							<td class="whitespace-nowrap px-4 py-3 sm:px-5">
								{modTime.getTime() > 0 ? formatDistanceToNow(modTime, { addSuffix: true }) : '---'}
							</td>
							<td class="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-navy-100 sm:px-5">
								{#if file.size > 0}
									{formatSize(file.size)}
								{:else}
									---
								{/if}
							</td>
							<td class="whitespace-nowrap px-4 py-3 sm:px-5">
								<button
									class="btn size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="size-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
										/>
									</svg>
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
