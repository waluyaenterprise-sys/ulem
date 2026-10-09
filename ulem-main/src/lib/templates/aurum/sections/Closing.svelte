<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { onMount } from 'svelte';
  import Credit from '$lib/Credit.svelte';
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const brideName: string = invitation.bride?.name || 'Bride';
  const message: string = invitation.closing?.message || '';
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.25, minRem: 1.1, endAt: 24 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.25, minRem: 1.1, endAt: 24 });

  const rawImages: string[] = invitation.closing?.imageUrls?.length
    ? invitation.closing.imageUrls
    : invitation.gallery?.imageUrls || [];

  const heroImage = rawImages[0] || '';

  let visible = false;
  let sectionEl: HTMLElement;

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionEl) observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<!--
  CLOSING: Full-screen hero photo with names in large script overlay,
  gold particle dots, and "Thank You" text at the top.
-->
<section
  bind:this={sectionEl}
  class="relative flex min-h-svh w-full flex-col items-center justify-end overflow-hidden pb-0"
  style="background:#000;"
>
  <!-- Hero full-bleed image -->
  {#if heroImage}
    <div class="absolute inset-0">
      <img
        src={heroImage}
        alt="Closing"
        class="h-full w-full object-cover transition-all duration-1000"
        style="filter:brightness({visible ? '0.45' : '0.25'}) contrast(1.1);transform:scale({visible
          ? '1'
          : '1.04'});transition:filter 1200ms ease,transform 1200ms ease;"
      />
    </div>
  {:else}
    <div class="absolute inset-0" style="background:#0a0a0a;"></div>
  {/if}

  <!-- Top dark gradient -->
  <div
    class="absolute inset-x-0 top-0 h-40"
    style="background:linear-gradient(to bottom,#000 0%,transparent 100%);"
  ></div>
  <!-- Bottom dark gradient -->
  <div
    class="absolute inset-x-0 bottom-0 h-64"
    style="background:linear-gradient(to top,#000 0%,transparent 100%);"
  ></div>

  {#if visible}
    <!-- Top label -->
    <div
      in:fly={{ y: -20, delay: 100, duration: 700, easing: cubicOut }}
      class="absolute top-12 right-0 left-0 z-10 flex flex-col items-center"
    >
      <p
        class="text-[9px] tracking-[0.5em] uppercase"
        style="color:#c9a84c;font-family:var(--font-heading,sans-serif);"
      >
        Thank You
      </p>
      <div style="width:40px;height:1px;background:#c9a84c;margin-top:10px;opacity:0.6;"></div>
    </div>

    <!-- Gold particle dots — decorative -->
    {#each [{ top: '20%', left: '10%', size: 3, opacity: 0.4, delay: 400 }, { top: '35%', right: '8%', size: 2, opacity: 0.3, delay: 600 }, { top: '55%', left: '15%', size: 2, opacity: 0.25, delay: 800 }, { top: '65%', right: '12%', size: 3, opacity: 0.35, delay: 500 }, { top: '28%', left: '50%', size: 2, opacity: 0.2, delay: 700 }] as dot}
      <div
        in:fade={{ delay: dot.delay, duration: 1000 }}
        class="absolute z-10 rounded-full"
        style="
          top:{dot.top};
          {dot.left ? `left:${dot.left}` : `right:${dot.right}`};
          width:{dot.size}px;height:{dot.size}px;
          background:#c9a84c;
          opacity:{dot.opacity};
          box-shadow: 0 0 6px 2px rgba(201,168,76,0.4);
        "
      ></div>
    {/each}

    <!-- Center names — large script -->
    <div
      in:fade={{ delay: 500, duration: 900 }}
      class="absolute inset-0 z-10 flex flex-col items-center justify-center"
    >
      <!-- Decorative gold diamond above -->
      <div class="mb-6 flex flex-col items-center gap-1">
        <div
          style="width:1px;height:20px;background:linear-gradient(to bottom,transparent,rgba(201,168,76,0.7));"
        ></div>
        <div
          style="width:8px;height:8px;background:#c9a84c;transform:rotate(45deg);opacity:0.8;"
        ></div>
      </div>

      <span
        class="block text-center leading-none"
        style={brideNameStyle + '; font-family:var(--font-script,serif);color:rgba(255,255,255,0.95);text-shadow:0 2px 30px rgba(0,0,0,0.8);'}
        >{brideName}</span
      >
      <span
        class="my-2 block text-center"
        style="font-family:var(--font-script,serif);font-size:2rem;color:#c9a84c;text-shadow:0 2px 20px rgba(0,0,0,0.7);"
        >&amp;</span
      >
      <span
        class="block text-center leading-none"
        style={groomNameStyle + '; font-family:var(--font-script,serif);color:rgba(255,255,255,0.95);text-shadow:0 2px 30px rgba(0,0,0,0.8);'}
        >{groomName}</span
      >

      <!-- Decorative below -->
      <div class="mt-6 flex flex-col items-center gap-1">
        <div
          style="width:8px;height:8px;background:#c9a84c;transform:rotate(45deg);opacity:0.8;"
        ></div>
        <div
          style="width:1px;height:20px;background:linear-gradient(to top,transparent,rgba(201,168,76,0.7));"
        ></div>
      </div>
    </div>

    <!-- Bottom message + credit -->
    <div
      in:fly={{ y: 30, delay: 800, duration: 700, easing: cubicOut }}
      class="relative z-10 flex w-full flex-col items-center px-8 py-14 text-center"
    >
      <p
        class="mx-auto max-w-xs text-xs leading-loose italic"
        style="color:rgba(255,255,255,0.4);font-family:var(--font-heading,sans-serif);"
      >
        {#if message}
          {message}
        {:else}
          Terima kasih telah menjadi bagian dari hari istimewa kami.<br />
          Doa dan kehadiran Anda adalah kebahagiaan terbesar bagi kami.
        {/if}
      </p>
      <div class="mt-8">
        <Credit />
      </div>
    </div>
  {/if}
</section>
