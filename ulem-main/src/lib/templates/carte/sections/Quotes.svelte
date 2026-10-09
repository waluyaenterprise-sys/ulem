<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let invitation: any;

  const quote: string =
    invitation.quote?.text ||
    '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."';
  const quoteSource: string = invitation.quote?.source || 'QS. Ar-Rum: 21';

  let el: HTMLElement;
  let visible = false;
  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  });
</script>

<section
  bind:this={el}
  class="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-8 py-20"
  style="background:#3d0a0a;"
>
  <!-- Parchment grain overlay -->
  <div
    class="pointer-events-none absolute inset-0"
    style="background:repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(255,220,160,0.015) 2px,rgba(255,220,160,0.015) 4px);"
    aria-hidden="true"
  ></div>

  <!-- Warm glow center -->
  <div
    class="pointer-events-none absolute inset-0 flex items-center justify-center"
    aria-hidden="true"
  >
    <div
      style="width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(184,150,46,0.12) 0%,transparent 70%);"
    ></div>
  </div>

  <div class="relative z-10 w-full max-w-xs text-center">
    <!-- Decorative frame -->
    <div
      class="relative px-8 py-10"
      style="border:1px solid rgba(184,150,46,0.4);box-shadow:0 0 0 4px rgba(107,20,20,0.8),0 0 0 5px rgba(184,150,46,0.3);"
    >
      <!-- Corner fleur -->
      {#each ['top-0 left-0', 'top-0 right-0 scale-x-[-1]', 'bottom-0 left-0 scale-y-[-1]', 'bottom-0 right-0 scale-x-[-1] scale-y-[-1]'] as pos}
        <div class="pointer-events-none absolute {pos} p-1" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 13 L1 1 L13 1"
              stroke="#b8962e"
              stroke-width="1"
              fill="none"
              opacity="0.6"
            />
          </svg>
        </div>
      {/each}

      <!-- Section label -->
      <div
        class="mb-6"
        style="opacity:{visible ? 1 : 0};transform:translateY({visible
          ? 0
          : -12}px);transition:opacity 700ms ease,transform 700ms ease;"
      >
        <p
          class="text-xs tracking-[0.6em] uppercase"
          style="color:rgba(184,150,46,0.7);font-family:var(--font-heading,serif);"
        >
          — Firman &amp; Doa —
        </p>
      </div>

      <!-- Quote marks -->
      <div class="mb-3" style="opacity:{visible ? 1 : 0};transition:opacity 900ms 150ms ease;">
        <span
          style="font-size:3rem;line-height:1;color:rgba(184,150,46,0.25);font-family:Georgia,serif;"
          >"</span
        >
      </div>

      <!-- Quote text -->
      <div
        style="opacity:{visible ? 1 : 0};transform:translateY({visible
          ? 0
          : 20}px);transition:opacity 800ms 200ms ease,transform 800ms 200ms cubic-bezier(0.33,1,0.68,1);"
      >
        <p
          class="leading-relaxed italic"
          style="color:rgba(245,237,224,0.88);font-family:var(--font-body,serif);font-size:0.88rem;line-height:1.9;"
        >
          {quote}
        </p>

        <!-- Gold rule -->
        <div class="mx-auto mt-6 mb-3 flex items-center gap-2" style="width:100px;">
          <div style="flex:1;height:1px;background:#b8962e;opacity:0.5;"></div>
          <svg width="5" height="5" viewBox="0 0 5 5">
            <rect
              x="0.5"
              y="0.5"
              width="4"
              height="4"
              transform="rotate(45 2.5 2.5)"
              fill="#b8962e"
              opacity="0.7"
            />
          </svg>
          <div style="flex:1;height:1px;background:#b8962e;opacity:0.5;"></div>
        </div>

        <p
          class="text-xs tracking-[0.4em] uppercase"
          style="color:rgba(184,150,46,0.6);font-family:var(--font-heading,serif);"
        >
          {quoteSource}
        </p>
      </div>
    </div>
  </div>
</section>
