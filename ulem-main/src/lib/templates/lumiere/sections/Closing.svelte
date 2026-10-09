<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';
  import Credit from '$lib/Credit.svelte';
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const brideName: string = invitation.bride?.name || 'Bride';
  const message: string = invitation.closing?.message || '';
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.1, minRem: 1.05, endAt: 24 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.1, minRem: 1.05, endAt: 24 });

  // Use closing images, fallback to gallery
  const rawImages: string[] = invitation.closing?.imageUrls?.length
    ? invitation.closing.imageUrls
    : invitation.gallery?.imageUrls || [];

  // Pick 5 images (repeat if fewer)
  const sliceImages: string[] = Array.from(
    { length: 5 },
    (_, i) => rawImages[i % rawImages.length] || ''
  );

  let visible = false;
  let sectionEl: HTMLElement;

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
    if (sectionEl) observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section
  bind:this={sectionEl}
  class="flex min-h-svh w-full flex-col justify-center overflow-hidden bg-[#1a1612] px-4 pt-12 pb-0"
>
  {#if visible}
    <!-- Title -->
    <div in:fade={{ duration: 700 }} class="mb-8 text-center">
      <p class="font-heading text-2xl tracking-[0.4em] text-[#c9b49a] uppercase">Thank You</p>
    </div>

    <!-- 5 vertical image slices -->
    <div in:fade={{ duration: 900 }} class="slices">
      {#each sliceImages as img, i}
        <div class="slice" in:fly={{ y: 30, delay: i * 100, duration: 700, easing: cubicOut }}>
          <img src={img} alt="" />
        </div>
      {/each}
    </div>

    <!-- Text block below slices -->
    <div
      in:fly={{ y: 20, delay: 600, duration: 700, easing: cubicOut }}
      class="flex flex-col items-center px-8 py-12 text-center"
    >
      <!-- Names -->
      <div class="flex items-center gap-3">
        <span class="font-script text-3xl text-white" style={brideNameStyle}>{brideName}</span>
        <span class="font-heading text-lg text-[#c9b49a]">&amp;</span>
        <span class="font-script text-3xl text-white" style={groomNameStyle}>{groomName}</span>
      </div>

      <!-- Thin divider -->
      <div class="my-6 w-10 border-t border-[#c9b49a]"></div>

      <!-- Quote / message -->
      {#if message}
        <p class="mx-auto max-w-xs font-heading text-xs leading-relaxed text-white/70 italic">
          {message}
        </p>
      {:else}
        <p class="mx-auto max-w-xs font-heading text-xs leading-relaxed text-white/70 italic">
          Terima kasih telah menjadi bagian dari hari istimewa kami.<br />
          Doa dan kehadiran Anda adalah kebahagiaan terbesar bagi kami.
        </p>
      {/if}

      <!-- Credit -->
      <div class="mt-10">
        <Credit />
      </div>
    </div>
  {/if}
</section>

<style>
  /* 5-column grid: outer slices shorter, middle taller */
  .slices {
    display: grid;
    grid-template-columns: 1fr 1.2fr 1.6fr 1.2fr 1fr;
    align-items: center;
    width: 100%;
    gap: 3px;
  }

  .slice {
    overflow: hidden;
    position: relative;
  }

  /* heights per position */
  .slice:nth-child(1) {
    height: 200px;
  }
  .slice:nth-child(2) {
    height: 260px;
  }
  .slice:nth-child(3) {
    height: 340px;
  }
  .slice:nth-child(4) {
    height: 260px;
  }
  .slice:nth-child(5) {
    height: 200px;
  }

  .slice img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  /* Subtle dark overlay on each slice */
  .slice::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.35), transparent 60%);
  }
</style>
