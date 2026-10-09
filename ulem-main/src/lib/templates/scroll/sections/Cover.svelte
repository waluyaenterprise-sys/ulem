<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';

  export let invitation: any;

  const groomName: string = (invitation.groom?.name || 'GROOM').split(' ')[0];
  const brideName: string = (invitation.bride?.name || 'BRIDE').split(' ')[0];
  const guestName: string = invitation.guestName || 'Tamu Undangan';
  const coverImage: string = invitation.cover?.imageUrls?.[0] || '';
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.0, minRem: 1.0, endAt: 18 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.0, minRem: 1.0, endAt: 18 });

  let show = false;
  let unrolled = false;

  onMount(() => {
    show = true;
    setTimeout(() => (unrolled = true), 600);
  });

  const dispatch = createEventDispatcher();

  function openInvitation() {
    dispatch('open');
  }
</script>

{#if show}
  <section
    in:fade={{ duration: 600 }}
    class="scroll-cover relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden"
    style="background: radial-gradient(ellipse at center, #2C1810 0%, #1A0F08 60%, #0D0603 100%);"
  >
    <!-- Ambient dust particles -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      {#each Array(12) as _, i}
        <div
          class="particle absolute rounded-full bg-amber-200/10"
          style="
            width: {2 + (i % 4)}px;
            height: {2 + (i % 4)}px;
            left: {(i * 8.3) % 100}%;
            top: {(i * 13.7) % 100}%;
            animation: drift {6 + (i % 5)}s ease-in-out {i * 0.4}s infinite alternate;
          "
        ></div>
      {/each}
    </div>

    <!-- Scroll container -->
    <div
      class="scroll-wrapper relative mx-auto w-full max-w-sm px-4"
      class:unrolled
      style="perspective: 1200px;"
    >
      <!-- Top roller -->
      <div
        class="roller roller-top"
        in:fly={{ y: -60, duration: 900, delay: 400, easing: cubicOut }}
      ></div>

      <!-- Scroll body -->
      <div
        class="scroll-body overflow-hidden"
        in:fly={{ y: -30, duration: 1000, delay: 500, easing: cubicOut }}
        style="
          background: linear-gradient(160deg, #F5ECD7 0%, #EDE3C8 40%, #E8DCC0 70%, #F0E8D4 100%);
          box-shadow: 0 0 40px rgba(0,0,0,0.6), inset 0 0 30px rgba(139,105,20,0.06);
          border-left: 2px solid rgba(139,105,20,0.25);
          border-right: 2px solid rgba(139,105,20,0.25);
        "
      >
        <!-- Inner parchment pattern -->
        <div
          class="pointer-events-none absolute inset-0 opacity-[0.08]"
          style="
            background-image: repeating-linear-gradient(0deg, transparent, transparent 24px, #8B4513 24px, #8B4513 25px),
                              repeating-linear-gradient(90deg, transparent, transparent 24px, #8B4513 24px, #8B4513 25px);
          "
        ></div>

        <!-- Vignette -->
        <div
          class="pointer-events-none absolute inset-0"
          style="box-shadow: inset 0 0 60px rgba(139,105,20,0.1);"
        ></div>

        <!-- Content -->
        <div class="relative z-10 px-8 py-10 text-center">
          <!-- Stamp / emblem top -->
          <div in:fade={{ delay: 900, duration: 700 }} class="mb-4 flex justify-center">
            <div
              class="emblem flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-700/60"
              style="background: radial-gradient(circle, #B8942E 0%, #8B6914 100%);"
            >
              <svg
                viewBox="0 0 40 40"
                class="h-8 w-8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 4 L22.5 14 L32 14 L24.5 20 L27 30 L20 24.5 L13 30 L15.5 20 L8 14 L17.5 14 Z"
                  fill="#F4E8C1"
                  fill-opacity="0.9"
                />
              </svg>
            </div>
          </div>

          <!-- Decree header -->
          <p
            in:fly={{ y: -12, delay: 1000, duration: 700, easing: cubicOut }}
            class="font-heading text-[10px] tracking-[0.35em] text-[#5C3D1A]/70 uppercase"
          >
            — Surat Undangan Pernikahan —
          </p>

          <!-- Ornament line -->
          <div
            in:fade={{ delay: 1100, duration: 500 }}
            class="my-3 flex items-center justify-center gap-2"
          >
            <div class="h-px w-12 bg-[#8B6914]/30"></div>
            <div class="h-1 w-1 rotate-45 bg-[#8B6914]/40"></div>
            <div class="h-px w-12 bg-[#8B6914]/30"></div>
          </div>

          <!-- The Wedding Of -->
          <p in:fade={{ delay: 1150, duration: 600 }} class="font-script text-xl text-[#3E2A10]/60">
            The Wedding of
          </p>

          <!-- Names -->
          <h1
            in:fly={{ y: 16, delay: 1250, duration: 800, easing: cubicOut }}
            class="mt-2 font-heading text-4xl leading-tight font-bold text-[#3E2A10] italic"
            style={brideNameStyle}
          >
            {brideName}
          </h1>
          <p
            in:fade={{ delay: 1380, duration: 500 }}
            class="my-1 font-script text-2xl text-[#6B4A1E]/70"
          >
            &amp;
          </p>
          <h1
            in:fly={{ y: 16, delay: 1430, duration: 800, easing: cubicOut }}
            class="font-heading text-4xl leading-tight font-bold text-[#3E2A10] italic"
            style={groomNameStyle}
          >
            {groomName}
          </h1>

          <!-- Ornament line -->
          <div
            in:fade={{ delay: 1550, duration: 500 }}
            class="my-4 flex items-center justify-center gap-2"
          >
            <div class="h-px w-8 bg-[#8B6914]/30"></div>
            <div class="h-1.5 w-1.5 rotate-45 bg-[#8B6914]/40"></div>
            <div class="h-px w-8 bg-[#8B6914]/30"></div>
          </div>

          <!-- Guest block -->
          {#if guestName}
            <div
              in:fly={{ y: 12, delay: 1620, duration: 700, easing: cubicOut }}
              class="rounded border border-[#8B6914]/15 bg-[#3E2A10]/5 px-4 py-3 text-center"
            >
              <p class="font-body text-[10px] tracking-widest text-[#5C3D1A]/60 uppercase">
                Kepada Yth.
              </p>
              <p class="mt-1 font-heading text-base font-semibold text-[#3E2A10]">{guestName}</p>
            </div>
          {/if}

          <!-- Cover image -->
          {#if coverImage}
            <div
              in:fade={{ delay: 1700, duration: 800 }}
              class="mt-5 overflow-hidden rounded border-2 border-[#8B6914]/20"
              style="box-shadow: 0 4px 20px rgba(139,69,19,0.3);"
            >
              <img src={coverImage} alt="Cover" class="h-44 w-full object-cover" />
            </div>
          {/if}

          <!-- CTA -->
          <button
            in:fly={{ y: 16, delay: 1850, duration: 700, easing: cubicOut }}
            class="mt-6 w-full rounded border-2 border-[#8B6914]/40 px-6 py-3 font-heading text-sm font-semibold tracking-widest text-[#3E2A10] uppercase transition-all duration-200 active:scale-95"
            style="background: linear-gradient(135deg, #F0E8D4 0%, #E8DCC0 100%); box-shadow: 0 2px 12px rgba(139,105,20,0.12);"
            on:click={openInvitation}
          >
            Buka Undangan
          </button>
        </div>
      </div>

      <!-- Bottom roller -->
      <div
        class="roller roller-bottom"
        in:fly={{ y: 60, duration: 900, delay: 400, easing: cubicOut }}
      ></div>
    </div>
  </section>
{/if}

<style>
  .roller {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 28px;
    border-radius: 9999px;
    background: linear-gradient(
      180deg,
      #5C3D1A 0%,
      #8B6914 40%,
      #B8942E 55%,
      #8B6914 70%,
      #5C3D1A 100%
    );
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.5),
      inset 0 1px 3px rgba(255, 255, 255, 0.3);
  }

  .roller::before {
    content: '';
    position: absolute;
    inset: 4px 20px;
    border-radius: 9999px;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(0, 0, 0, 0.2) 100%
    );
  }

  .roller-top {
    border-radius: 9999px 9999px 4px 4px;
  }

  .roller-bottom {
    border-radius: 4px 4px 9999px 9999px;
  }

  .scroll-body {
    position: relative;
    border-radius: 0;
    min-height: 200px;
  }

  @keyframes drift {
    from {
      transform: translateY(0px) translateX(0px);
      opacity: 0.15;
    }
    to {
      transform: translateY(-20px) translateX(8px);
      opacity: 0.35;
    }
  }
</style>
