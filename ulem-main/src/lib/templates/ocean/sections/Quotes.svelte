<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	export let invitation: any;
	const quoteText: string = invitation?.quote?.text || 'Dia membiarkan dua lautan mengalir yang keduanya kemudian bertemu.';
	const quoteSource: string = invitation?.quote?.source || 'QS Ar-Rohman: 19';

	let show = false;

	onMount(() => {
		show = true;
	});
</script>

{#if show}
	<section
		in:fade={{ duration: 900 }}
		class="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
		style="background-image: url('/images/wave.png');"
	>
		<!-- OVERLAY -->
		<div in:fade={{ duration: 900 }} class="absolute inset-0 z-10 bg-black/30"></div>

		<!-- WHALES -->
		<div
			in:fly={{ y: -40, delay: 300, duration: 900, easing: cubicOut }}
			class="relative mx-4 w-full max-w-72 overflow-visible"
		>
			<img
				src="/assets/blue-whale.svg"
				alt="Whale"
				class="pointer-events-none absolute -top-30 left-10 z-10 w-[130%] max-w-none -translate-x-1/2 translate-y-1/2"
			/>

			<img
				in:fly={{ y: 40, delay: 500, duration: 900, easing: cubicOut }}
				src="/assets/blue-whale.svg"
				alt="Whale"
				class="pointer-events-none absolute -right-1 bottom-50 z-30 w-[130%] max-w-none translate-x-1/2 translate-y-1/2 -scale-100 transform"
			/>
		</div>

		<!-- QUOTE TEXT -->
		<div
			in:fly={{ y: 24, delay: 700, duration: 800, easing: cubicOut }}
			class="absolute z-20 flex flex-col items-center justify-center gap-y-3 px-6 text-center text-white"
		>
			<h1 in:fade={{ delay: 850, duration: 700 }} class="font-jomolhari text-2xl leading-relaxed">
				{quoteText}
			</h1>

			<p in:fade={{ delay: 1000, duration: 600 }} class="font-jomolhari text-sm opacity-80">
				{quoteSource}
			</p>
		</div>
	</section>
{/if}
