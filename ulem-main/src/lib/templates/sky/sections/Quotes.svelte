<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let invitation: any;
  const quoteText: string = invitation?.quote?.text || 'Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.';
  const quoteSource: string = invitation?.quote?.source || 'QS Ar-Rum: 21';

  let show = false;

  onMount(() => {
    show = true;
  });
</script>

{#if show}
  <section
    in:fade={{ duration: 900 }}
    class="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
    style="background-image: url('/images/sky/blue-palette.png');"
  >
    <img src="/assets/sky/starfall.svg" alt="" class="absolute top-0 -right-30 z-10 -rotate-12" />
    <img src="/assets/sky/moon.svg" alt="" class="absolute top-30" />
    <div
      in:fly={{ y: 24, delay: 700, duration: 800, easing: cubicOut }}
      class="absolute flex flex-col items-center justify-center gap-y-3 px-6 text-center text-white"
    >
      <h1 in:fade={{ delay: 850, duration: 700 }} class="font-jomolhari text-lg leading-relaxed">
        {quoteText}
      </h1>

      <p in:fade={{ delay: 1000, duration: 600 }} class="font-jomolhari text-sm opacity-80">
        {quoteSource}
      </p>
    </div>
  </section>
{/if}
