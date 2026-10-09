<script lang="ts">
  import Petals from './Petal.svelte';
  import FlowerIcon from './FlowerIcon.svelte';
  export let invitation: any;

  const quoteImages: string[] = invitation.quote?.imageUrls || [];
  const bgImage = quoteImages[0] || invitation.cover?.imageUrls?.[0] || '';
  const quoteText: string = invitation.quote?.text || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.';
  const quoteSource: string = invitation.quote?.source || 'QS. Ar-Rum: 21';

  function reveal(node: HTMLElement, { delay = 0, y = 20 } = {}) {
    node.style.opacity = '0';
    node.style.transform = `translateY(${y}px)`;
    node.style.transition = `opacity 1s ease ${delay}ms, transform 1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'translateY(0)';
          io.unobserve(node);
        }
      },
      { threshold: 0.15 }
    );
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }
</script>

<section
  class="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-black"
>
  <Petals />

  <!-- Decorative flowers -->
  <div class="pointer-events-none absolute top-4 left-4 z-10">
    <FlowerIcon size={40} opacity={0.12} />
  </div>
  <div class="pointer-events-none absolute right-4 bottom-4 z-10">
    <FlowerIcon size={32} opacity={0.1} />
  </div>

  <!-- Background photo -->
  {#if bgImage}
    <div
      class="absolute inset-0 bg-cover bg-center"
      style="background-image: url('{bgImage}'); opacity: 0.45;"
    ></div>
  {/if}

  <!-- Top-left corner accent -->
  <div
    class="pointer-events-none absolute top-6 left-6 h-12 w-12 border-t-2 border-l-2 border-white/20"
  ></div>
  <div
    class="pointer-events-none absolute right-6 bottom-6 h-12 w-12 border-r-2 border-b-2 border-white/20"
  ></div>

  <!-- Content -->
<div class="relative z-10 mx-auto max-w-xs px-8 text-center text-white">
    <div class="flex items-center justify-center gap-2">
      <FlowerIcon size={16} opacity={0.35} />
      <p class="font-body text-[9px] tracking-[0.45em] text-white/40 uppercase">
        Firman Allah SWT
      </p>
      <FlowerIcon size={16} opacity={0.35} />
    </div>

    <div use:reveal={{ delay: 120, y: 16 }} class="mx-auto mt-5 w-8 border-t border-white/20"></div>

    <p
      use:reveal={{ delay: 200, y: 16 }}
      class="mt-5 font-heading text-base leading-relaxed font-light text-white/85 italic"
    >
      “{quoteText}”
    </p>

    <p
      use:reveal={{ delay: 340, y: 12 }}
      class="mt-5 font-body text-[10px] tracking-[0.3em] text-white/35 uppercase"
    >
      {quoteSource}
    </p>
  </div>
</section>
