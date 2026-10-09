<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';
  import Credit from '$lib/Credit.svelte';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const brideName: string = invitation.bride?.name || 'Bride';
  const message: string = invitation.closing?.message || '';

  const rawImages: string[] = invitation.closing?.imageUrls?.length
    ? invitation.closing.imageUrls
    : invitation.gallery?.imageUrls || [];

  // Use up to 6 images for the mosaic, repeat if fewer
  const mosaicImages: string[] = Array.from(
    { length: 6 },
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
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );
    if (sectionEl) observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section
  bind:this={sectionEl}
  class="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden px-5 pt-16 pb-0"
  style="background: linear-gradient(180deg, #1c0f0a 0%, #0e0807 100%);"
>
  <!-- Warm amber glow center -->
  <div
    class="pointer-events-none absolute"
    style="width:500px;height:500px;border-radius:50%;background:radial-gradient(circle, rgba(232,164,90,0.12) 0%, transparent 70%);top:30%;left:50%;transform:translate(-50%,-50%);"
  ></div>

  {#if visible}
    <!-- Title -->
    <div in:fade={{ duration: 700 }} class="relative z-10 mb-10 text-center">
      <!-- Gold diamond ornament -->
      <div class="mb-5 flex flex-col items-center gap-1">
        <div
          style="width:1px;height:26px;background:linear-gradient(to bottom,transparent,rgba(232,164,90,0.6));"
        ></div>
        <div
          style="width:8px;height:8px;background:rgba(232,164,90,0.8);transform:rotate(45deg);"
        ></div>
        <div
          style="width:1px;height:26px;background:linear-gradient(to top,transparent,rgba(232,164,90,0.6));"
        ></div>
      </div>

      <p
        class="text-5xl"
        style="color: rgba(255,230,180,0.9); font-family: var(--font-script, serif);"
      >
        Thank You
      </p>
      <div
        class="mx-auto mt-4"
        style="width:60px;height:1px;background:linear-gradient(to right,transparent,rgba(232,164,90,0.6),transparent);"
      ></div>
      <p
        class="mt-3 text-xs tracking-[0.4em] uppercase italic"
        style="color: rgba(232,164,90,0.55); font-family: var(--font-heading, sans-serif);"
      >
        We Are Married
      </p>
    </div>

    <!-- Mosaic image grid -->
    <div in:fade={{ delay: 200, duration: 900 }} class="closing-mosaic relative z-10 w-full">
      {#each mosaicImages as img, i}
        <div
          class="mosaic-item overflow-hidden"
          in:fly={{ y: 30, delay: i * 80, duration: 700, easing: cubicOut }}
          style="
            border: 2px solid rgba(232,164,90,0.3);
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          "
        >
          <img src={img} alt="" class="h-full w-full object-cover" />
          <div
            class="absolute inset-0"
            style="background:linear-gradient(to bottom, transparent 50%, rgba(14,8,7,0.6));"
          ></div>
        </div>
      {/each}
    </div>

    <!-- Text block -->
    <div
      in:fly={{ y: 20, delay: 700, duration: 700, easing: cubicOut }}
      class="relative z-10 flex w-full max-w-sm flex-col items-center px-6 py-14 text-center"
    >
      <!-- Gold divider -->
      <div class="mb-8 flex items-center gap-3">
        <div style="width:40px;height:1px;background:linear-gradient(to right,transparent,rgba(232,164,90,0.4));"></div>
        <div
          style="width:6px;height:6px;background:rgba(232,164,90,0.6);transform:rotate(45deg);"
        ></div>
        <div style="width:40px;height:1px;background:linear-gradient(to left,transparent,rgba(232,164,90,0.4));"></div>
      </div>

      <!-- Mempelai label -->
      <p
        class="mb-2 text-[10px] tracking-[0.35em] uppercase"
        style="color: rgba(232,164,90,0.5); font-family: var(--font-heading, sans-serif);"
      >
        Mempelai
      </p>

      <!-- Names vertical stacked -->
      <span
        class="block text-4xl"
        style="font-family: var(--font-script, serif); color: rgba(255,230,180,0.95);"
        >{brideName}</span
      >
      <span
        class="my-2 block text-2xl"
        style="font-family: var(--font-script, serif); color: rgba(232,164,90,0.65);">&amp;</span
      >
      <span
        class="block text-4xl"
        style="font-family: var(--font-script, serif); color: rgba(255,230,180,0.95);"
        >{groomName}</span
      >

      <!-- Divider -->
      <div class="my-8 flex items-center gap-3">
        <div style="width:40px;height:1px;background:linear-gradient(to right,transparent,rgba(232,164,90,0.3));"></div>
        <div
          style="width:4px;height:4px;background:rgba(232,164,90,0.5);transform:rotate(45deg);"
        ></div>
        <div style="width:40px;height:1px;background:linear-gradient(to left,transparent,rgba(232,164,90,0.3));"></div>
      </div>

      <!-- Message -->
      <p
        class="mx-auto max-w-xs text-xs leading-relaxed italic"
        style="color: rgba(255,200,140,0.55); font-family: var(--font-heading, sans-serif);"
      >
        {#if message}
          {message}
        {:else}
          Terima kasih telah menjadi bagian dari hari istimewa kami.<br />
          Doa dan kehadiran Anda adalah kebahagiaan terbesar bagi kami.
        {/if}
      </p>

      <div class="mt-10">
        <Credit />
      </div>
    </div>
  {/if}
</section>

<style>
  .closing-mosaic {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 160px 120px;
    gap: 6px;
  }

  .mosaic-item {
    position: relative;
  }

  /* First item spans 2 rows */
  .mosaic-item:first-child {
    grid-row: span 2;
  }
</style>
