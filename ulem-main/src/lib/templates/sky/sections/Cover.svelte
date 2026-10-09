<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import { fly, fade, scale } from 'svelte/transition';

  export let invitation: any;

  const groomName: string = (invitation.groom.name || 'GROOM').split(' ')[0];
  const brideName: string = (invitation.bride.name || 'BRIDE').split(' ')[0];
  const guestName: string = invitation.guestName;

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
    style="background-image: url('/images/sky/blue-sky.png');"
  >
    <img src="/assets/sky/cloud.svg" alt="" class="absolute -top-35 -right-25 -rotate-12" />
    <img src="/assets/sky/cloud.svg" alt="" class="absolute -top-15 -right-10 rotate-180" />

    <img src="/assets/sky/cloud.svg" alt="" class="absolute bottom-0 -left-30" />
    <img src="/assets/sky/cloud.svg" alt="" class="absolute -right-30 -bottom-25" />

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
					overflow-hidden
					rounded-[60px] border
					border-[#193D7A] bg-white px-6 text-center shadow-lg sm:h-140"
      >
        <img
          src="/assets/sky/cloud.svg"
          alt=""
          class="absolute -top-27 -right-5 -z-10 rotate-180"
        />
        <img src="/assets/sky/cloud.svg" alt="" class="absolute bottom-0 -left-30 -z-10" />

        <!-- TITLE -->
        <p in:fade={{ delay: 500 }} class="font-script text-4xl text-[#2F82C8]">The Wedding of</p>

        <!-- NAMES -->
        <h1
          in:fly={{ y: 20, delay: 650, duration: 700, easing: cubicOut }}
          class="mt-6 font-jomolhari text-6xl font-semibold tracking-wide"
        >
          {brideName}
        </h1>

        <p in:fade={{ delay: 800 }} class="my-6 font-jomolhari text-5xl">&amp;</p>

        <h1
          in:fly={{ y: 20, delay: 900, duration: 700, easing: cubicOut }}
          class="font-jomolhari text-6xl font-semibold tracking-wide"
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
