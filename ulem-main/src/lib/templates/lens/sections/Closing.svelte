<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import Petals from './Petal.svelte';
  import FlowerIcon from './FlowerIcon.svelte';
  import Credit from '$lib/Credit.svelte';

  export let invitation: any;

  const groomFirst: string = (invitation.groom?.name || 'Groom').split(' ')[0];
  const brideFirst: string = (invitation.bride?.name || 'Bride').split(' ')[0];
  const message: string = invitation.closing?.message || '';
  const allImages: string[] = [
    ...(invitation.closing?.imageUrls || []),
    ...(invitation.gallery?.imageUrls || []),
    ...(invitation.cover?.imageUrls || [])
  ].filter(Boolean);

  // Slideshow
  let current = 0;
  let prev = -1;
  let interval: ReturnType<typeof setInterval>;

  onMount(() => {
    if (allImages.length > 1) {
      interval = setInterval(() => {
        prev = current;
        current = (current + 1) % allImages.length;
        setTimeout(() => {
          prev = -1;
        }, 700);
      }, 3800);
    }
  });
  onDestroy(() => clearInterval(interval));

  function reveal(node: HTMLElement, { delay = 0, y = 24 } = {}) {
    node.style.opacity = '0';
    node.style.transform = `translateY(${y}px)`;
    node.style.transition = `opacity 1.2s ease ${delay}ms, transform 1.2s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'none';
          io.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }
</script>

<section
  class="relative flex min-h-svh w-full flex-col items-center justify-between overflow-hidden bg-black py-16"
>
  <Petals />

  <!-- Decorative flowers -->
  <div class="pointer-events-none absolute top-4 left-4 z-10">
    <FlowerIcon size={44} opacity={0.12} />
  </div>
  <div class="pointer-events-none absolute top-4 right-4 z-10">
    <FlowerIcon size={36} opacity={0.1} />
  </div>
  <div class="pointer-events-none absolute bottom-20 left-6 z-10">
    <FlowerIcon size={28} opacity={0.08} />
  </div>
  <div class="pointer-events-none absolute right-6 bottom-20 z-10">
    <FlowerIcon size={40} opacity={0.1} />
  </div>

  <!-- Slideshow background -->
  {#each allImages as img, i}
    <div
      class="closing-slide absolute inset-0 bg-cover bg-center"
      class:active={i === current}
      class:leaving={i === prev}
      style="background-image: url('{img}');"
    ></div>
  {/each}

  <!-- Overlay -->
  <div class="pointer-events-none absolute inset-0" style="background: rgba(0,0,0,0.58);"></div>

  <!-- Spacer -->
  <div></div>

  <!-- Center content -->
  <div class="relative z-10 w-full px-8 text-center text-white">
    <div class="flex items-center justify-center gap-2">
      <FlowerIcon size={18} opacity={0.35} />
      <p class="font-body text-[9px] tracking-[0.5em] text-white/40 uppercase">Terima Kasih</p>
      <FlowerIcon size={18} opacity={0.35} />
    </div>

    <h1
      use:reveal={{ delay: 100, y: 20 }}
      class="mt-4 font-heading text-5xl leading-tight font-light"
    >
      {brideFirst}
    </h1>
    <p use:reveal={{ delay: 180 }} class="my-2 font-body text-sm text-white/35">&amp;</p>
    <h1 use:reveal={{ delay: 220, y: 20 }} class="font-heading text-5xl leading-tight font-light">
      {groomFirst}
    </h1>

    {#if message}
      <p
        use:reveal={{ delay: 360, y: 16 }}
        class="mx-auto mt-8 max-w-xs font-body text-sm leading-relaxed text-white/55 italic"
      >
        {message}
      </p>
    {:else}
      <p
        use:reveal={{ delay: 360, y: 16 }}
        class="mx-auto mt-8 max-w-xs font-body text-sm leading-relaxed text-white/55 italic"
      >
        Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan
        memberikan doa restu.
      </p>
    {/if}

    <!-- Thin line ornament -->
    <div use:reveal={{ delay: 480 }} class="mx-auto mt-8 flex items-center justify-center gap-3">
      <div class="h-px w-12 bg-white/20"></div>
      <div class="h-1 w-1 rotate-45 bg-white/30"></div>
      <div class="h-px w-12 bg-white/20"></div>
    </div>
  </div>

  <!-- Bottom credit -->
  <div class="relative z-10 w-full">
    <Credit />
  </div>
</section>

<style>
  .closing-slide {
    opacity: 0;
    transition: opacity 700ms cubic-bezier(0.4, 0, 0.2, 1);
    will-change: opacity;
  }
  .closing-slide.active {
    opacity: 1;
  }
  .closing-slide.leaving {
    opacity: 0;
  }
</style>
