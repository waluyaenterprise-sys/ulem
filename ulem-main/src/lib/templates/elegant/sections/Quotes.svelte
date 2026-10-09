<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';

  export let invitation: any;

  const fristLetterBride = invitation.bride.name.charAt(0);
  const fristLetterGroom = invitation.groom.name.charAt(0);
  const quoteImages: string[] = invitation.quote.imageUrls || [];
  const quoteText: string = invitation.quote?.text || 'Di antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia menciptakan pasangan-pasangan untukmu agar kamu merasa tenteram kepadanya.';
  const quoteSource: string = invitation.quote?.source || 'QS. Ar-Rum: 21';
  let show = false;

  onMount(() => {
    show = true;
  });
</script>

{#if show}
  <section class="min-h-svh overflow-hidden bg-[#f0f1ec] py-24">
    <!-- MONOGRAM -->
    <h1 in:fade={{ duration: 700 }} class="text-center font-script text-6xl text-gray-900">
      {fristLetterGroom}
      <span class="mx-2 opacity-40">|</span>
      {fristLetterBride}
    </h1>

    <!-- QUOTE -->
    <p
      in:fly={{ y: 20, delay: 150, duration: 700, easing: cubicOut }}
      class="mx-auto mt-8 w-11/12 max-w-md text-center font-heading text-base leading-relaxed text-gray-700"
    >
      {quoteText}
    </p>

    <p
      in:fade={{ delay: 350, duration: 600 }}
      class="mt-6 text-center font-body text-sm tracking-wide text-gray-500 italic"
    >
      {quoteSource}
    </p>

    <!-- IMAGES -->
    <div
      in:fly={{ y: 30, delay: 500, duration: 900, easing: cubicOut }}
      class="mt-16 flex justify-center gap-4 px-4"
    >
      <div class="h-60 w-40 overflow-hidden rounded-2xl bg-white/40 backdrop-blur">
        <img src={quoteImages[0]} class="h-full w-full object-cover" alt="" />
      </div>

      <div class="h-60 w-40 overflow-hidden rounded-2xl bg-white/60 shadow-md backdrop-blur">
        <img src={quoteImages[1]} class="h-full w-full object-cover" alt="" />
      </div>
    </div>
  </section>
{/if}
