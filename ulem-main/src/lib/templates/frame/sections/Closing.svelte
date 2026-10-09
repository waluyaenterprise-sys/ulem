<script lang="ts">
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';
  import { onMount, onDestroy } from 'svelte';
  import Credit from '$lib/Credit.svelte';

  export let invitation: any;

  const images: string[] = [
    ...(invitation.closing?.imageUrls || []),
    ...(invitation.gallery?.imageUrls || []),
    ...(invitation.cover?.imageUrls || [])
  ].filter(Boolean);

  const msg: string = invitation.closing?.message ?? '';
  const groomName: string = invitation.groom?.name ?? '';
  const brideName: string = invitation.bride?.name ?? '';
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.4, minRem: 1.2, endAt: 28 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.4, minRem: 1.2, endAt: 28 });

  // Slideshow
  let current = 0;
  let prev = -1;
  let transitioning = false;
  let timer: ReturnType<typeof setInterval>;

  onMount(() => {
    if (images.length > 1) timer = setInterval(advance, 4500);
  });
  onDestroy(() => clearInterval(timer));

  function advance() {
    if (transitioning || images.length <= 1) return;
    prev = current;
    transitioning = true;
    current = (current + 1) % images.length;
    setTimeout(() => {
      transitioning = false;
      prev = -1;
    }, 800);
  }

  function reveal(node: HTMLElement, { delay = 0, y = 20 } = {}) {
    node.style.opacity = '0';
    node.style.transform = `translateY(${y}px)`;
    node.style.transition = `opacity 1.1s ease ${delay}ms, transform 1.1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'none';
          io.unobserve(node);
        }
      },
      { threshold: 0.08 }
    );
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }
</script>

<section
  class="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden"
>
  <!-- Slideshow background -->
  {#each images as img, i}
    <div
      class="cl-slide absolute inset-0 bg-cover bg-center"
      class:cl-active={i === current}
      class:cl-leaving={i === prev}
      style="background-image: url('{img}');"
    ></div>
  {/each}
  {#if images.length === 0}
    <div class="absolute inset-0 bg-neutral-900"></div>
  {/if}

  <!-- Dark overlay -->
  <div class="pointer-events-none absolute inset-0" style="background: rgba(0,0,0,0.6);"></div>

  <!-- Corner ornaments -->
  <div
    class="pointer-events-none absolute top-4 left-4 h-10 w-10 border-t border-l border-white/20"
  ></div>
  <div
    class="pointer-events-none absolute top-4 right-4 h-10 w-10 border-t border-r border-white/20"
  ></div>
  <div
    class="pointer-events-none absolute bottom-4 left-4 h-10 w-10 border-b border-l border-white/20"
  ></div>
  <div
    class="pointer-events-none absolute right-4 bottom-4 h-10 w-10 border-r border-b border-white/20"
  ></div>

  <!-- Content -->
  <div class="relative z-10 flex flex-col items-center px-10 py-16 text-center">
    <p use:reveal class="font-body text-[9px] tracking-[0.5em] text-white/35 uppercase">
      Terima Kasih
    </p>

    {#if groomName || brideName}
      <h2
        use:reveal={{ delay: 80 }}
        class="mt-5 font-heading text-4xl leading-tight font-extralight text-white"
      >
        <span style={groomNameStyle}>{groomName}</span>
        <span class="block font-script text-3xl text-white/60">&amp;</span>
        <span style={brideNameStyle}>{brideName}</span>
      </h2>
    {/if}

    <div use:reveal={{ delay: 180 }} class="my-6 h-px w-12 bg-white/25"></div>

    {#if msg}
      <p
        use:reveal={{ delay: 260, y: 12 }}
        class="max-w-xs font-body text-sm leading-relaxed text-white/60 italic"
      >
        {msg}
      </p>
    {:else}
      <p
        use:reveal={{ delay: 260, y: 12 }}
        class="max-w-xs font-body text-sm leading-relaxed text-white/50 italic"
      >
        Terima kasih telah menjadi bagian dari hari istimewa kami.<br />
        Kami sangat menantikan kehadiran dan doa restu Anda.
      </p>
    {/if}

    <div use:reveal={{ delay: 350 }} class="mt-10">
      <Credit />
    </div>
  </div>
</section>

<style>
  .cl-slide {
    opacity: 0;
    transition: opacity 800ms cubic-bezier(0.4, 0, 0.2, 1);
    will-change: opacity;
  }
  .cl-active {
    opacity: 1;
  }
  .cl-leaving {
    opacity: 0;
  }
</style>
