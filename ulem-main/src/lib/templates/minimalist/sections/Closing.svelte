<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import Credit from '$lib/Credit.svelte';

  export let invitation: any;

  const groomName: string = (invitation.groom.name || 'Groom').split(' ')[0];
  const brideName: string = (invitation.bride.name || 'Bride').split(' ')[0];
  const message: string = invitation.closing?.message || '';
  const closingImages: string[] = invitation.closing?.imageUrls || [];
  const coverImages: string[] = invitation.cover?.imageUrls || [];

  // Fallback: use cover image if no closing image
  const bgImage = closingImages[0] || coverImages[0] || '/images/default/cover.png';

  let sectionEl: HTMLElement;
  let visible = false;

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section
  bind:this={sectionEl}
  class="relative flex min-h-svh w-full flex-col items-center justify-between bg-cover bg-center bg-no-repeat py-16"
  style={`background-image: url(${encodeURI(bgImage)});`}
>
  <!-- OVERLAY -->
  <div class="absolute inset-0 bg-black/50"></div>

  <!-- SPACER TOP -->
  <div></div>

  <!-- CENTER CONTENT -->
  {#if visible}
    <div class="relative z-10 flex flex-col items-center px-8 text-center text-white">
      <!-- SCRIPT LABEL -->
      <p in:fade={{ duration: 700 }} class="font-script text-3xl text-white/80">The Wedding Of</p>

      <!-- NAMES -->
      <h1
        in:fly={{ y: 24, delay: 300, duration: 800, easing: cubicOut }}
        class="mt-4 font-jomolhari text-5xl tracking-wide"
      >
        {brideName}
      </h1>
      <p in:fade={{ delay: 500, duration: 600 }} class="my-2 font-jomolhari text-3xl text-white/70">
        &amp;
      </p>
      <h1
        in:fly={{ y: 24, delay: 600, duration: 800, easing: cubicOut }}
        class="font-jomolhari text-5xl tracking-wide"
      >
        {groomName}
      </h1>

      <!-- DIVIDER -->
      <div in:fade={{ delay: 800, duration: 600 }} class="my-8 h-px w-16 bg-[#F0A269]/60"></div>

      <!-- CLOSING MESSAGE / QUOTE -->
      {#if message}
        <p
          in:fly={{ y: 16, delay: 900, duration: 700, easing: cubicOut }}
          class="max-w-xs font-jomolhari text-sm leading-relaxed text-white/70 italic"
        >
          "{message}"
        </p>
      {:else}
        <p
          in:fly={{ y: 16, delay: 900, duration: 700, easing: cubicOut }}
          class="max-w-xs font-jomolhari text-sm leading-relaxed text-white/70 italic"
        >
          "Terima kasih telah menjadi bagian dari hari bahagia kami."
        </p>
      {/if}
    </div>
  {/if}

  <!-- CREDIT AT BOTTOM -->
  <div class="relative z-10 mt-10">
    <Credit />
  </div>
</section>
