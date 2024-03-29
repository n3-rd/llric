<script>
	import * as Menubar from '$lib/components/ui/menubar';
	import { appWindow } from '@tauri-apps/api/window';
	import { Maximize, Minimize, Minus, X } from 'lucide-svelte';
	console.log(appWindow);

	/**
	 * @type {boolean}
	 */
	let isMaximized;
	async function updateIsMaximized() {
		isMaximized = await appWindow.isMaximized();
	}

	// updateIsMaximized();

	$: {
		updateIsMaximized();
		// console.log(isMaximized);
	}

	// await appWindow.startDragging();
</script>

<Menubar.Root data-tauri-drag-region class="fixed z-[9999] min-w-full bg-white py-4">
	<div class="flex w-full justify-between bg-white" data-tauri-drag-region>
		<Menubar.Menu>
			<Menubar.Trigger>File</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item>
					New Tab
					<Menubar.Shortcut>⌘T</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Item>New Window</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item>Share</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item>Print</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>

		<div class="flex gap-3">
			<Menubar.Menu>
				<Menubar.Trigger
					class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 p-1 text-black hover:bg-slate-200"
					on:click={() => appWindow.minimize()}
				>
					<Minus size="16" />
				</Menubar.Trigger>
			</Menubar.Menu>
			<Menubar.Menu>
				{#if isMaximized}
					<Menubar.Trigger
						class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 p-1 text-black hover:bg-slate-200"
						on:click={() => {
							appWindow.unmaximize();
							isMaximized = false;
						}}
					>
						<Minimize size="16" />
					</Menubar.Trigger>
				{:else}
					<Menubar.Trigger
						class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 p-1 text-black hover:bg-slate-200"
						on:click={() => {
							appWindow.maximize();
							isMaximized = true;
						}}
					>
						<Maximize size="16" />
					</Menubar.Trigger>
				{/if}
			</Menubar.Menu>
			<Menubar.Menu>
				<Menubar.Trigger
					class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 p-1 text-black hover:bg-slate-200"
					on:click={() => appWindow.close()}
				>
					<X size="16" />
				</Menubar.Trigger>
			</Menubar.Menu>
		</div>
	</div>
</Menubar.Root>
