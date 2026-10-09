<script lang="ts">
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const brideName: string = invitation.bride?.name || 'Bride';
  const quoteImages: string[] = invitation.quote?.imageUrls || [];
  const bgImage = quoteImages[0] || '';
  const polaroidImage = quoteImages[1] || quoteImages[0] || '';
  const quoteText: string = invitation.quote?.text || 'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan kami.';
  const quoteSource: string = invitation.quote?.source || '';
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 1.9, minRem: 1.0, endAt: 20 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 1.9, minRem: 1.0, endAt: 20 });

  let show = false;
  onMount(() => {
    show = true;
  });
</script>

{#if show}
  <section
    class="relative flex min-h-svh w-full flex-col items-center justify-between overflow-hidden py-16"
    style="background-image: url('{bgImage}'); background-size: cover; background-position: center;"
  >
    <!-- Dark overlay -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- Top text block -->
    <div class="relative z-10 flex flex-col items-center px-8 pt-4 text-center">
      <p
        in:fly={{ y: -16, delay: 200, duration: 700, easing: cubicOut }}
        class="mb-6 font-heading text-xl tracking-widest text-white/80 italic"
      >
        Assalamualaikum Warahmatullahi Wabarakatuh
      </p>

      <div
        in:fade={{ delay: 400, duration: 700 }}
        class="mx-auto w-10 border-t border-white/50"
      ></div>

      <p
        in:fly={{ y: 16, delay: 500, duration: 700, easing: cubicOut }}
        class="mx-auto mt-6 max-w-xs font-heading text-sm leading-relaxed text-white/90 italic"
      >
        {quoteText}
      </p>
      {#if quoteSource}<p class="mt-3 text-center font-body text-xs tracking-wide text-white/60 italic">{quoteSource}</p>{/if}

      <!-- <p
        in:fade={{ delay: 700, duration: 600 }}
        class="mt-3 text-center font-body text-xs tracking-wide text-white/60 italic"
      >
        (QS. Ar-Rum: 21)
      </p> -->
    </div>

    <!-- Polaroid in the middle-bottom -->
    <div
      in:fly={{ y: 40, delay: 600, duration: 900, easing: cubicOut }}
      class="relative z-10 mb-4 flex flex-col items-center"
    >
      <!-- Polaroid frame -->
      <div
        class="flex flex-col items-center bg-white p-3 pb-4 shadow-2xl"
        style="transform: rotate(-2deg); width: 270px;"
      >
        <div class="h-72 w-full overflow-hidden bg-gray-200">
          <img src={polaroidImage} alt="Couple" class="h-full w-full object-cover" />
        </div>

        <!-- Names inside polaroid white space -->
        <div
          in:fade={{ delay: 900, duration: 700 }}
          class="mt-3 flex w-full items-center justify-center gap-2"
        >
          <span class="font-script text-xl text-gray-800" style={brideNameStyle}>{brideName.split(' ')[0]}</span>
          <span class="font-heading text-xs text-gray-400">&amp;</span>
          <span class="font-script text-xl text-gray-800" style={groomNameStyle}>{groomName.split(' ')[0]}</span>
        </div>
      </div>
    </div>
  </section>
{/if}
