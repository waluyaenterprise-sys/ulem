<script lang="ts">
  import { onMount } from 'svelte';

  export let invitation: any;

  const quote: string =
    invitation.quote?.text ||
    '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."';
  const quoteSource: string = invitation.quote?.source || 'QS. Ar-Rum: 21';

  let el: HTMLElement;
  let visible = false;
  onMount(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          visible = true;
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  });

  function s(delayMs: number) {
    return `animation: quoteFadeIn 0.8s ease ${delayMs}ms both;`;
  }
</script>

<section
  bind:this={el}
  class="relative w-full overflow-hidden px-6 py-24"
  style="background:#faf0dc;"
>
  <!-- Film grain -->
  <div
    class="film-grain pointer-events-none absolute inset-0"
    style="opacity:0.18"
    aria-hidden="true"
  ></div>

  {#if visible}
    <!-- Scene label -->
    <div style={s(0)} class="mb-8 text-center">
      <p
        class="text-xs tracking-[0.6em] uppercase"
        style="color:#7a6848;font-family:var(--font-heading,sans-serif);"
      >
        Scene I
      </p>
      <p
        class="mt-1 text-xl font-bold"
        style="color:#1a1008;font-family:var(--font-heading,sans-serif);letter-spacing:-0.01em;"
      >
        Firman &amp; Doa
      </p>
    </div>

    <!-- Retro quote card — styled like a clapperboard intertitle -->
    <div style={s(200) + 'background:#1a1008;padding:2px;'} class="relative mx-auto max-w-sm">
      <!-- Double border inner frame -->
      <div style="border:1px solid #c9933a;padding:28px 24px;">
        <!-- Corner ornaments -->
        <div
          class="absolute top-3 left-3 h-3 w-3"
          style="border-top:2px solid #c9933a;border-left:2px solid #c9933a;"
          aria-hidden="true"
        ></div>
        <div
          class="absolute top-3 right-3 h-3 w-3"
          style="border-top:2px solid #c9933a;border-right:2px solid #c9933a;"
          aria-hidden="true"
        ></div>
        <div
          class="absolute bottom-3 left-3 h-3 w-3"
          style="border-bottom:2px solid #c9933a;border-left:2px solid #c9933a;"
          aria-hidden="true"
        ></div>
        <div
          class="absolute right-3 bottom-3 h-3 w-3"
          style="border-bottom:2px solid #c9933a;border-right:2px solid #c9933a;"
          aria-hidden="true"
        ></div>

        <!-- Large open quote -->
        <div
          class="mb-3 text-center select-none"
          aria-hidden="true"
          style="font-size:3.5rem;line-height:0.7;color:rgba(201,147,58,0.3);font-family:Georgia,serif;"
        >
          "
        </div>

        <p
          class="text-center text-sm leading-loose italic"
          style="color:#c9a96e;font-family:var(--font-body,sans-serif);"
        >
          {quote}
        </p>

        <!-- Source -->
        <div class="mt-5 flex items-center justify-center gap-3">
          <div style="width:20px;height:1px;background:#c9933a;opacity:0.5;"></div>
          <span
            class="text-xs tracking-[0.4em] uppercase"
            style="color:#c9933a;font-family:var(--font-heading,sans-serif);">{quoteSource}</span
          >
          <div style="width:20px;height:1px;background:#c9933a;opacity:0.5;"></div>
        </div>
      </div>
    </div>

    <!-- Bottom reel strip -->
    <div style={s(400)} class="mx-auto mt-10 flex max-w-sm items-center justify-center gap-2">
      {#each Array(8) as _}
        <div style="width:8px;height:6px;background:#1a1008;border-radius:1px;opacity:0.25;"></div>
      {/each}
    </div>
  {/if}
</section>

<style>
  @keyframes quoteFadeIn {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .film-grain {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    background-repeat: repeat;
  }
</style>
