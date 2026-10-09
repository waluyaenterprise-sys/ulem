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

  let openBank = false;
  let openPhysical = false;

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
</script>

<section bind:this={el} class="w-full px-6 py-24" style="background:#0d1829;">
  <!-- Chapter header -->
  <div
    class="mb-10 flex items-center gap-3"
    style="opacity:{visible ? 1 : 0};transform:translateX({visible
      ? 0
      : -16}px);transition:opacity 600ms ease,transform 600ms ease;"
  >
    <div style="width:3px;height:32px;background:#2c3e6b;flex-shrink:0;"></div>
    <div>
      <p
        class="text-xs tracking-[0.55em] uppercase"
        style="color:#2c3e6b;font-family:var(--font-heading,sans-serif);"
      >
        Chapter 06
      </p>
      <p
        class="text-lg font-bold"
        style="color:#f0f4ff;font-family:var(--font-heading,sans-serif);letter-spacing:-0.02em;"
      >
        Wedding Gift
      </p>
    </div>
    <div class="ml-auto" aria-hidden="true">
      <span
        style="font-size:80px;font-weight:900;color:rgba(44,60,107,0.07);font-family:var(--font-heading,sans-serif);line-height:1;user-select:none;"
        >06</span
      >
    </div>
  </div>

  <!-- Subtext -->
  <p
    class="mb-8 text-sm leading-relaxed"
    style="color:#475569;font-family:var(--font-body,sans-serif);opacity:{visible
      ? 1
      : 0};transition:opacity 700ms 100ms ease;border-left:2px solid rgba(44,60,107,0.4);padding-left:12px;"
  >
    Kehadiran dan doa restu Anda adalah hadiah terbaik bagi kami. Namun jika berkenan, Anda dapat
    mengirimkan hadiah melalui:
  </p>

  <div
    class="flex flex-col gap-3"
    style="opacity:{visible ? 1 : 0};transform:translateY({visible
      ? 0
      : 20}px);transition:opacity 700ms 200ms ease,transform 700ms 200ms cubic-bezier(0.33,1,0.68,1);"
  >
    <!-- Bank transfer -->
    {#if bankGifts.length > 0}
      <div style="background:#151e30;border:1px solid rgba(255,255,255,0.06);">
        <!-- Accordion trigger -->
        <button
          onclick={() => (openBank = !openBank)}
          class="flex w-full items-center gap-4 px-5 py-4 transition-colors duration-200"
        >
          <!-- Step badge -->
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center text-xs font-bold"
            style="background:{openBank ? '#2c3e6b' : 'rgba(44,60,107,0.15)'};color:{openBank
              ? '#fff'
              : '#2c3e6b'};border:1px solid rgba(44,60,107,0.3);transition:all 300ms;font-family:var(--font-heading,sans-serif);"
          >
            01
          </div>

          <span
            class="flex-1 text-left text-sm font-medium"
            style="color:#cbd5e1;font-family:var(--font-heading,sans-serif);"
            >Transfer Bank / E-Wallet</span
          >

          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style="color:#2c3e6b;transform:rotate({openBank
              ? 180
              : 0}deg);transition:transform 300ms;flex-shrink:0;"
          >
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        {#if openBank}
          <div transition:slide={{ duration: 300, easing: cubicOut }}>
            <div style="height:1px;background:rgba(255,255,255,0.05);"></div>
            {#each bankGifts as gift, i}
              <div
                class="flex items-center gap-4 px-5 py-4"
                style="border-top:{i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none'};"
              >
                <div class="min-w-0 flex-1">
                  <p
                    class="mb-1 text-xs tracking-[0.4em] uppercase"
                    style="color:#c4754a;font-family:var(--font-heading,sans-serif);"
                  >
                    {gift.bank}
                  </p>
                  <p
                    class="text-base font-bold tracking-wider"
                    style="color:#f0f4ff;font-family:var(--font-heading,sans-serif);"
                  >
                    {gift.number}
                  </p>
                  <p
                    class="mt-0.5 text-xs"
                    style="color:#475569;font-family:var(--font-body,sans-serif);"
                  >
                    {gift.name}
                  </p>
                </div>
                <button
                  onclick={() => copy(gift.number, i)}
                  class="flex shrink-0 items-center gap-1.5 px-3 py-2 text-xs font-medium tracking-widest uppercase transition-all duration-200"
                  style="background:{copiedIndex === i
                    ? 'rgba(34,197,94,0.15)'
                    : 'rgba(44,60,107,0.15)'};color:{copiedIndex === i
                    ? '#4ade80'
                    : '#6e80a8'};border:1px solid {copiedIndex === i
                    ? 'rgba(74,222,128,0.3)'
                    : 'rgba(44,60,107,0.3)'};font-family:var(--font-heading,sans-serif);"
                >
                  {#if copiedIndex === i}
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path
                        d="M1 5.5l3 3 6-6"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  {:else}
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <rect
                        x="3.5"
                        y="0.5"
                        width="7"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        stroke-width="0.9"
                      />
                      <path d="M7 7.5V10h-6.5V3.5H3.5" stroke="currentColor" stroke-width="0.9" />
                    </svg>
                  {/if}
                  {copiedIndex === i ? 'Copied' : 'Copy'}
                </button>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}

    <!-- Physical gift -->
    {#if physicalGift}
      <div style="background:#151e30;border:1px solid rgba(255,255,255,0.06);">
        <button
          onclick={() => (openPhysical = !openPhysical)}
          class="flex w-full items-center gap-4 px-5 py-4 transition-colors duration-200"
        >
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center text-xs font-bold"
            style="background:{openPhysical
              ? '#c4754a'
              : 'rgba(196,117,74,0.12)'};color:{openPhysical
              ? '#fff'
              : '#c4754a'};border:1px solid rgba(196,117,74,0.3);transition:all 300ms;font-family:var(--font-heading,sans-serif);"
          >
            02
          </div>

          <span
            class="flex-1 text-left text-sm font-medium"
            style="color:#cbd5e1;font-family:var(--font-heading,sans-serif);">Hadiah Fisik</span
          >

          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style="color:#c4754a;transform:rotate({openPhysical
              ? 180
              : 0}deg);transition:transform 300ms;flex-shrink:0;"
          >
            <path
              d="M2 4l4 4 4-4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        {#if openPhysical}
          <div transition:slide={{ duration: 300, easing: cubicOut }}>
            <div style="height:1px;background:rgba(255,255,255,0.05);"></div>
            <div class="px-5 py-4">
              <p
                class="text-sm leading-relaxed"
                style="color:#94a3b8;font-family:var(--font-body,sans-serif);"
              >
                {physicalGift.description}
              </p>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</section>
