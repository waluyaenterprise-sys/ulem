<script lang="ts">
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';
  import { fly, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { createEventDispatcher, onMount } from 'svelte';

  export let invitation: any;

  const brideName = (invitation.bride.name || 'BRIDE').split(' ')[0];
  const groomName = (invitation.groom.name || 'GROOM').split(' ')[0];
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 1.9, minRem: 1.2, endAt: 18 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 1.9, minRem: 1.2, endAt: 18 });
  const coverImages: string[] = invitation.cover.imageUrls || [];
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
    in:fly={{ y: 24, duration: 900, easing: cubicOut }}
    class="flex min-h-dvh w-full flex-col items-center justify-between bg-[#f0f1ec] px-4 py-6"
  >
    <!-- Bagian Atas: Judul, Foto, Nama -->
    <div class="flex w-full max-w-md flex-col items-center text-center">
      <!-- TITLE -->
      <div in:fade={{ delay: 150, duration: 600 }} class="pt-2">
        <p class="font-body text-xs tracking-[0.3em] text-gray-600">THE</p>
        <h1 class="my-2 font-heading text-4xl tracking-wide text-gray-900 sm:text-5xl">WEDDING</h1>
        <p class="font-body text-xs tracking-[0.3em] text-gray-600">OF</p>
      </div>

      <!-- IMAGES -->
      <div class="relative flex w-full justify-center overflow-visible py-6">
        <div
          in:fly={{ y: 30, delay: 300, duration: 800, easing: cubicOut }}
          class="relative flex items-center justify-center gap-0 px-6 md:gap-2"
          style="max-width: 90vw;"
        >
          <!-- Foto kiri (terpotong kiri) -->
          <div class="relative -ml-8 h-48 w-32 sm:-ml-12 sm:h-64 sm:w-40">
            <img
              src={coverImages[0]}
              class="h-full w-full scale-90 rounded-2xl object-cover opacity-50"
              alt="Bride"
            />
          </div>

          <!-- Foto tengah (utama) -->
          <div class="relative z-10 h-60 w-40 sm:h-72 sm:w-48">
            <img
              src={coverImages[1]}
              class="h-full w-full rounded-2xl object-cover shadow-lg"
              alt="Couple"
            />
          </div>

          <!-- Foto kanan (terpotong kanan) -->
          <div class="relative -mr-8 h-48 w-32 sm:-mr-12 sm:h-64 sm:w-40">
            <img
              src={coverImages[2]}
              class="h-full w-full scale-90 rounded-2xl object-cover opacity-50"
              alt="Groom"
            />
          </div>
        </div>
      </div>

      <!-- NAMES -->
      <div
        in:fade={{ delay: 550, duration: 700 }}
        class="mb-4 font-script text-2xl tracking-widest text-gray-900 sm:text-3xl"
      >
        <p style={brideNameStyle}>{brideName}</p>
        <p class="my-1">&amp;</p>
        <p style={groomNameStyle}>{groomName}</p>
      </div>

      <!-- GUEST -->
      <div in:fade={{ delay: 750, duration: 600 }} class="mt-2">
        <p class="font-body text-xs tracking-widest text-gray-600">DEAR</p>
        <p class="font-heading text-lg font-semibold text-gray-900 sm:text-xl">{guestName}</p>
      </div>
    </div>

    <!-- BUTTON (selalu di bawah, tapi tetap di dalam viewport) -->
    <div in:fly={{ y: 20, delay: 900, duration: 600, easing: cubicOut }} class="w-full max-w-xs">
      <button
        class="w-full rounded-full bg-[#2e5e4e] px-6 py-3 font-body text-sm tracking-wide text-white transition hover:bg-[#244c3f]"
        on:click={openInvitation}
      >
        Open Invitation
      </button>
    </div>
  </section>
{/if}
