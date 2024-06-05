<script lang="ts">
	import type { ClientState } from "$lib/client";
	import type { Writable } from "svelte/store";

	export let state: Writable<ClientState | null>;
</script>

{#if $state}
<!-- this mainly makes esling keep its trap shut -->
{@const state = {...$state}}

	<div class="display live">
		<img src={state.large_image_url} alt="Album Art" />

		<div class="right-stack">
			<h1 class="song">{state.song_title}</h1>
			<h2 class="album">{state.album_title}</h2>
			<h3 class="artist">{state.artist_title}</h3>

			<div style="flex: 1 1 auto" />

			<span class="attrib">
				Powered by Last.fm
			</span>
		</div>
	</div>
{:else}
	<div class="display loading">
		<h1>Loading</h1>
	</div>
{/if}

<style>
	.display {
		width: var(--width);
		height: var(--height);
	}

	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.live {
		display: grid;
		grid-template-columns: var(--height) auto;
	}

	img {
		grid-column: 1;
		grid-row: 1 /span 4;

		width: var(--height);
		height: var(--height);
	}

	.right-stack {
		height: var(--height);

		display: flex;
		flex-direction: column;
	}
</style>