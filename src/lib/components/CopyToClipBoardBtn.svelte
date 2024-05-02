<script lang="ts">
	import { onDestroy } from "svelte";

	import IconCopy from "./icons/IconCopy.svelte";
	import Tooltip from "./Tooltip.svelte";

	export let classNames = "";
	export let value: string;

	let isSuccess = false;
	let timeout: ReturnType<typeof setTimeout>;

	function fallbackCopyTextToClipboard(text) {
		var textArea = document.createElement("textarea");
		textArea.value = text;
		
		// Avoid scrolling to bottom of page on appendChild()
		textArea.style.top = "0";
		textArea.style.left = "0";
		textArea.style.position = "fixed";

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			console.log('Fallback: Copying was ' + msg);
			
			// Cleanup after copy attempt
			document.body.removeChild(textArea);
			return successful;
		} catch (err) {
			console.error('Fallback: Oops, unable to copy', err);
			return false;
		}
	}

	const handleClick = async () => {
		// writeText() can be unavailable or fail in some cases (iframe, etc) so we try/catch
		try {
			if (!navigator.clipboard) {
				fallbackCopyTextToClipboard(value); 
				return;
			}
			await navigator.clipboard.writeText(value);

			isSuccess = true;
			if (timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(() => {
				isSuccess = false;
			}, 1000);
		} catch (err) {
			console.error(err);
		}
	};

	onDestroy(() => {
		if (timeout) {
			clearTimeout(timeout);
		}
	});
</script>

<button
	class="btn rounded-lg border border-gray-200 px-2 py-2 text-sm shadow-sm transition-all hover:border-gray-300 active:shadow-inner dark:border-gray-700 dark:hover:border-gray-500 {classNames}"
	title={"Copy to clipboard"}
	type="button"
	on:click
	on:click={handleClick}
>
	<div class="relative">
		<slot>
			<IconCopy classNames="dark:text-gray-700 text-gray-200" />
		</slot>

		<Tooltip classNames={isSuccess ? "opacity-100" : "opacity-0"} />
	</div>
</button>
