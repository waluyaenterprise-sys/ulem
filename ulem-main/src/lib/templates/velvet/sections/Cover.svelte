<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const brideName: string = invitation.bride?.name || 'Bride';
  const coverImages: string[] = invitation.cover?.imageUrls || [];
  const bgImage = coverImages[0] || '';
  const guestName: string = invitation.guestName || 'Tamu Undangan';

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
    in:fade={{ duration: 800 }}
    class="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden"
    style="background: linear-gradient(160deg, #1c0f0a 0%, #2d1a0e 40%, #3d2210 70%, #1c0f0a 100%);"
  >
    <!-- Background image with warm overlay -->
    {#if bgImage}
      <div
        class="absolute inset-0"
        style="background-image: url('{bgImage}'); background-size: cover; background-position: center;"
      ></div>
      <div
        class="absolute inset-0"
        style="background: linear-gradient(160deg, rgba(28,15,10,0.82) 0%, rgba(45,26,14,0.75) 40%, rgba(61,34,16,0.78) 70%, rgba(28,15,10,0.88) 100%);"
      ></div>
    {/if}

    <!-- Warm glow orbs -->
    <div
      class="pointer-events-none absolute"
      style="width:400px;height:400px;border-radius:50%;background:radial-gradient(circle, rgba(232,164,90,0.12) 0%, transparent 70%);top:-60px;right:-80px;"
    ></div>
    <div
      class="pointer-events-none absolute"
      style="width:350px;height:350px;border-radius:50%;background:radial-gradient(circle, rgba(212,119,74,0.10) 0%, transparent 70%);bottom:40px;left:-60px;"
    ></div>

    <!-- Glass card -->
    <div
      in:fly={{ y: 30, delay: 300, duration: 900, easing: cubicOut }}
      class="relative z-10 mx-6 flex w-full max-w-sm flex-col items-center rounded-3xl px-8 py-12 text-center"
      style="
        background: rgba(255, 200, 130, 0.07);
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        border: 1px solid rgba(232, 164, 90, 0.25);
        box-shadow: 0 8px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,220,160,0.15);
      "
    >
      <!-- Top ornament -->
      <div in:fade={{ delay: 500, duration: 600 }} class="mb-5 flex items-center gap-3">
        <div
          style="width:30px;height:1px;background:linear-gradient(to right,transparent,rgba(232,164,90,0.7));"
        ></div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 1L9.5 6.5H15L10.5 9.5L12 15L8 11.5L4 15L5.5 9.5L1 6.5H6.5L8 1Z"
            fill="rgba(232,164,90,0.8)"
          />
        </svg>
        <div
          style="width:30px;height:1px;background:linear-gradient(to left,transparent,rgba(232,164,90,0.7));"
        ></div>
      </div>

      <!-- Header text -->
      <p
        in:fly={{ y: -10, delay: 400, duration: 700, easing: cubicOut }}
        class="mb-7 text-xs tracking-[0.35em] uppercase"
        style="color: rgba(232,164,90,0.75); font-family: var(--font-heading, sans-serif);"
      >
        The Wedding Of
      </p>

      <!-- Names -->
      <div in:fade={{ delay: 600, duration: 700 }} class="flex w-full flex-col items-center">
        <span
          class="block text-5xl"
          style="font-family: var(--font-script, serif); color: rgba(255,240,210,0.95);"
          >{brideName}</span
        >
        <div class="my-3 flex items-center gap-3">
          <div style="width:40px;height:1px;background:rgba(232,164,90,0.4);"></div>
          <span
            class="text-lg"
            style="font-family: var(--font-script, serif); color: rgba(232,164,90,0.85);"
            >&amp;</span
          >
          <div style="width:40px;height:1px;background:rgba(232,164,90,0.4);"></div>
        </div>
        <span
          class="block text-5xl"
          style="font-family: var(--font-script, serif); color: rgba(255,240,210,0.95);"
          >{groomName}</span
        >
      </div>

      <!-- Divider -->
      <div
        in:fade={{ delay: 800, duration: 600 }}
        class="my-8 w-full"
        style="height:1px;background:linear-gradient(to right,transparent,rgba(232,164,90,0.35),transparent);"
      ></div>

      <!-- Guest label -->
      <div
        in:fly={{ y: 10, delay: 900, duration: 600, easing: cubicOut }}
        class="mb-8 flex flex-col items-center gap-1"
      >
        <p
          class="text-[10px] tracking-[0.25em] uppercase"
          style="color: rgba(232,164,90,0.65); font-family: var(--font-heading, sans-serif);"
        >
          Kepada Yth.
        </p>
        <p
          class="text-sm font-semibold tracking-wide"
          style="color: rgba(255,230,190,0.9); font-family: var(--font-heading, sans-serif);"
        >
          {guestName}
        </p>
      </div>

      <!-- CTA Button -->
      <button
        in:fly={{ y: 14, delay: 1100, duration: 600, easing: cubicOut }}
        on:click={openInvitation}
        class="cursor-pointer rounded-full px-10 py-3.5 text-sm tracking-[0.15em] uppercase transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
        style="
          font-family: var(--font-heading, sans-serif);
          background: linear-gradient(135deg, rgba(232,164,90,0.9), rgba(212,119,74,0.85));
          color: rgba(28,15,10,0.95);
          font-weight: 600;
          box-shadow: 0 4px 24px rgba(232,164,90,0.3), inset 0 1px 0 rgba(255,240,200,0.3);
          border: none;
        "
      >
        Buka Undangan
      </button>
    </div>
  </section>
{/if}
