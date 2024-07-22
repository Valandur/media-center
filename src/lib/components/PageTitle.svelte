<script lang="ts">
	export let title: string;
</script>

<div class="flex items-center justify-between {$$props.class}">
	<h3 class="text-lg font-medium">{title}</h3>

	<div class="flex">
		<slot />
	</div>
</div>
