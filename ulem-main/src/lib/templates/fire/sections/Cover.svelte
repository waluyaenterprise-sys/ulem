<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import { fly, fade, scale } from 'svelte/transition';
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';

  export let invitation: any;

  const groomName: string = (invitation.groom.name || 'GROOM').split(' ')[0];
  const brideName: string = (invitation.bride.name || 'BRIDE').split(' ')[0];
  const guestName: string = invitation.guestName;
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.0, minRem: 1.05, endAt: 18 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.0, minRem: 1.05, endAt: 18 });

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
    class="relative flex min-h-svh w-full items-center bg-cover bg-center bg-no-repeat"
    style="background-image: url('/images/flowers.png');"
  >
    <div
      in:fly={{ y: 40, duration: 900, easing: cubicOut }}
      class="relative w-full max-w-72 overflow-visible"
    >
      <!-- CARD -->
      <div
        in:scale={{ start: 0.92, delay: 200, duration: 800, easing: cubicOut }}
        class="relative z-20 flex
					h-150 w-11/12
					flex-col
					items-center justify-center
					border border-[#193D7A]
					bg-white text-center
					shadow-lg sm:h-140"
      >
        <!-- TITLE -->
        <p in:fade={{ delay: 500 }} class="font-script text-4xl text-[#D50707]">The Wedding of</p>

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
          class="mt-4 rounded-full border border-[#D50707] px-6 py-3 text-sm font-medium text-[#D50707]
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
