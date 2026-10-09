<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';

  export let invitation: any;
  // export let guestName: string = 'Tamu Undangan';

  const groomName: string = invitation.groom?.name || 'Groom';
  const brideName: string = invitation.bride?.name || 'Bride';
  const coverImages: string[] = invitation.cover?.imageUrls || [];
  const tileImage = coverImages[0] || '';
  const guestName: string = invitation.guestName;
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.15, minRem: 1.1, endAt: 24 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.15, minRem: 1.1, endAt: 24 });

  // Each tile: corner + img anchor + object-position to show the correct quadrant
  const tiles = [
    {
      origin: 'top left',
      z: 3,
      wrapper: 'top:0; left:0; width:50%; height:50%; transform: translate(-1px, -1px);'
    },
    {
      origin: 'top right',
      z: 2,
      wrapper: 'top:0; right:0; width:50%; height:50%; transform: translate(0px, 0px);'
    },
    {
      origin: 'bottom left',
      z: 2,
      wrapper: 'bottom:0; left:0; width:50%; height:50%; transform: translate(0px, 0px);'
    },
    {
      origin: 'bottom right',
      z: 4,
      wrapper: 'bottom:0; right:0; width:50%; height:50%; transform: translate(1px, 1px);'
    }
  ];

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
    in:fade={{ duration: 700 }}
    class="flex min-h-svh w-full items-center justify-center bg-white px-6 py-12"
  >
    <div class="flex w-full max-w-sm flex-col items-center text-center">
      <!-- "The Wedding Of" -->
      <p
        in:fly={{ y: -12, delay: 200, duration: 700, easing: cubicOut }}
        class="mb-6 font-heading text-3xl tracking-widest text-[#b0a89a] italic"
      >
        The Wedding Of
      </p>

      <!-- 2×2 mosaic -->
      <div class="relative aspect-square w-full max-w-sm">
        {#each tiles as tile}
          <div
            class="absolute overflow-hidden bg-white"
            style="
        {tile.wrapper};
        z-index: {tile.z};
        box-shadow: 0 25px 50px rgba(0,0,0,0.2);
      "
          >
            <img
              src={tileImage}
              alt="Couple"
              class="absolute h-full w-full object-cover"
              style="
          transform: scale(2);
          transform-origin: {tile.origin};
        "
            />
          </div>
        {/each}
      </div>

      <!-- Names zigzag -->
      <div in:fade={{ delay: 700, duration: 700 }} class="my-7 flex w-full flex-col gap-1">
        <!-- Bride → right aligned -->
        <span class="w-full translate-x-4 pr-12 text-right font-script text-4xl text-[#2c2c2c]" style={brideNameStyle}>
          {brideName}
        </span>
        <!-- Ampersand → center -->
        <span class="w-full text-center font-script text-2xl text-[#c9b49a]">&amp;</span>
        <!-- Groom → left aligned -->
        <span class="w-full -translate-x-4 pl-12 text-left font-script text-4xl text-[#2c2c2c]" style={groomNameStyle}>
          {groomName}
        </span>
      </div>

      <!-- Guest -->
      <div
        in:fly={{ y: 10, delay: 900, duration: 600, easing: cubicOut }}
        class="mb-8 flex flex-col items-center gap-1"
      >
        <p class="font-heading text-xs tracking-wider text-[#a09890]">
          Kepada Yth. Bapak/Ibu/Saudara/i
        </p>
        <p class="font-heading text-base font-semibold tracking-wide text-[#3c3330]">
          {guestName}
        </p>
      </div>

      <!-- CTA -->
      <button
        in:fly={{ y: 14, delay: 1100, duration: 600, easing: cubicOut }}
        class="cursor-pointer rounded-full bg-[#d4b49a] px-10 py-3.5 font-heading text-sm tracking-[0.12em] text-white shadow-[0_4px_18px_rgba(196,156,120,0.30)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#c4a088] hover:shadow-[0_6px_24px_rgba(196,156,120,0.40)] active:translate-y-0"
        on:click={openInvitation}
      >
        Open Invitation
      </button>
    </div>
  </section>
{/if}
