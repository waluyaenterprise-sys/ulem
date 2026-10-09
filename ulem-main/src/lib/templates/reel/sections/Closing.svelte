<script lang="ts">
  import Credit from '$lib/Credit.svelte';
  import { onMount } from 'svelte';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const brideName: string = invitation.bride?.name || 'Bride';
  const closingImage: string =
    invitation.closing?.imageUrls?.[0] || invitation.cover?.imageUrls?.[0] || '';
  const closingMessage: string = invitation.closing?.message || '';

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
      { threshold: 0.2 }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  });

  function s(delayMs: number) {
    return `animation: closingRollIn 0.8s ease ${delayMs}ms both;`;
  }
</script>

<section
  bind:this={el}
  class="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24"
  style="background:#0d0905;"
>
  <!-- Film grain -->
  <div
    class="film-grain pointer-events-none absolute inset-0"
    style="opacity:0.35"
    aria-hidden="true"
  ></div>

  <!-- Vignette -->
  <div
    class="pointer-events-none absolute inset-0"
    style="background:radial-gradient(ellipse at center,transparent 35%,rgba(0,0,0,0.7) 100%);"
    aria-hidden="true"
  ></div>

  <!-- Cinematic letterbox bars -->
  <div class="absolute top-0 right-0 left-0 h-12" style="background:#000;" aria-hidden="true">
    <div class="flex h-full items-center justify-center gap-4 px-6">
      {#each Array(12) as _}
        <div
          style="width:10px;height:7px;background:#1a1008;border:1px solid #2a2015;flex-shrink:0;border-radius:1px;"
        ></div>
      {/each}
    </div>
  </div>
  <div class="absolute right-0 bottom-0 left-0 h-12" style="background:#000;" aria-hidden="true">
    <div class="flex h-full items-center justify-center gap-4 px-6">
      {#each Array(12) as _}
        <div
          style="width:10px;height:7px;background:#1a1008;border:1px solid #2a2015;flex-shrink:0;border-radius:1px;"
        ></div>
      {/each}
    </div>
  </div>

  <!-- Background photo -->
  {#if closingImage}
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <img
        src={closingImage}
        alt=""
        class="h-full w-full object-cover"
        style="opacity:0.15;filter:sepia(0.8) contrast(1.1) brightness(0.5);"
      />
    </div>
  {/if}

  <!-- End card -->
  <div class="relative z-10 w-full max-w-xs text-center">
    {#if visible}
      <!-- "THE END" title card -->
      <div style={s(0)} class="mb-8">
        <div
          class="mx-auto inline-block px-6 py-3"
          style="border:1px solid rgba(201,147,58,0.4);background:rgba(201,147,58,0.05);"
        >
          <p
            class="text-xs tracking-[0.7em] uppercase"
            style="color:#7a6848;font-family:var(--font-heading,sans-serif);"
          >
            — The End —
          </p>
        </div>
      </div>

      <!-- Names as film credits -->
      <div style={s(300)}>
        <h2
          style="font-size:clamp(2.4rem,11vw,4rem);font-family:var(--font-script,cursive);color:#f5e6c8;line-height:0.9;text-shadow:0 2px 20px rgba(0,0,0,0.8);"
        >
          {brideName}
        </h2>
        <p
          class="my-3 text-xs tracking-[1em] uppercase"
          style="color:#c9933a;font-family:var(--font-heading,sans-serif);"
        >
          &amp;
        </p>
        <h2
          style="font-size:clamp(2.4rem,11vw,4rem);font-family:var(--font-script,cursive);color:#f5e6c8;line-height:0.9;text-shadow:0 2px 20px rgba(0,0,0,0.8);"
        >
          {groomName}
        </h2>
      </div>

      <!-- Message -->
      <div style={s(600)} class="mx-auto mt-8 max-w-xs">
        <div
          style="border-top:1px solid rgba(201,147,58,0.2);border-bottom:1px solid rgba(201,147,58,0.2);padding:16px 0;"
        >
          <p
            class="text-xs leading-loose italic"
            style="color:#5a4e38;font-family:var(--font-body,sans-serif);"
          >
            {closingMessage ||
              'Mohon doa restu agar kami senantiasa diberikan kebahagiaan, keberkahan, dan cinta yang abadi.'}
          </p>
        </div>
      </div>

      <!-- Credits roll — "Directed by Love" -->
      <div style={s(900)} class="mt-8 space-y-1 text-center">
        <p
          class="text-xs tracking-[0.4em] uppercase"
          style="color:#3d3020;font-family:var(--font-heading,sans-serif);"
        >
          Directed by
        </p>
        <p class="text-xs" style="color:#5a4e38;font-family:var(--font-body,sans-serif);">
          The Almighty
        </p>
        <div
          class="mx-auto my-3"
          style="width:24px;height:1px;background:rgba(201,147,58,0.3);"
        ></div>
        <p
          class="text-xs tracking-[0.4em] uppercase"
          style="color:#3d3020;font-family:var(--font-heading,sans-serif);"
        >
          Produced by
        </p>
        <p class="text-xs" style="color:#5a4e38;font-family:var(--font-body,sans-serif);">
          Love &amp; Family
        </p>
        <div
          class="mx-auto my-3"
          style="width:24px;height:1px;background:rgba(201,147,58,0.3);"
        ></div>
        <p
          class="text-xs tracking-widest"
          style="color:#2a2015;font-family:var(--font-heading,sans-serif);"
        >
          MMXXVI
        </p>
        <div class="mt-8">
          <Credit />
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  @keyframes closingRollIn {
    from {
      opacity: 0;
      transform: translateY(20px);
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
