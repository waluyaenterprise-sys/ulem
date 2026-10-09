<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const brideName: string = invitation.bride?.name || 'Bride';
  const quoteImages: string[] = invitation.quote?.imageUrls || [];
  const bgImage = quoteImages[0] || '';
  const coupleImage = quoteImages[1] || quoteImages[0] || '';
  const quoteText: string = invitation.quote?.text || 'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan kami.';
  const quoteSource: string = invitation.quote?.source || '';

  let show = false;
  onMount(() => {
    show = true;
  });
</script>

{#if show}
  <section
    class="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden py-16"
  >
    <!-- Background photo with warm amber overlay -->
    {#if bgImage}
      <div
        class="absolute inset-0"
        style="background-image: url('{bgImage}'); background-size: cover; background-position: center;"
      ></div>
    {:else}
      <div
        class="absolute inset-0"
        style="background: linear-gradient(160deg, #1c0f0a 0%, #3d2210 100%);"
      ></div>
    {/if}
    <!-- warm amber overlay -->
    <div
      class="absolute inset-0"
      style="background: linear-gradient(to bottom, rgba(28,15,10,0.72) 0%, rgba(61,34,16,0.55) 50%, rgba(28,15,10,0.80) 100%);"
    ></div>

    <!-- Warm radial glow top-right -->
    <div
      class="pointer-events-none absolute"
      style="width:320px;height:320px;border-radius:50%;background:radial-gradient(circle, rgba(232,164,90,0.18) 0%, transparent 70%);top:-40px;right:-60px;"
    ></div>

    <!-- Quote glass card -->
    <div
      in:fly={{ y: -20, delay: 200, duration: 800, easing: cubicOut }}
      class="relative z-10 mx-6 w-full max-w-sm rounded-2xl px-8 py-10 text-center"
      style="
        background: rgba(255,200,120,0.08);
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        border: 1px solid rgba(232,164,90,0.22);
        box-shadow: 0 8px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,230,170,0.12);
      "
    >
      <!-- Ornament -->
      <div in:fade={{ delay: 300, duration: 500 }} class="mb-5 flex justify-center">
        <svg
          width="40"
          height="28"
          viewBox="0 0 40 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 24C4 24 8 12 16 8C12 12 10 18 12 24H4Z" fill="rgba(232,164,90,0.5)" />
          <path d="M20 24C20 24 24 12 32 8C28 12 26 18 28 24H20Z" fill="rgba(232,164,90,0.5)" />
        </svg>
      </div>

      <p
        in:fly={{ y: 12, delay: 350, duration: 700, easing: cubicOut }}
        class="mb-4 text-sm leading-[1.9] italic"
        style="color: rgba(255,230,180,0.85); font-family: var(--font-heading, sans-serif);"
      >
        Assalamualaikum Warahmatullahi Wabarakatuh
      </p>

      <div
        in:fade={{ delay: 500, duration: 500 }}
        style="height:1px;background:linear-gradient(to right,transparent,rgba(232,164,90,0.4),transparent);margin:16px 0;"
      ></div>

      <p
        in:fly={{ y: 12, delay: 550, duration: 700, easing: cubicOut }}
        class="text-xs leading-relaxed italic"
        style="color: rgba(255,220,170,0.75); font-family: var(--font-heading, sans-serif);"
      >
        {quoteText}
      </p>
      {#if quoteSource}<p class="mt-4 text-[10px] tracking-[0.25em] uppercase" style="color:rgba(232,164,90,0.72);">{quoteSource}</p>{/if}
    </div>

    <!-- Couple image in warm glass frame -->
    {#if coupleImage}
      <div
        in:fly={{ y: 40, delay: 700, duration: 900, easing: cubicOut }}
        class="relative z-10 mt-10 flex flex-col items-center"
      >
        <div
          class="rounded-2xl p-2 pb-6"
          style="
            background: rgba(255,200,120,0.10);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(232,164,90,0.28);
            box-shadow: 0 12px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,230,170,0.18);
            width: 260px;
          "
        >
          <div class="overflow-hidden rounded-xl" style="height:280px;">
            <img src={coupleImage} alt="Couple" class="h-full w-full object-cover" />
          </div>
          <div
            in:fade={{ delay: 1000, duration: 600 }}
            class="mt-4 flex items-center justify-center gap-2"
          >
            <span
              class="text-xl"
              style="font-family: var(--font-script, serif); color: rgba(255,230,180,0.9);"
              >{brideName.split(' ')[0]}</span
            >
            <span
              class="text-sm"
              style="font-family: var(--font-heading, sans-serif); color: rgba(232,164,90,0.7);"
              >&amp;</span
            >
            <span
              class="text-xl"
              style="font-family: var(--font-script, serif); color: rgba(255,230,180,0.9);"
              >{groomName.split(' ')[0]}</span
            >
          </div>
        </div>
      </div>
    {/if}
  </section>
{/if}
