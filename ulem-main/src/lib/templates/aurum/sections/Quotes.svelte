<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const brideName: string = invitation.bride?.name || 'Bride';
  const quoteImages: string[] = invitation.quote?.imageUrls || [];
  const bgImage = quoteImages[0] || '';
  const quoteText: string = invitation.quote?.text || 'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi pernikahan kami.';
  const quoteSource: string = invitation.quote?.source || '';

  let show = false;
  onMount(() => {
    show = true;
  });
</script>

{#if show}
  <!-- Full-screen black with ornate gold corner frame + centered quote -->
  <section
    class="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden px-10"
    style="background:#040404;"
  >
    <!-- Background image faint -->
    {#if bgImage}
      <div
        class="absolute inset-0"
        style="background-image:url('{bgImage}');background-size:cover;background-position:center;opacity:0.18;filter:grayscale(60%);"
      ></div>
    {/if}
    <div
      class="absolute inset-0"
      style="background:linear-gradient(to bottom,#040404 0%,rgba(4,4,4,0.7) 50%,#040404 100%);"
    ></div>

    <!-- Ornate corner frames (SVG) -->
    <div class="corner-tl absolute top-6 left-6">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M2 58V2H58" stroke="#c9a84c" stroke-width="1" stroke-opacity="0.7" />
        <path d="M2 30V2H30" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.4" />
        <circle cx="2" cy="2" r="3" fill="#c9a84c" fill-opacity="0.6" />
      </svg>
    </div>
    <div class="absolute top-6 right-6" style="transform:scaleX(-1);">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M2 58V2H58" stroke="#c9a84c" stroke-width="1" stroke-opacity="0.7" />
        <path d="M2 30V2H30" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.4" />
        <circle cx="2" cy="2" r="3" fill="#c9a84c" fill-opacity="0.6" />
      </svg>
    </div>
    <div class="absolute bottom-6 left-6" style="transform:scaleY(-1);">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M2 58V2H58" stroke="#c9a84c" stroke-width="1" stroke-opacity="0.7" />
        <path d="M2 30V2H30" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.4" />
        <circle cx="2" cy="2" r="3" fill="#c9a84c" fill-opacity="0.6" />
      </svg>
    </div>
    <div class="absolute right-6 bottom-6" style="transform:scale(-1);">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M2 58V2H58" stroke="#c9a84c" stroke-width="1" stroke-opacity="0.7" />
        <path d="M2 30V2H30" stroke="#c9a84c" stroke-width="0.5" stroke-opacity="0.4" />
        <circle cx="2" cy="2" r="3" fill="#c9a84c" fill-opacity="0.6" />
      </svg>
    </div>

    <!-- Center content -->
    <div class="relative z-10 flex max-w-xs flex-col items-center text-center">
      <!-- Gold diamond ornament -->
      <div in:fade={{ delay: 200, duration: 600 }} class="mb-8 flex flex-col items-center gap-1">
        <div
          style="width:1px;height:30px;background:linear-gradient(to bottom,transparent,#c9a84c);"
        ></div>
        <div style="width:10px;height:10px;background:#c9a84c;transform:rotate(45deg);"></div>
        <div
          style="width:1px;height:30px;background:linear-gradient(to top,transparent,#c9a84c);"
        ></div>
      </div>

      <!-- Arabic/Greeting -->
      <p
        in:fly={{ y: -12, delay: 300, duration: 700, easing: cubicOut }}
        class="mb-6 text-base leading-relaxed italic"
        style="color:rgba(255,255,255,0.7);font-family:var(--font-heading,sans-serif);"
      >
        Assalamualaikum Warahmatullahi Wabarakatuh
      </p>

      <!-- Gold rule -->
      <div
        in:fade={{ delay: 450, duration: 500 }}
        style="width:60px;height:1px;background:#c9a84c;margin-bottom:24px;opacity:0.7;"
      ></div>

      <!-- Main quote -->
      <p
        in:fly={{ y: 16, delay: 500, duration: 700, easing: cubicOut }}
        class="text-sm leading-loose italic"
        style="color:rgba(255,255,255,0.65);font-family:var(--font-heading,sans-serif);"
      >
        {quoteText}
      </p>
      {#if quoteSource}<p class="mt-4 text-[10px] tracking-[0.3em] uppercase" style="color:rgba(201,168,76,0.65);">{quoteSource}</p>{/if}

      <!-- Divider diamond -->
      <div in:fade={{ delay: 700, duration: 500 }} class="my-8 flex items-center gap-3">
        <div style="width:40px;height:1px;background:#c9a84c;opacity:0.5;"></div>
        <div
          style="width:6px;height:6px;background:#c9a84c;transform:rotate(45deg);opacity:0.8;"
        ></div>
        <div style="width:40px;height:1px;background:#c9a84c;opacity:0.5;"></div>
      </div>

      <!-- Couple names -->
      <div in:fly={{ y: 16, delay: 800, duration: 700, easing: cubicOut }}>
        <span
          class="block leading-none text-3xl"
          style="font-family:var(--font-script,serif);color:#fff;">{brideName}</span
        >
        <span
          class="my-2 block text-2xl"
          style="font-family:var(--font-script,serif);color:#c9a84c;">&amp;</span
        >
        <span
          class="block leading-none text-3xl"
          style="font-family:var(--font-script,serif);color:#fff;">{groomName}</span
        >
      </div>
    </div>
  </section>
{/if}
