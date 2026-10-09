<script lang="ts">
  export let invitation: any;

  // Use quote image, or fall back to gallery/cover photos
  const photos: string[] = [
    ...(invitation.quote?.imageUrls || []),
    ...(invitation.gallery?.imageUrls || []).slice(0, 2),
    ...(invitation.cover?.imageUrls || [])
  ].filter(Boolean);
  const quoteText: string = invitation.quote?.text || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya.';
  const quoteSource: string = invitation.quote?.source || 'QS. Ar-Rum: 21';

  const bg = photos[0] || '';

  function reveal(node: HTMLElement, { delay = 0, y = 20 } = {}) {
    node.style.opacity = '0';
    node.style.transform = `translateY(${y}px)`;
    node.style.transition = `opacity 1s ease ${delay}ms, transform 1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'none';
          io.unobserve(node);
        }
      },
      { threshold: 0.12 }
    );
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }
</script>

<section class="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden">
  <!-- Background photo -->
  {#if bg}
    <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('{bg}');"></div>
  {:else}
    <div class="absolute inset-0 bg-neutral-900"></div>
  {/if}

  <!-- Layered overlay: dark center band for text legibility -->
  <div class="pointer-events-none absolute inset-0" style="background: rgba(0,0,0,0.52);"></div>
  <div
    class="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2"
    style="height: 60%; background: rgba(0,0,0,0.2); backdrop-filter: blur(1px);"
  ></div>

  <!-- Corner lines -->
  <div
    class="pointer-events-none absolute top-6 left-6 h-10 w-10 border-t border-l border-white/20"
  ></div>
  <div
    class="pointer-events-none absolute top-6 right-6 h-10 w-10 border-t border-r border-white/20"
  ></div>
  <div
    class="pointer-events-none absolute bottom-6 left-6 h-10 w-10 border-b border-l border-white/20"
  ></div>
  <div
    class="pointer-events-none absolute right-6 bottom-6 h-10 w-10 border-r border-b border-white/20"
  ></div>

  <!-- Content -->
  <div class="relative z-10 mx-auto max-w-xs px-8 text-center text-white">
    <p use:reveal class="font-body text-[9px] tracking-[0.5em] text-white/40 uppercase">
      Firman Allah SWT
    </p>

    <div use:reveal={{ delay: 120 }} class="mx-auto my-5 w-6 border-t border-white/25"></div>

    <p
      use:reveal={{ delay: 180, y: 14 }}
      class="font-heading text-base leading-[1.8] font-light text-white/80 italic"
    >
      “{quoteText}”
    </p>

    <p
      use:reveal={{ delay: 340, y: 10 }}
      class="mt-5 font-body text-[10px] tracking-[0.35em] text-white/35 uppercase"
    >
      {quoteSource}
    </p>
  </div>
</section>
