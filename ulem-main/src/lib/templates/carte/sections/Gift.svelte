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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  });
</script>

<section bind:this={el} class="w-full px-6 py-20" style="background:#faf6ef;">
  <!-- Header -->
  <div
    class="mb-10 text-center"
    style="opacity:{visible ? 1 : 0};transform:translateY({visible
      ? 0
      : -14}px);transition:opacity 700ms ease,transform 700ms ease;"
  >
    <p
      class="text-xs tracking-[0.6em] uppercase"
      style="color:#8b1a1a;font-family:var(--font-heading,serif);"
    >
      — Hadiah &amp; Doa —
    </p>
    <p class="mt-2 text-2xl" style="color:#2a1010;font-family:var(--font-script,cursive);">
      Wedding Gift
    </p>
    <div class="mx-auto mt-3 flex items-center gap-2" style="width:160px;">
      <div
        style="flex:1;height:1px;background:linear-gradient(to right,transparent,#b8962e);"
      ></div>
      <svg width="7" height="7" viewBox="0 0 7 7">
        <rect
          x="0.5"
          y="0.5"
          width="6"
          height="6"
          transform="rotate(45 3.5 3.5)"
          fill="none"
          stroke="#b8962e"
          stroke-width="0.8"
        />
      </svg>
      <div style="flex:1;height:1px;background:linear-gradient(to left,transparent,#b8962e);"></div>
    </div>
    <p
      class="mx-auto mt-5 max-w-xs text-xs leading-relaxed"
      style="color:#7a5050;font-family:var(--font-body,sans-serif);"
    >
      Kehadiran dan doa restu Anda adalah hadiah terbaik bagi kami. Namun jika berkenan, Anda dapat
      mengirimkan hadiah melalui:
    </p>
  </div>

  <div
    class="mx-auto max-w-xs"
    style="opacity:{visible ? 1 : 0};transform:translateY({visible
      ? 0
      : 20}px);transition:opacity 700ms 200ms ease,transform 700ms 200ms cubic-bezier(0.33,1,0.68,1);"
  >
    <!-- Bank transfer accordion -->
    {#if bankGifts.length > 0}
      <div
        class="mb-3 overflow-hidden"
        style="background:#fff;border:1px solid #e8d8c8;box-shadow:1px 2px 12px rgba(107,20,20,0.06);"
      >
        <button
          onclick={() => (openBank = !openBank)}
          class="flex w-full items-center justify-between px-5 py-4 transition-colors duration-200"
          style="background:{openBank ? 'rgba(107,20,20,0.04)' : 'transparent'};"
        >
          <div class="flex items-center gap-3">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style="color:#6b1414;">
              <rect
                x="1"
                y="5"
                width="13"
                height="9"
                rx="1"
                stroke="currentColor"
                stroke-width="0.9"
              />
              <path
                d="M4 5V3.5C4 2.12 5.34 1 7 1H8C9.66 1 11 2.12 11 3.5V5"
                stroke="currentColor"
                stroke-width="0.9"
              />
            </svg>
            <span
              class="text-xs tracking-[0.35em] uppercase"
              style="color:#3d1010;font-family:var(--font-heading,serif);">Transfer Bank</span
            >
          </div>
          <span
            style="color:#6b1414;font-size:13px;transform:rotate({openBank
              ? 180
              : 0}deg);transition:transform 300ms;">▾</span
          >
        </button>

        {#if openBank}
          <div transition:slide={{ duration: 300, easing: cubicOut }}>
            <div
              style="height:1px;background:linear-gradient(to right,transparent,#b8962e,transparent);opacity:0.4;"
            ></div>
            {#each bankGifts as gift, i}
              <div class="px-5 py-4" style="border-top:{i > 0 ? '1px solid #f0e4d4' : 'none'};">
                <p
                  class="mb-0.5 text-xs tracking-widest uppercase"
                  style="color:#b8962e;font-family:var(--font-heading,serif);"
                >
                  {gift.bank}
                </p>
                <div class="mt-1 flex items-center justify-between gap-2">
                  <p
                    class="text-sm font-medium tracking-wider"
                    style="color:#2a1010;font-family:var(--font-heading,serif);"
                  >
                    {gift.number}
                  </p>
                  <button
                    onclick={() => copy(gift.number, i)}
                    class="shrink-0 px-3 py-1 text-xs tracking-widest uppercase transition-all duration-200"
                    style="border:1px solid {copiedIndex === i
                      ? '#b8962e'
                      : '#6b1414'};color:{copiedIndex === i
                      ? '#b8962e'
                      : '#6b1414'};font-family:var(--font-heading,serif);"
                  >
                    {copiedIndex === i ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p
                  class="mt-0.5 text-xs"
                  style="color:#7a5050;font-family:var(--font-body,sans-serif);"
                >
                  {gift.name}
                </p>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}

    <!-- Physical gift accordion -->
    {#if physicalGift}
      <div
        class="overflow-hidden"
        style="background:#fff;border:1px solid #e8d8c8;box-shadow:1px 2px 12px rgba(107,20,20,0.06);"
      >
        <button
          onclick={() => (openPhysical = !openPhysical)}
          class="flex w-full items-center justify-between px-5 py-4 transition-colors duration-200"
          style="background:{openPhysical ? 'rgba(107,20,20,0.04)' : 'transparent'};"
        >
          <div class="flex items-center gap-3">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style="color:#6b1414;">
              <rect
                x="2"
                y="6"
                width="11"
                height="8"
                rx="1"
                stroke="currentColor"
                stroke-width="0.9"
              />
              <path d="M1 6 L14 6 L14 9 L1 9" stroke="currentColor" stroke-width="0.9" />
              <path d="M7.5 6 L7.5 14" stroke="currentColor" stroke-width="0.8" />
              <path
                d="M7.5 6 C7.5 4 5.5 2 4 3.5 C3 4.5 4 6 7.5 6"
                stroke="currentColor"
                stroke-width="0.8"
                fill="none"
              />
              <path
                d="M7.5 6 C7.5 4 9.5 2 11 3.5 C12 4.5 11 6 7.5 6"
                stroke="currentColor"
                stroke-width="0.8"
                fill="none"
              />
            </svg>
            <span
              class="text-xs tracking-[0.35em] uppercase"
              style="color:#3d1010;font-family:var(--font-heading,serif);">Hadiah Fisik</span
            >
          </div>
          <span
            style="color:#6b1414;font-size:13px;transform:rotate({openPhysical
              ? 180
              : 0}deg);transition:transform 300ms;">▾</span
          >
        </button>

        {#if openPhysical}
          <div transition:slide={{ duration: 300, easing: cubicOut }}>
            <div
              style="height:1px;background:linear-gradient(to right,transparent,#b8962e,transparent);opacity:0.4;"
            ></div>
            <div class="px-5 py-4">
              <p
                class="text-sm leading-relaxed"
                style="color:#5a3030;font-family:var(--font-body,sans-serif);"
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
