<script lang="ts">
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';
  import { createEventDispatcher, onMount } from 'svelte';

  export let invitation: any;

  const groomName = invitation.groom?.name || 'Groom';
  const brideName = invitation.bride?.name || 'Bride';
  const guestName = invitation.guestName || '';
  const bg: string = invitation.cover?.imageUrls?.[0] || '';
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.6, minRem: 1.45, endAt: 28 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.6, minRem: 1.45, endAt: 28 });

  let show = false;
  const dispatch = createEventDispatcher();

  onMount(() => setTimeout(() => (show = true), 60));
</script>

<section
  class="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden"
>
  <!-- Single full-bleed photo with slow Ken Burns -->
  {#if bg}
    <div
      class="kenburns absolute inset-0 bg-cover bg-center"
      style="background-image: url('{bg}');"
    ></div>
  {:else}
    <div class="absolute inset-0 bg-neutral-900"></div>
  {/if}

  <!-- Radial vignette: dark edges, slightly lighter center -->
  <div
    class="pointer-events-none absolute inset-0"
    style="background: radial-gradient(ellipse at center, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.62) 60%, rgba(0,0,0,0.86) 100%);"
  ></div>

  <!-- Corner bracket ornaments — the "frame" motif -->
  <div
    class="pointer-events-none absolute top-5 left-5 h-10 w-10 border-t-2 border-l-2 border-white/25"
  ></div>
  <div
    class="pointer-events-none absolute top-5 right-5 h-10 w-10 border-t-2 border-r-2 border-white/25"
  ></div>
  <div
    class="pointer-events-none absolute bottom-5 left-5 h-10 w-10 border-b-2 border-l-2 border-white/25"
  ></div>
  <div
    class="pointer-events-none absolute right-5 bottom-5 h-10 w-10 border-r-2 border-b-2 border-white/25"
  ></div>

  <!-- Centered content -->
  <div class="relative z-10 flex flex-col items-center px-8 text-center">
    <!-- Eyebrow -->
    <p
      class="item-fadein font-body text-[9px] tracking-[0.55em] text-white/40 uppercase"
      style="animation-delay:100ms;"
    >
      The Wedding of
    </p>

    <!-- Thin rule -->
    <div class="item-fadein my-5 h-px w-8 bg-white/25" style="animation-delay:220ms;"></div>

    <!-- Bride name -->
    <h1
      class="item-slideup font-heading text-4xl font-light text-white"
      style={brideNameStyle + '; animation-delay:300ms;'}
    >
      {brideName}
    </h1>

    <!-- Ampersand in script -->
    <p
      class="item-fadein font-script leading-none text-white/50"
      style="animation-delay:430ms; font-size: clamp(44px, 14vw, 68px);"
    >
      &amp;
    </p>

    <!-- Groom name -->
    <h1
      class="item-slideup font-heading text-4xl font-light text-white"
      style={groomNameStyle + '; animation-delay:540ms;'}
    >
      {groomName}
    </h1>

    <!-- Thin rule -->
    <div class="item-fadein my-5 h-px w-8 bg-white/25" style="animation-delay:660ms;"></div>

    <!-- Guest -->
    {#if guestName}
      <div class="item-fadein mb-6" style="animation-delay:720ms;">
        <p class="font-body text-[9px] tracking-[0.4em] text-white/35 uppercase">Kepada Yth.</p>
        <p class="mt-1.5 font-body text-sm text-white/65">{guestName}</p>
      </div>
    {/if}

    <!-- CTA -->
    <button
      class="item-fadein group mt-4 flex flex-col items-center gap-2"
      style="animation-delay:850ms;"
      on:click={() => dispatch('open')}
    >
      <span
        class="font-body text-[10px] tracking-[0.4em] text-white/50 uppercase transition-colors group-hover:text-white/80"
      >
        Buka Undangan
      </span>
      <!-- Animated chevron down -->
      <svg
        viewBox="0 0 24 24"
        class="h-4 w-4 animate-bounce text-white/35"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  </div>
</section>

<style>
  /* Ken Burns: slow scale-up over 18s, no slideshow */
  .kenburns {
    animation: kb 18s ease-in-out forwards;
    transform-origin: center center;
  }
  @keyframes kb {
    from {
      transform: scale(1.08);
    }
    to {
      transform: scale(1);
    }
  }

  /* Entrance animations */
  .item-fadein {
    opacity: 0;
    animation: fadein 1100ms ease forwards;
  }
  .item-slideup {
    opacity: 0;
    animation: slideup 1100ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes slideup {
    from {
      opacity: 0;
      transform: translateY(22px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
