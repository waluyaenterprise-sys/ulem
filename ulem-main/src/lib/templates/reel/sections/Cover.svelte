<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const brideName: string = invitation.bride?.name || 'Bride';
  const coverImage: string = invitation.cover?.imageUrls?.[0] || '';
  const guestName: string = invitation.guestName || 'Tamu Undangan';

  let show = false;
  onMount(() => {
    show = true;
  });

  const dispatch = createEventDispatcher();
  function open() {
    dispatch('open');
  }

  function s(delayMs: number) {
    return `animation: reelFadeIn 0.8s ease ${delayMs}ms both;`;
  }
</script>

{#if show}
  <section
    in:fade={{ duration: 800 }}
    class="relative flex h-svh w-full flex-col items-center justify-center overflow-hidden"
    style="background:#0d0905;"
  >
    <!-- Film grain overlay -->
    <div
      class="film-grain pointer-events-none absolute inset-0 z-10"
      style="opacity:0.35"
      aria-hidden="true"
    ></div>

    <!-- Vignette -->
    <div
      class="pointer-events-none absolute inset-0 z-10"
      style="background:radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,0.75) 100%);"
      aria-hidden="true"
    ></div>

    <!-- Cinematic letterbox bars -->
    <div
      class="absolute top-0 right-0 left-0 z-20 h-12"
      style="background:#000;"
      aria-hidden="true"
    >
      <!-- Film perforations top -->
      <div class="flex h-full items-center justify-center gap-4 px-6">
        {#each Array(12) as _}
          <div
            style="width:10px;height:7px;background:#1a1008;border:1px solid #2a2015;flex-shrink:0;border-radius:1px;"
          ></div>
        {/each}
      </div>
    </div>
    <div
      class="absolute right-0 bottom-0 left-0 z-20 h-12"
      style="background:#000;"
      aria-hidden="true"
    >
      <div class="flex h-full items-center justify-center gap-4 px-6">
        {#each Array(12) as _}
          <div
            style="width:10px;height:7px;background:#1a1008;border:1px solid #2a2015;flex-shrink:0;border-radius:1px;"
          ></div>
        {/each}
      </div>
    </div>

    <!-- Background photo -->
    {#if coverImage}
      <div class="absolute inset-0" aria-hidden="true">
        <img
          src={coverImage}
          alt=""
          class="h-full w-full object-cover"
          style="opacity:0.28;filter:sepia(0.7) contrast(1.1) brightness(0.65);"
        />
      </div>
    {/if}

    <!-- Center content -->
    <div class="relative z-30 flex w-full flex-col items-center px-8 text-center">
      <!-- Production label -->
      <div style={s(300)} class="mb-5">
        <p
          class="text-xs tracking-[0.7em] uppercase"
          style="color:#c9933a;font-family:var(--font-heading,sans-serif);letter-spacing:0.5em;"
        >
          A Wedding Production
        </p>
        <div
          class="mx-auto mt-2"
          style="width:60px;height:1px;background:#c9933a;opacity:0.6;"
        ></div>
      </div>

      <!-- Subtitle: "presents" -->
      <div style={s(500)}>
        <p
          class="mb-3 text-xs tracking-[0.5em] uppercase"
          style="color:#7a6848;font-family:var(--font-heading,sans-serif);"
        >
          presents
        </p>
      </div>

      <!-- Main title — names like a movie title card -->
      <div style={s(700)} class="mb-2">
        <h1
          style="font-size:clamp(2.8rem,13vw,5rem);font-family:var(--font-script,cursive);color:#f5e6c8;line-height:0.9;text-shadow:0 2px 20px rgba(0,0,0,0.8);"
        >
          {brideName}
        </h1>
      </div>
      <div style={s(800)}>
        <p
          class="my-2 text-sm tracking-[1em] uppercase"
          style="color:#c9933a;font-family:var(--font-heading,sans-serif);"
        >
          &amp;
        </p>
      </div>
      <div style={s(900)} class="mb-8">
        <h1
          style="font-size:clamp(2.8rem,13vw,5rem);font-family:var(--font-script,cursive);color:#f5e6c8;line-height:0.9;text-shadow:0 2px 20px rgba(0,0,0,0.8);"
        >
          {groomName}
        </h1>
      </div>

      <!-- Tagline divider -->
      <div style={s(1000)} class="mb-5 flex items-center gap-3">
        <div style="flex:1;max-width:60px;height:1px;background:rgba(201,147,58,0.4);"></div>
        <span
          class="text-xs tracking-[0.4em] uppercase"
          style="color:#7a6848;font-family:var(--font-heading,sans-serif);">A Love Story</span
        >
        <div style="flex:1;max-width:60px;height:1px;background:rgba(201,147,58,0.4);"></div>
      </div>

      <!-- Guest -->
      <div style={s(1100)} class="mb-8">
        <p
          class="text-xs tracking-widest uppercase"
          style="color:#5a4e38;font-family:var(--font-heading,sans-serif);"
        >
          Kepada Yth.
        </p>
        <p class="mt-1 text-base" style="color:#c9a96e;font-family:var(--font-body,sans-serif);">
          {guestName}
        </p>
      </div>

      <!-- Open button -->
      <div style={s(1200)}>
        <button
          onclick={open}
          class="flex items-center gap-3 px-6 py-3 text-xs tracking-[0.5em] uppercase transition-all duration-300"
          style="background:transparent;border:1px solid #c9933a;color:#c9933a;font-family:var(--font-heading,sans-serif);"
          onmouseenter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#c9933a';
            (e.currentTarget as HTMLElement).style.color = '#0d0905';
          }}
          onmouseleave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#c9933a';
          }}
        >
          <span>▶</span>
          <span>Putar Undangan</span>
        </button>
      </div>
    </div>

    <!-- Year badge bottom center -->
    <div
      class="absolute bottom-14 z-30 text-xs tracking-[0.5em]"
      style={s(1300) + 'color:#3d3020;font-family:var(--font-heading,sans-serif);'}
    >
      MMXXVI
    </div>
  </section>
{/if}

<style>
  @keyframes reelFadeIn {
    from {
      opacity: 0;
      transform: translateY(12px);
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
