<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	import type { Session } from '$lib/models/jellyfin';

	import Card from './Card.svelte';
	import { formatSpeed } from '$lib/util';

	export let jellyfinPromise: Promise<Session[]>;

	let loading = true;
	let sessions: Session[] = [];
	let error = '';

	$: jellyfinPromise, setup();

	function setup() {
		jellyfinPromise
			.then((newSessions) => {
				sessions = newSessions;
				loading = false;
				error = '';
			})
			.catch((err) => {
				console.error(err);
				sessions = [];
				loading = false;
				error = err.message;
			});
	}
</script>

<Card class={$$props.class ?? ''}>
	<svelte:fragment slot="header">Jellyfin Sessions</svelte:fragment>

	<div class="flex flex-col">
		<div class="grid grid-cols-[auto_auto_1fr_auto_auto_auto_auto_auto] items-center gap-x-4">
			{#if loading}
				<div class="spinner"></div>
			{:else if error}
				<div class="text-error text-xl font-bold">{error}</div>
			{/if}

			{#each sessions as session (session.Id)}
				<div class="text-nowrap text-ellipsis overflow-hidden" transition:slide>
					{session.UserName}
				</div>
				<div class="text-nowrap text-ellipsis overflow-hidden badge bg-info" transition:slide>
					{session.DeviceName}
				</div>
				<div class="text-nowrap text-ellipsis overflow-hidden" transition:slide>
					{#if session.NowPlayingItem}
						{#if session.NowPlayingItem.SeriesId}
							{session.NowPlayingItem.SeriesName} - {session.NowPlayingItem.Name}
						{:else}
							{session.NowPlayingItem.Name}
						{/if}
					{:else}
						---
					{/if}
				</div>
				<div class="text-nowrap text-ellipsis overflow-hidden" transition:slide>
					{session.RemoteEndPoint}
				</div>
				<div class="text-nowrap text-ellipsis overflow-hidden" transition:slide>
					{#if session.TranscodingInfo}
						{session.TranscodingInfo.Width}x{session.TranscodingInfo.Height}
					{:else}
						---
					{/if}
				</div>
				<div class="text-nowrap text-ellipsis overflow-hidden badge bg-info" transition:slide>
					{#if session.TranscodingInfo}
						{session.TranscodingInfo.AudioCodec}
					{:else}
						---
					{/if}
				</div>
				<div class="text-nowrap text-ellipsis overflow-hidden badge bg-info" transition:slide>
					{#if session.TranscodingInfo}
						{session.TranscodingInfo.VideoCodec}
					{:else}
						---
					{/if}
				</div>
				<div class="text-nowrap text-ellipsis overflow-hidden" transition:slide>
					{#if session.TranscodingInfo}
						{formatSpeed(session.TranscodingInfo.Bitrate)}
					{:else}
						---
					{/if}
				</div>
			{/each}
		</div>
	</div>
</Card>
