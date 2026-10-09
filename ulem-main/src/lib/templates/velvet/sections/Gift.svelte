<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly, slide } from 'svelte/transition';
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

  let sectionEl: HTMLElement;
  let visible = false;
  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section
  bind:this={sectionEl}
  class="relative w-full overflow-hidden px-5 py-20"
  style="background: linear-gradient(160deg, #1c0f0a 0%, #2d1a0e 50%, #1c0f0a 100%);"
>
  <!-- Background glow -->
  <div
    class="pointer-events-none absolute"
    style="width:450px;height:450px;border-radius:50%;background:radial-gradient(circle, rgba(212,119,74,0.10) 0%, transparent 70%);bottom:-100px;left:-100px;"
  ></div>

  {#if visible}
    <!-- Header -->
    <div in:fade={{ duration: 700 }} class="mb-3 text-center">
      <p
        class="text-2xl tracking-[0.3em] uppercase"
        style="color: rgba(232,164,90,0.85); font-family: var(--font-heading, sans-serif);"
      >
        Wedding Gift
      </p>
      <div
        class="mx-auto mt-4"
        style="width:50px;height:1px;background:linear-gradient(to right,transparent,rgba(232,164,90,0.6),transparent);"
      ></div>
    </div>

    <p
      in:fade={{ delay: 200 }}
      class="mx-auto mb-10 max-w-xs text-center text-xs leading-relaxed"
      style="color: rgba(255,200,140,0.55); font-family: var(--font-body, sans-serif);"
    >
      Tanpa mengurangi rasa hormat, bagi yang ingin memberikan tanda kasih untuk kami, dapat
      melalui:
    </p>

    <div class="relative z-10 mx-auto max-w-sm space-y-4">
      <!-- BANK ACCORDION -->
      {#if bankGifts.length > 0}
        <div
          in:fly={{ x: 40, delay: 300, duration: 1000, easing: cubicOut }}
          class="overflow-hidden rounded-2xl"
          style="
            background: rgba(255,200,120,0.07);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border: 1px solid rgba(232,164,90,0.22);
            box-shadow: 0 8px 40px rgba(0,0,0,0.35);
          "
        >
          <button
            type="button"
            on:click={() => (openBank = !openBank)}
            class="flex w-full items-center justify-between px-6 py-5 text-left transition hover:opacity-80"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-xl"
                style="background: rgba(232,164,90,0.15); border: 1px solid rgba(232,164,90,0.3);"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="rgba(232,164,90,0.85)"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 10h18M3 14h18M5 6l7-3 7 3M4 10v8a1 1 0 001 1h14a1 1 0 001-1v-8"
                  />
                </svg>
              </div>
              <div>
                <p
                  class="text-sm font-medium"
                  style="color:rgba(255,230,180,0.9);font-family:var(--font-heading,sans-serif);"
                >
                  Transfer Bank
                </p>
                <p
                  class="text-[11px]"
                  style="color:rgba(232,164,90,0.6);font-family:var(--font-body,sans-serif);"
                >
                  {bankGifts.length} rekening tersedia
                </p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 transition-transform duration-300 {openBank ? 'rotate-180' : ''}"
              fill="none"
              viewBox="0 0 24 24"
              stroke="rgba(232,164,90,0.6)"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {#if openBank}
            <div transition:slide={{ duration: 300, easing: cubicOut }} class="space-y-3 px-5 pb-5">
              {#each bankGifts as acc, i}
                <div
                  class="rounded-xl px-4 py-4"
                  style="background:rgba(255,200,120,0.06);border:1px solid rgba(232,164,90,0.16);"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p
                        class="text-[10px] tracking-[0.25em] uppercase"
                        style="color:rgba(232,164,90,0.65);font-family:var(--font-heading,sans-serif);"
                      >
                        {acc.bank}
                      </p>
                      <p
                        class="mt-1 text-lg tracking-wider"
                        style="color:rgba(255,230,180,0.95);font-family:var(--font-heading,sans-serif);"
                      >
                        {acc.number}
                      </p>
                      <p
                        class="mt-0.5 text-xs"
                        style="color:rgba(255,200,140,0.55);font-family:var(--font-body,sans-serif);"
                      >
                        a.n. {acc.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      on:click={() => copy(acc.number, i)}
                      class="mt-1 shrink-0 rounded-lg px-3 py-1.5 text-[11px] transition active:scale-95"
                      style="
                        font-family:var(--font-heading,sans-serif);
                        background: {copiedIndex === i
                        ? 'rgba(232,164,90,0.25)'
                        : 'rgba(232,164,90,0.12)'};
                        border: 1px solid rgba(232,164,90,0.4);
                        color: rgba(232,164,90,0.85);
                      "
                    >
                      {copiedIndex === i ? '✓ Disalin' : 'Salin'}
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      <!-- PHYSICAL GIFT ACCORDION -->
      {#if physicalGift}
        <div
          in:fly={{ x: 40, delay: 450, duration: 1000, easing: cubicOut }}
          class="overflow-hidden rounded-2xl"
          style="
            background: rgba(255,200,120,0.07);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            border: 1px solid rgba(232,164,90,0.22);
            box-shadow: 0 8px 40px rgba(0,0,0,0.35);
          "
        >
          <button
            type="button"
            on:click={() => (openPhysical = !openPhysical)}
            class="flex w-full items-center justify-between px-6 py-5 text-left transition hover:opacity-80"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-xl"
                style="background: rgba(232,164,90,0.15); border: 1px solid rgba(232,164,90,0.3);"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="rgba(232,164,90,0.85)"
                  stroke-width="1.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M20 12H4m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0V8a2 2 0 00-2-2H6a2 2 0 00-2 2v4M12 3v5m0 0l-2-2m2 2l2-2"
                  />
                </svg>
              </div>
              <div>
                <p
                  class="text-sm font-medium"
                  style="color:rgba(255,230,180,0.9);font-family:var(--font-heading,sans-serif);"
                >
                  Kado Fisik
                </p>
                <p
                  class="text-[11px]"
                  style="color:rgba(232,164,90,0.6);font-family:var(--font-body,sans-serif);"
                >
                  Alamat pengiriman
                </p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 transition-transform duration-300 {openPhysical ? 'rotate-180' : ''}"
              fill="none"
              viewBox="0 0 24 24"
              stroke="rgba(232,164,90,0.6)"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {#if openPhysical}
            <div transition:slide={{ duration: 300, easing: cubicOut }} class="px-5 pb-5">
              <div
                class="rounded-xl px-5 py-4"
                style="background:rgba(255,200,120,0.06);border:1px solid rgba(232,164,90,0.16);"
              >
                <p
                  class="mb-2 text-[10px] tracking-[0.25em] uppercase"
                  style="color:rgba(232,164,90,0.65);font-family:var(--font-heading,sans-serif);"
                >
                  Alamat
                </p>
                <p
                  class="text-sm leading-relaxed"
                  style="color:rgba(255,210,160,0.7);font-family:var(--font-body,sans-serif);"
                >
                  {physicalGift.description}
                </p>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</section>
