<script lang="ts">
  import { onMount } from 'svelte';

  export let invitation: any;

  const quoteImages: string[] = invitation.quote?.imageUrls || [];
  const quoteText: string = invitation.quote?.text || 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.';
  const quoteSource: string = invitation.quote?.source || 'QS. Ar-Rum: 21';

  function reveal(node: HTMLElement, { delay = 0 } = {}) {
    node.style.opacity = '0';
    node.style.transform = 'translateY(28px)';
    node.style.transition = `opacity 0.9s ease ${delay}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'translateY(0)';
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(node);
    return { destroy: () => observer.disconnect() };
  }
</script>

<section
  class="relative w-full overflow-hidden px-6 py-16 text-center"
  style="background: linear-gradient(160deg, #F4E8C1 0%, #EDD9A3 50%, #F0DFA8 100%);"
>
  <!-- Parchment line texture -->
  <div
    class="pointer-events-none absolute inset-0 opacity-[0.04]"
    style="
      background-image: repeating-linear-gradient(0deg, transparent, transparent 27px, #8B4513 27px, #8B4513 28px);
    "
  ></div>

  <!-- Vignette -->
  <div
    class="pointer-events-none absolute inset-0"
    style="box-shadow: inset 0 0 70px rgba(139,69,19,0.18);"
  ></div>

  <div class="relative z-10 mx-auto max-w-sm">
    <!-- Top ornament -->
    <div use:reveal class="mb-6 flex items-center justify-center gap-3">
      <div class="h-px flex-1 bg-amber-800/30"></div>
      <svg viewBox="0 0 24 24" class="h-5 w-5 text-amber-700/60" fill="currentColor">
        <path d="M12 2L13.8 8.2H20.4L15 11.8L16.8 18L12 14.4L7.2 18L9 11.8L3.6 8.2H10.2Z" />
      </svg>
      <div class="h-px flex-1 bg-amber-800/30"></div>
    </div>

    <!-- Optional image -->
    {#if quoteImages[0]}
      <div
        use:reveal={{ delay: 100 }}
        class="mx-auto mb-8 h-52 w-full max-w-xs overflow-hidden"
        style="
          border: 3px solid #C9A227;
          box-shadow: 6px 6px 0 #8B6914, 0 0 30px rgba(139,69,19,0.25);
          transform: rotate(-0.5deg);
        "
      >
        <img src={quoteImages[0]} alt="Quote" class="h-full w-full object-cover" />
      </div>
    {/if}

    <!-- Arabic label -->
    <p
      use:reveal={{ delay: 150 }}
      class="font-body text-[10px] tracking-[0.3em] text-amber-800/50 uppercase"
    >
      Firman Allah SWT
    </p>

    <!-- Quote block -->
    <div
      use:reveal={{ delay: 220 }}
      class="relative mx-auto mt-4 max-w-xs rounded px-6 py-5"
      style="
        background: rgba(255,255,255,0.35);
        border: 1px solid rgba(184,134,11,0.3);
        box-shadow: inset 0 0 20px rgba(184,134,11,0.08);
      "
    >
      <!-- Corner ornaments -->
      <span class="absolute top-1.5 left-2 font-heading text-2xl leading-none text-amber-700/40"
        >"</span
      >
      <span class="absolute right-2 bottom-1 font-heading text-2xl leading-none text-amber-700/40"
        >"</span
      >

      <p class="font-heading text-sm leading-relaxed text-amber-900 italic">
        {quoteText}
      </p>

      <p class="mt-3 font-body text-[11px] tracking-wider text-amber-700/70">— {quoteSource} —</p>
    </div>

    <!-- Bottom ornament -->
    <div use:reveal={{ delay: 350 }} class="mt-6 flex items-center justify-center gap-3">
      <div class="h-px flex-1 bg-amber-800/30"></div>
      <div class="h-1.5 w-1.5 rotate-45 bg-amber-700/50"></div>
      <div class="h-px flex-1 bg-amber-800/30"></div>
    </div>
  </div>
</section>
