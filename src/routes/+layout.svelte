<script>
	import Menubar from '$lib/components/Menubar.svelte';
	import '../app.pcss';
</script>

<Menubar />
<div class="relative px-4 pt-12">
	<slot />
</div>
