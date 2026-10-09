<script lang="ts">
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';
  import { createEventDispatcher, onMount } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import { fly, fade } from 'svelte/transition';

  export let invitation: any;

  const brideName = (invitation.bride.name || 'BRIDE').split(' ')[0];
  const groomName = (invitation.groom.name || 'GROOM').split(' ')[0];
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 3.2, minRem: 1.9, endAt: 14 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 3.2, minRem: 1.9, endAt: 14 });
  const guestName: string = invitation.guestName || 'GUEST';

  let show = false;

  onMount(() => {
    show = true;
  });

  const dispatch = createEventDispatcher();

  function openInvitation() {
    dispatch('open');
  }
</script>

{#if show}
  <section
    in:fade={{ duration: 1000 }}
    class="meadow-cover relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-6"
  >
    <!-- Wildflower corners -->
    <img
      in:fly={{ x: -30, y: -30, delay: 300, duration: 900, easing: cubicOut }}
      src="/images/watercolor/flower-1.png"
      alt=""
      class="pointer-events-none absolute -top-10 -left-14 z-10 w-56 object-contain sm:w-64"
      style="transform-origin: top left;"
    />
    <img
      in:fly={{ x: 30, y: -40, delay: 500, duration: 800, easing: cubicOut }}
      src="/images/watercolor/butterfly.png"
      alt=""
      class="pointer-events-none absolute top-6 right-6 z-10 w-16 object-contain sm:w-20"
    />
    <img
      in:fly={{ x: -30, y: 30, delay: 600, duration: 900, easing: cubicOut }}
      src="/images/watercolor/flower-2.png"
      alt=""
      class="pointer-events-none absolute -bottom-8 -left-10 z-10 w-64 object-contain sm:w-72"
      style="transform-origin: bottom left;"
    />
    <img
      in:fly={{ x: 30, y: 30, delay: 700, duration: 900, easing: cubicOut }}
      src="/images/watercolor/flower-3.png"
      alt=""
      class="pointer-events-none absolute -right-8 bottom-16 z-10 w-44 object-contain sm:w-56"
      style="transform-origin: bottom right;"
    />

    <!-- Center content -->
    <div class="relative z-20 flex flex-col items-center text-center">
      <p in:fade={{ delay: 400, duration: 800 }} class="font-type text-xs tracking-[0.3em] text-[#8a8a8a] uppercase">
        The Wedding of
      </p>

      <div class="mt-6">
        <p in:fade={{ delay: 600, duration: 800 }} class="font-script text-[#1a1a1a]" style={brideNameStyle}>
          {brideName}
        </p>
        <p in:fade={{ delay: 700, duration: 800 }} class="my-1 font-script text-3xl leading-none text-[#c97b8b] sm:text-4xl">
          &amp;
        </p>
        <p in:fade={{ delay: 800, duration: 800 }} class="font-script text-[#1a1a1a]" style={groomNameStyle}>
          {groomName}
        </p>
      </div>

      <!-- Guest name -->
      <div in:fade={{ delay: 1000, duration: 700 }} class="mt-12">
        <p class="font-type text-[10px] tracking-[0.3em] text-[#8a8a8a] uppercase">Kepada Yth.</p>
        <p class="mt-2 font-love text-base tracking-wide text-[#2c2c2c] sm:text-lg">
          {guestName}
        </p>
      </div>

      <!-- Button -->
      <div in:fly={{ y: 12, delay: 1200, duration: 600, easing: cubicOut }} class="mt-8">
        <button
          class="rounded-full border border-[#c97b8b]/70 px-7 py-2.5 font-type text-xs tracking-[0.25em] text-[#c97b8b] transition-colors duration-300 hover:border-[#6b1f1f] hover:bg-[#6b1f1f] hover:text-white"
          on:click={openInvitation}
        >
          BUKA UNDANGAN
        </button>
      </div>
    </div>
  </section>
{/if}

<style>
  .meadow-cover {
    font-family:
      'Segoe UI',
      system-ui,
      -apple-system,
      sans-serif;
    background-color: #fdfcfa;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  }
</style>
