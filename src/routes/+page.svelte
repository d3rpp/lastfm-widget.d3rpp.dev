<script lang="ts">
	import "../root.css";

	import type { PageData } from "./$types";

	import { Client } from "$lib";
	import { ErrorBar } from "$lib/components";

	import { onMount } from "svelte";
	import Display from "$lib/components/display.svelte";

	export let data: PageData;

	const client = new Client(data.user.name, data.user.key, data.public_api_key);
	const client_state = client.state;

	const update_client = async () => {
		await client.update_state();

		setTimeout(update_client, 2000);
	}

	onMount(() => {
		update_client();
	})
</script>

<main>
	<ErrorBar error={client.error} />

	<Display state={client.state} />
</main>

<style>

</style>