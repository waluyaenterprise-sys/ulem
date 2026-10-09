<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import { fly, fade, scale } from 'svelte/transition';
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';

  export let invitation: any;

  const brideName = (invitation.bride.name || 'BRIDE').split(' ')[0];
  const groomName = (invitation.groom.name || 'GROOM').split(' ')[0];
  const coverImages: string[] = invitation.cover.imageUrls || [];
  const guestName: string = invitation.guestName;
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.1, minRem: 1.05, endAt: 18 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.1, minRem: 1.05, endAt: 18 });

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
    style="background-image: url('/images/earth/earth.png');"
  >
    <img src="/assets/earth/mountain-traveller.svg" alt="" class="absolute -top-10 left-0" />
    <img
      src="/assets/earth/mountain-house.svg"
      alt=""
      class="absolute right-5 -bottom-10 scale-110"
    />
    <div
      in:fly={{ y: 40, duration: 900, easing: cubicOut }}
      class="relative mx-4 w-full max-w-72 overflow-visible"
    >
      <!-- CARD -->
      <div
        in:scale={{ start: 0.92, delay: 200, duration: 800, easing: cubicOut }}
        class="relative z-20 mx-auto flex
					h-140 w-11/12
					flex-col
					items-center justify-center
					rounded-[60px]
					border border-[#193D7A]
					 bg-cover bg-center
					bg-no-repeat px-6 text-center text-white shadow-lg sm:h-140"
        style={`background-image: url(${coverImages[0] || '/images/earth/cover-bg.png'});`}
      >
        <!-- TITLE -->
        <p in:fade={{ delay: 500 }} class="font-script text-4xl text-[#0A5D0A]">The Wedding of</p>

        <!-- NAMES -->
        <h1
          in:fly={{ y: 20, delay: 650, duration: 700, easing: cubicOut }}
          class="mt-6 font-jomolhari text-4xl font-semibold tracking-wide"
        >
          {brideName}
        </h1>

        <p in:fade={{ delay: 800 }} class="my-6 font-jomolhari text-5xl">&amp;</p>

        <h1
          in:fly={{ y: 20, delay: 900, duration: 700, easing: cubicOut }}
          class="font-jomolhari text-4xl font-semibold tracking-wide"
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
          class="mt-4 rounded-full border border-[#0A5D0A] px-6 py-3 text-sm font-medium text-[#0A5D0A]
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
