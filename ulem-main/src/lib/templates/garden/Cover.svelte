<script lang="ts">
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';
  import { createEventDispatcher, onMount } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import { fly, fade, scale } from 'svelte/transition';

  export let invitation: any;

  const brideName = (invitation.bride.name || 'BRIDE').split(' ')[0];
  const groomName = (invitation.groom.name || 'GROOM').split(' ')[0];
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 3.0, minRem: 1.8, endAt: 14 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 3.0, minRem: 1.8, endAt: 14 });
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
    class="garden-cover relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden"
  >
    <!-- Corner flowers (relative to viewport) -->
    <img
      in:fly={{ x: 30, y: -40, delay: 600, duration: 800, easing: cubicOut }}
      src="/images/watercolor/butterfly.png"
      alt=""
      class="pointer-events-none absolute top-0 right-7 z-20 w-42 object-contain sm:w-14"
    />
    <img
      in:fly={{ x: -30, y: 30, delay: 500, duration: 900, easing: cubicOut }}
      src="/images/watercolor/flower-2.png"
      alt=""
      class="pointer-events-none absolute -bottom-6 -left-10 z-90 w-72 object-contain sm:w-56"
      style="transform-origin: bottom left;"
    />
    <img
      in:fly={{ x: 30, y: 30, delay: 600, duration: 900, easing: cubicOut }}
      src="/images/watercolor/flower-3.png"
      alt=""
      class="pointer-events-none absolute -right-6 bottom-30 z-10 w-44 object-contain sm:w-56"
      style="transform-origin: bottom right;"
    />

    <!-- Frame + flower-1 wrapper (centered) -->
    <div class="relative">
      <!-- flower-1 nempel di sudut kiri atas frame -->
      <img
        in:fly={{ x: -30, y: -30, delay: 300, duration: 900, easing: cubicOut }}
        src="/images/watercolor/flower-1.png"
        alt=""
        class="pointer-events-none absolute -top-20 -left-20 z-30 w-60 object-contain sm:-top-14 sm:-left-14 sm:w-48"
        style="transform-origin: top left;"
      />

      <!-- Arch frame — semua konten di dalam, rapi -->
      <div
        in:scale={{ start: 0.92, delay: 200, duration: 1000, easing: cubicOut }}
        class="arch-frame relative z-20 flex flex-col items-center px-6 py-12 sm:px-10 sm:py-16"
      >
        <!-- Nama pengantin — di atas dengan margin bawah -->
        <div class="mt-4 text-center">
          <p class="font-script text-[#1a1a1a]" style={brideNameStyle}>{brideName}</p>
          <p class="my-2 font-script text-3xl leading-none text-[#1a1a1a] sm:text-4xl">&amp;</p>
          <p class="font-script text-[#1a1a1a]" style={groomNameStyle}>{groomName}</p>
        </div>

        <!-- Guest name — di tengah frame -->
        <div in:fade={{ delay: 900, duration: 700 }} class="mt-auto mb-auto text-center">
          <p class="text-[10px] tracking-[0.3em] text-[#8a8a8a] uppercase">Kepada Yth.</p>
          <p
            class="mt-1 font-love text-base tracking-wide text-[#2c2c2c] sm:text-lg"
          >
            {guestName}
          </p>
        </div>

        <!-- Tombol buka undangan — di bawah -->
        <div in:fly={{ y: 12, delay: 1100, duration: 600, easing: cubicOut }} class="mt-auto mb-2">
          <button
            class="text-xs tracking-[0.25em] text-[#2c2c2c] transition-colors duration-300 hover:text-[#c97b8b]"
            on:click={openInvitation}
          >
            <span class="border-b border-[#2c2c2c] pb-0.5 transition-colors hover:border-[#c97b8b]">
              BUKA UNDANGAN
            </span>
          </button>
        </div>
      </div>
    </div>
  </section>
{/if}

<style>
  .garden-cover {
    font-family:
      'Segoe UI',
      system-ui,
      -apple-system,
      sans-serif;
    background-color: #f5f0e8;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  }

  .arch-frame {
    width: 270px;
    height: 520px;
    border: 2px solid #2c2c2c;
    border-radius: 130px 130px 0 0;
    background: transparent;
  }

  @media (min-width: 640px) {
    .arch-frame {
      width: 320px;
      height: 580px;
      border-radius: 160px 160px 0 0;
    }
  }
</style>
