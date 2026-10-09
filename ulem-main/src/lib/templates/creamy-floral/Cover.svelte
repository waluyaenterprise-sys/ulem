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
  const coverImage: string = invitation.cover?.imageUrls?.[0] ?? '';

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
    class="rustic-cover relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden"
  >
    <!-- Corner decorations (relative to viewport) -->
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
      <!-- Twine bow di puncak arch -->
      <svg
        in:scale={{ start: 0.6, delay: 800, duration: 600, easing: cubicOut }}
        class="pointer-events-none absolute -top-4 left-1/2 z-30 h-8 w-16 -translate-x-1/2 text-[#8b6f4e]"
        viewBox="0 0 64 32"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M32 16 C22 4, 8 6, 12 15 C8 24, 22 28, 32 16 Z" />
        <path d="M32 16 C42 4, 56 6, 52 15 C56 24, 42 28, 32 16 Z" />
        <circle cx="32" cy="16" r="3.5" fill="currentColor" stroke="none" />
        <path d="M29 19 L25 30 M35 19 L39 30" stroke-dasharray="3 3" stroke-width="1.5" />
      </svg>

      <!-- Arch frame — rustic wood + garis maroon tipis -->
      <div
        in:scale={{ start: 0.92, delay: 200, duration: 1000, easing: cubicOut }}
        class:has-cover={coverImage}
        class="arch-frame relative z-20 flex flex-col items-center px-6 py-12 sm:px-10 sm:py-16"
      >
        <!-- Nama pengantin — di atas dengan margin bawah -->
        {#if coverImage}
          <div class="cover-frame-media">
            <img
              class="cover-frame-image"
              src={coverImage}
              alt={`Foto ${brideName} dan ${groomName}`}
            />
            <div class="cover-frame-overlay"></div>
          </div>
        {/if}

        <!-- Dekorasi di atas foto, tetapi di bawah teks dan tombol -->
        <img
          in:fly={{ x: -30, y: -30, delay: 300, duration: 900, easing: cubicOut }}
          src="/images/watercolor/flower-1.png"
          alt=""
          class="cover-frame-flower pointer-events-none w-60 object-contain sm:w-48"
          style="transform-origin: top left;"
        />

        <div class="cover-names relative z-10 mt-4 text-center">
          <p class="font-script text-[#1a1a1a]" style={brideNameStyle}>{brideName}</p>
          <p class="my-2 font-script text-3xl leading-none text-[#6b1f1f] sm:text-4xl">&amp;</p>
          <p class="font-script text-[#1a1a1a]" style={groomNameStyle}>{groomName}</p>
        </div>

        <!-- Guest name — di tengah frame -->
        <div in:fade={{ delay: 900, duration: 700 }} class="cover-guest relative z-10 mt-auto mb-auto text-center">
          <p class="text-[10px] tracking-[0.3em] text-[#8a8a8a] uppercase">Kepada Yth.</p>
          <p class="mt-1 font-love text-base tracking-wide text-[#2c2c2c] sm:text-lg">
            {guestName}
          </p>
        </div>

        <!-- Tombol buka undangan — pill kayu, hover maroon -->
      </div>
      <div class:has-cover={coverImage} in:fly={{ y: 12, delay: 1100, duration: 600, easing: cubicOut }} class="cover-open-action">
          <button
            class="cover-open-button rounded-full border border-[#8b6f4e]/70 px-6 py-2 text-xs tracking-[0.25em] text-[#5d4a35] transition-colors duration-300 hover:border-[#6b1f1f] hover:bg-[#6b1f1f] hover:text-white"
            on:click={openInvitation}
          >
            BUKA UNDANGAN
          </button>
      </div>
    </div>
  </section>
{/if}

<style>
  .rustic-cover {
    font-family:
      'Segoe UI',
      system-ui,
      -apple-system,
      sans-serif;
    background-color: #faf7f2;
    background-image:
      url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"),
      repeating-linear-gradient(0deg, rgba(139, 111, 78, 0.03) 0 1px, transparent 1px 3px),
      repeating-linear-gradient(90deg, rgba(139, 111, 78, 0.03) 0 1px, transparent 1px 3px);
  }

  .arch-frame {
    width: 280px;
    height: 530px;
    overflow: visible;
    border: 3px solid #8b6f4e;
    border-radius: 140px 140px 0 0;
    background: rgba(253, 251, 247, 0.55);
    box-shadow:
      inset 0 0 0 5px rgba(250, 247, 242, 0.9),
      inset 0 0 0 6px rgba(107, 31, 31, 0.4),
      0 10px 28px rgba(93, 74, 53, 0.18);
  }

  .arch-frame::after {
    position: absolute;
    z-index: 20;
    inset: 8px;
    pointer-events: none;
    border: 1px solid rgba(107, 31, 31, 0.75);
    border-radius: 132px 132px 0 0;
    content: '';
  }

  .cover-frame-image,
  .cover-frame-overlay {
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }

  .cover-frame-media {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: inherit;
  }

  .cover-frame-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .cover-frame-overlay {
    background: linear-gradient(180deg, rgb(255 251 247 / 24%), rgb(41 24 16 / 56%));
  }

  .cover-frame-flower {
    position: absolute;
    z-index: 25;
    top: -5rem;
    left: -5rem;
  }

  .arch-frame .cover-names,
  .arch-frame .cover-guest,
  .arch-frame > div:last-child {
    z-index: 30;
  }

  .cover-open-button {
    position: relative;
    z-index: 40;
    min-width: 11rem;
    padding-top: 0.4rem;
    padding-bottom: 0.4rem;
    font-size: 0.68rem;
  }

  .cover-open-action {
    position: absolute;
    z-index: 100;
    bottom: 3.5rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .arch-frame.has-cover .cover-names p,
  .arch-frame.has-cover .cover-guest p {
    color: #fffaf5;
    text-shadow: 0 2px 10px rgb(0 0 0 / 72%);
  }

  .arch-frame.has-cover .cover-names p:nth-child(2) {
    color: #f5d59d;
  }

  .cover-open-action.has-cover .cover-open-button {
    border-color: rgb(255 250 245 / 75%);
    background: rgb(20 12 8 / 35%);
    color: #fffaf5;
    box-shadow: 0 3px 12px rgb(0 0 0 / 28%);
    backdrop-filter: blur(3px);
  }

  .cover-open-action.has-cover .cover-open-button:hover {
    border-color: #fffaf5;
    background: #fffaf5;
    color: #6b1f1f;
  }

  @media (min-width: 640px) {
    .arch-frame {
      width: 330px;
      height: 590px;
      border-radius: 165px 165px 0 0;
    }

    .cover-open-action {
      bottom: 4.5rem;
    }

    .arch-frame::after {
      border-radius: 157px 157px 0 0;
    }

  }
</style>
