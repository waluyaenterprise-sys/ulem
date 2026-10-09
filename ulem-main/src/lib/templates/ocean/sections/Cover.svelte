<script lang="ts">
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';
  import { createEventDispatcher, onMount } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import { fly, fade, scale } from 'svelte/transition';

  export let invitation: any;

  const groomName: string = (invitation.groom.name || 'GROOM').split(' ')[0];
  const brideName: string = (invitation.bride.name || 'BRIDE').split(' ')[0];
  const guestName: string = invitation.guestName;
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 1.95, minRem: 1.05, endAt: 18 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 1.95, minRem: 1.05, endAt: 18 });

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
  <!-- BACKGROUND -->
  <section
    in:fade={{ duration: 800 }}
    class="relative flex min-h-svh w-full items-center justify-center bg-cover bg-center bg-no-repeat"
    style="background-image: url('/images/ocean.png');"
  >
    <div
      in:fly={{ y: 40, duration: 900, easing: cubicOut }}
      class="relative mx-4 w-full max-w-72 overflow-visible"
    >
      <!-- WHALE ATAS -->
      <img
        in:fly={{ y: -40, delay: 400, duration: 900, easing: cubicOut }}
        src="/assets/whale.svg"
        alt="Whale"
        class="pointer-events-none absolute -top-90 left-25 z-10 w-[110%] max-w-none -translate-x-1/2 translate-y-1/2"
      />

      <!-- WHALE BAWAH -->
      <img
        in:fly={{ y: 40, delay: 600, duration: 900, easing: cubicOut }}
        src="/assets/whale.svg"
        alt="Whale"
        class="-right pointer-events-none absolute right-28 bottom-25 z-30 w-[140%] max-w-none translate-x-1/2 translate-y-1/2 -scale-x-100 rotate-45 transform"
      />

      <!-- CARD -->
      <div
        in:scale={{ start: 0.92, delay: 200, duration: 800, easing: cubicOut }}
        class="relative z-20 mx-auto flex
					h-150 w-11/12
					flex-col
					items-center justify-center
					rounded-t-[180px]
					border border-[#193D7A]
					bg-white px-6 text-center
					shadow-lg sm:h-140"
      >
        <!-- TITLE -->
        <p in:fade={{ delay: 500 }} class="font-script text-4xl text-gray-600">The Wedding of</p>

        <!-- NAMES -->
        <h1
          in:fly={{ y: 20, delay: 650, duration: 700, easing: cubicOut }}
          class="mt-6 font-jomolhari text-6xl font-semibold tracking-wide"
          style={brideNameStyle}
        >
          {brideName}
        </h1>

        <p in:fade={{ delay: 800 }} class="my-6 font-jomolhari text-5xl">&amp;</p>

        <h1
          in:fly={{ y: 20, delay: 900, duration: 700, easing: cubicOut }}
          class="font-jomolhari text-6xl font-semibold tracking-wide"
          style={groomNameStyle}
        >
          {groomName}
        </h1>

        <!-- GUEST -->
        <p in:fade={{ delay: 1100 }} class="mt-10 text-sm text-gray-600">Dear :</p>

        <p in:fade={{ delay: 1200 }} class="mb-6 font-medium">
          {guestName}
        </p>

        <!-- BUTTON -->
        <button
          in:fly={{ y: 16, delay: 1350, duration: 600, easing: cubicOut }}
          class="mt-4 rounded-full border border-blue-500 px-6 py-3 text-sm font-medium text-blue-600
						transition-colors duration-200
						hover:bg-blue-50 active:bg-blue-100"
          on:click={openInvitation}
        >
          Open Invitation
        </button>
      </div>
    </div>
  </section>
{/if}
