<script>
	import ChoosePlayers from '$lib/components/ChoosePlayers.svelte';
	import { Switch } from '$lib/components/ui/switch';
	import { playerDialog } from '$lib/stores';
	import { ChevronRight, ChevronsRight, Play } from 'lucide-svelte';
	import { toggleMode, mode } from 'mode-watcher';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const openPlayerDialog = () => {
		playerDialog.set(true);
	};

	$: {
		$mode;
	}
</script>

<ChoosePlayers />

<div class="flex flex-col gap-4 py-4">
	<div
		class="flex w-full justify-between rounded-lg border border-slate-200 px-3 py-4 dark:border-slate-800"
	>
		<div class="item-info font-semibold">Dark Mode</div>
		<div class="item-toggle">
			<Switch id="darkMode" checked={$mode == 'dark'} onCheckedChange={() => toggleMode()} />
		</div>
	</div>
	<button
		class="flex w-full cursor-pointer justify-between rounded-lg border border-slate-200 px-3 py-4 dark:border-slate-800"
		on:click={() => openPlayerDialog()}
	>
		<div class="item-info font-semibold">Select music player</div>
		<div class="item-toggle">
			<ChevronRight size="24" />
		</div>
	</button>
</div>
