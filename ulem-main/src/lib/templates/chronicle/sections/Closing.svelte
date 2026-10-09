<script lang="ts">
  import Credit from '$lib/Credit.svelte';
  import { onMount } from 'svelte';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const brideName: string = invitation.bride?.name || 'Bride';
  const closingImage: string =
    invitation.closing?.imageUrls?.[0] || invitation.cover?.imageUrls?.[0] || '';
  const closingMessage: string = invitation.closing?.message || '';

  let el: HTMLElement;
  let visible = false;

  onMount(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          visible = true;
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  });

  function s(delayMs: number) {
    return `animation: closingFadeUp 0.6s cubic-bezier(0.33,1,0.68,1) ${delayMs}ms both;`;
  }
</script>

<section
  bind:this={el}
  class="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-20"
  style="background:#0d1829;"
>
  <!-- Background photo -->
  {#if closingImage}
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <img
        src={closingImage}
        alt=""
        class="h-full w-full object-cover"
        style="opacity:0.12;filter:grayscale(0.8) brightness(0.5);"
      />
      <div
        class="absolute inset-0"
        style="background:linear-gradient(to bottom,#0d1829 0%,rgba(13,24,41,0.85) 50%,#0d1829 100%);"
      ></div>
    </div>
  {/if}

  <!-- Top progress bar -->
  <div class="absolute top-0 right-0 left-0 h-1" style="background:linear-gradient(to right,#2c3e6b,#c4754a);" aria-hidden="true"></div>

  {#if visible}
    <div class="relative z-10 w-full max-w-xs">
      <!-- Chapter header -->
      <div style={s(0)} class="mb-8 flex items-center gap-3">
        <div style="width:3px;height:32px;background:#c4754a;flex-shrink:0;"></div>
        <div>
          <p
            class="text-xs tracking-[0.55em] uppercase"
            style="color:#c4754a;font-family:var(--font-heading,sans-serif);"
          >
            Chapter 08
          </p>
          <p
            class="text-lg font-bold"
            style="color:#f0f4ff;font-family:var(--font-heading,sans-serif);letter-spacing:-0.02em;"
          >
            Terima Kasih
          </p>
        </div>
      </div>

      <!-- Names display -->
      <div style={s(200)} class="mb-8">
        <p
          class="leading-none"
          style="font-size:clamp(2.2rem,9vw,3.2rem);font-family:var(--font-script,cursive);color:#f0f4ff;"
        >
          {groomName}
        </p>
        <div class="my-3 flex items-center gap-3">
          <div
            style="width:28px;height:2px;background:linear-gradient(to right,#2c3e6b,#c4754a);"
          ></div>
          <span
            class="text-xs tracking-[0.6em]"
            style="color:#c4754a;font-family:var(--font-heading,sans-serif);">&amp;</span
          >
          <div
            style="width:28px;height:2px;background:linear-gradient(to left,#2c3e6b,#c4754a);"
          ></div>
        </div>
        <p
          class="leading-none"
          style="font-size:clamp(2.2rem,9vw,3.2rem);font-family:var(--font-script,cursive);color:#f0f4ff;"
        >
          {brideName}
        </p>
      </div>

      <!-- Message -->
      <div style={s(400)} class="mb-8">
        <p
          class="text-sm leading-relaxed"
          style="color:#475569;font-family:var(--font-body,sans-serif);border-left:2px solid rgba(44,60,107,0.4);padding-left:12px;"
        >
          {closingMessage ||
            'Mohon doa restu agar kami senantiasa diberikan kebahagiaan, keberkahan, dan cinta yang abadi.'}
        </p>
      </div>

      <!-- "THE END" section marker -->
      <div style={s(600)} class="flex items-center gap-3">
        <div style="flex:1;height:1px;background:rgba(255,255,255,0.06);"></div>
        <div
          class="flex items-center gap-2 px-3 py-1.5"
          style="border:1px solid rgba(44,60,107,0.25);background:rgba(44,60,107,0.08);"
        >
          <span
            class="text-xs font-bold tracking-[0.5em] uppercase"
            style="color:rgba(110,128,168,0.6);font-family:var(--font-heading,sans-serif);"
            >The End</span
          >
        </div>
        <div style="flex:1;height:1px;background:rgba(255,255,255,0.06);"></div>
      </div>
      <div class="mt-8">
        <Credit />
      </div>
    </div>
  {/if}

  <!-- Ghost number bottom right -->
  <div class="pointer-events-none absolute right-0 bottom-0" aria-hidden="true">
    <span
      style="font-size:clamp(100px,35vw,180px);font-weight:900;color:rgba(44,60,107,0.05);font-family:var(--font-heading,sans-serif);line-height:1;user-select:none;"
      >08</span
    >
  </div>
</section>

<style>
  @keyframes closingFadeUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
