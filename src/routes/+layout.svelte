<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';

	import '../app.css';
</script>

<div class="flex flex-col h-screen w-screen overflow-hidden">
	<div class="flex-1 flex flex-row gap-x-16 overflow-hidden">
		<main class="flex-1 p-2 flex flex-col overflow-hidden">
			<slot />
		</main>
	</div>
</div>
