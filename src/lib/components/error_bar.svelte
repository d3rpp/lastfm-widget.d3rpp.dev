<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { fly } from 'svelte/transition';

	let force_on = false;

	export let error: Writable<string | null>;
</script>

{#if $error !== null || force_on}
	{@const text = $error ?? 'Example Error - 500 error'}

	<div id="error-bar" transition:fly={{ y: 10, duration: 100 }}>
		<span>{text}</span>
	</div>
{/if}

<style>
	#error-bar {
		position: absolute;
		bottom: 0;
		left: 0;

		width: 100%;
		height: 36px;

		background-color: rgba(177, 94, 108, 150);

		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	span {
		padding: 0 8px;

		font-size: 18px;
		line-height: 18px;
		color: #eee;
	}
</style>
