<script>
	import { browser } from '$app/environment';
	import Menubar from '$lib/components/Menubar.svelte';
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	if (browser) {
		if (!localStorage.getItem('defaultPlayer')) {
			localStorage.setItem('defaultPlayer', 'rythmbox');
		}
	}
</script>

<ModeWatcher />
<Menubar />
<div class="relative px-4 pt-12 dark:bg-black">
	<slot class="dark:bg-black" />
</div>
