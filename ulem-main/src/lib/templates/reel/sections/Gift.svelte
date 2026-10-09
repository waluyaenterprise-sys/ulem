<script lang="ts">
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let invitation: any;

  const bankGifts = (invitation.gifts || [])
    .filter((g: any) => g.type === 'bank' || g.type === 'eWallet')
    .map((g: any) => ({
      bank: g.name || g.platform || '',
      number: g.accountNumber || '',
      name: g.accountHolder || ''
    }));

  const physicalGift = (invitation.gifts || []).find((g: any) => g.type === 'physical');

  let openBank = false;
  let openPhysical = false;
  let copiedIndex: number | null = null;

  function copy(text: string, i: number) {
    navigator.clipboard?.writeText(text).catch(() => {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
    copiedIndex = i;
    setTimeout(() => (copiedIndex = null), 2000);
  }

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
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  });

  function s(delayMs: number) {
    return `animation: giftFadeIn 0.7s ease ${delayMs}ms both;`;
  }
</script>

<section
  bind:this={el}
  class="relative w-full overflow-hidden px-6 py-24"
  style="background:#0d0905;"
>
  <!-- Film grain -->
  <div
    class="film-grain pointer-events-none absolute inset-0"
    style="opacity:0.3"
    aria-hidden="true"
  ></div>

  {#if visible}
    <!-- Scene header -->
    <div style={s(0)} class="mb-10 text-center">
      <p
        class="text-xs tracking-[0.6em] uppercase"
        style="color:#7a6848;font-family:var(--font-heading,sans-serif);"
      >
        Scene VI
      </p>
      <p
        class="mt-1 text-xl font-bold"
        style="color:#f5e6c8;font-family:var(--font-heading,sans-serif);letter-spacing:-0.01em;"
      >
        Credits &amp; Gifts
      </p>
      <p class="mt-1 text-xs" style="color:#5a4e38;font-family:var(--font-body,sans-serif);">
        Hadiah Pernikahan
      </p>
      <div class="mx-auto mt-3" style="width:40px;height:1px;background:#c9933a;opacity:0.6;"></div>
    </div>

    <div class="mx-auto max-w-sm space-y-4">
      <!-- Bank transfer accordion -->
      {#if bankGifts.length > 0}
        <div style={s(200)} class="overflow-hidden" style:border="1px solid rgba(201,147,58,0.2)">
          <button
            onclick={() => (openBank = !openBank)}
            class="flex w-full items-center justify-between px-5 py-4"
            style="background:#120c06;"
          >
            <div class="flex items-center gap-3">
              <span
                class="flex h-7 w-7 items-center justify-center text-xs font-bold"
                style="background:#c9933a;color:#0d0905;font-family:var(--font-heading,sans-serif);"
                >01</span
              >
              <span
                class="text-sm tracking-wider uppercase"
                style="color:#c9a96e;font-family:var(--font-heading,sans-serif);"
                >Transfer Bank</span
              >
            </div>
            <span
              style="color:#c9933a;transform:{openBank
                ? 'rotate(180deg)'
                : 'rotate(0)'};transition:transform 300ms;">▾</span
            >
          </button>

          {#if openBank}
            <div transition:slide={{ duration: 300, easing: cubicOut }}>
              {#each bankGifts as gift, i}
                <div
                  class="px-5 py-4"
                  style="background:#0d0905;border-top:1px solid rgba(201,147,58,0.1);"
                >
                  <p
                    class="text-xs tracking-wider uppercase"
                    style="color:#7a6848;font-family:var(--font-heading,sans-serif);"
                  >
                    {gift.bank}
                  </p>
                  <p
                    class="mt-1 text-base font-bold"
                    style="color:#f5e6c8;font-family:var(--font-heading,sans-serif);letter-spacing:0.05em;"
                  >
                    {gift.number}
                  </p>
                  <p
                    class="mt-0.5 text-xs"
                    style="color:#5a4e38;font-family:var(--font-body,sans-serif);"
                  >
                    {gift.name}
                  </p>
                  <button
                    onclick={() => copy(gift.number, i)}
                    class="mt-3 flex items-center gap-2 px-4 py-1.5 text-xs tracking-widest uppercase transition-all duration-200"
                    style="border:1px solid rgba(201,147,58,0.35);color:{copiedIndex === i
                      ? '#22c55e'
                      : '#c9933a'};font-family:var(--font-heading,sans-serif);background:transparent;"
                    >{copiedIndex === i ? '✓ Disalin' : 'Salin'}</button
                  >
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      <!-- Physical gift accordion -->
      {#if physicalGift}
        <div style={s(350)} class="overflow-hidden" style:border="1px solid rgba(201,147,58,0.2)">
          <button
            onclick={() => (openPhysical = !openPhysical)}
            class="flex w-full items-center justify-between px-5 py-4"
            style="background:#120c06;"
          >
            <div class="flex items-center gap-3">
              <span
                class="flex h-7 w-7 items-center justify-center text-xs font-bold"
                style="background:#c9933a;color:#0d0905;font-family:var(--font-heading,sans-serif);"
                >02</span
              >
              <span
                class="text-sm tracking-wider uppercase"
                style="color:#c9a96e;font-family:var(--font-heading,sans-serif);">Kado Fisik</span
              >
            </div>
            <span
              style="color:#c9933a;transform:{openPhysical
                ? 'rotate(180deg)'
                : 'rotate(0)'};transition:transform 300ms;">▾</span
            >
          </button>

          {#if openPhysical}
            <div
              transition:slide={{ duration: 300, easing: cubicOut }}
              class="px-5 py-4"
              style="background:#0d0905;border-top:1px solid rgba(201,147,58,0.1);"
            >
              <p
                class="text-sm leading-relaxed"
                style="color:#7a6848;font-family:var(--font-body,sans-serif);"
              >
                {physicalGift.description || 'Kado fisik dapat dikirimkan ke alamat mempelai.'}
              </p>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</section>

<style>
  @keyframes giftFadeIn {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .film-grain {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    background-repeat: repeat;
  }
</style>
