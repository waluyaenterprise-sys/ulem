<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import { fly, fade } from 'svelte/transition';

  export let invitation: any;

  const groomName: string = (invitation.groom.name || 'GROOM').split(' ')[0];
  const brideName: string = (invitation.bride.name || 'BRIDE').split(' ')[0];
  const coverUrls: string[] = invitation.cover?.imageUrls || invitation.cover?.images || [];
  const coverImage = coverUrls[0] || '';
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
  <!-- BACKGROUND FULL HEIGHT -->
  <section
    in:fade={{ duration: 800 }}
    class="relative flex min-h-svh w-full items-center justify-center bg-cover bg-center bg-no-repeat"
    style={coverImage ? `background-image: url(${encodeURI(coverImage)});` : ''}
  >
    <!-- OVERLAY -->
    <div class="absolute inset-0 bg-black/40"></div>

    <!-- CONTENT -->
    <div
      in:fly={{ y: 40, duration: 900, easing: cubicOut }}
      class="relative z-10 flex flex-col items-center justify-center px-6 pt-44 text-center text-white"
    >
      <!-- TITLE -->
      <p in:fade={{ delay: 400, duration: 700 }} class="font-script text-5xl">The Wedding Of</p>

      <!-- NAMES (zigzag) -->
      <h1
        in:fly={{ x: -60, delay: 600, duration: 700, easing: cubicOut }}
        class="mt-6 w-full -translate-x-6 text-left font-jomolhari text-6xl tracking-wide"
      >
        {brideName}
      </h1>

      <p
        in:fade={{ delay: 750, duration: 600 }}
        class=" w-full text-center font-jomolhari text-4xl"
      >
        &amp;
      </p>

      <h1
        in:fly={{ x: 60, delay: 900, duration: 700, easing: cubicOut }}
        class="w-full translate-x-6 text-right font-jomolhari text-6xl tracking-wide"
      >
        {groomName}
      </h1>

      <!-- DIVIDER -->
      <div in:fade={{ delay: 1050, duration: 600 }} class="my-3 h-px w-24 bg-[#F0A269]/70"></div>

      <!-- GUEST -->
      <p in:fade={{ delay: 1100, duration: 600 }} class="text-sm text-white/80">Kepada Yth.</p>
      <p in:fade={{ delay: 1200, duration: 600 }} class="text-sm text-white/80">
        Bapak/Ibu/Saudara/i
      </p>
      <p
        in:fly={{ y: 10, delay: 1300, duration: 600, easing: cubicOut }}
        class="mt-1 text-base font-medium"
      >
        {guestName}
      </p>

      <!-- BUTTON -->
      <button
        in:fly={{ y: 16, delay: 1500, duration: 600, easing: cubicOut }}
        class="mt-5 rounded-full border border-[#F0A269] px-8 py-3 text-sm font-medium text-[#F0A269]
          backdrop-blur-sm transition-colors duration-200
          hover:bg-[#F0A269]/20 active:bg-[#F0A269]/30"
        on:click={openInvitation}
      >
        Open Invitation
      </button>
    </div>
  </section>
{/if}
