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

  // Copy to clipboard
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

  // Accordion
  let openBank = false;
  let openPhysical = false;

  // Scroll reveal
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

<section bind:this={sectionEl} class="w-full bg-white px-6 py-16">
  {#if visible}
    <!-- HEADER -->
    <div in:fly={{ x: -40, duration: 1100, easing: cubicOut }} class="mb-2 text-center">
      <p class="font-script text-4xl text-[#F0A269]">Wedding Gift</p>
      <div class="mx-auto mt-3 h-px w-12 bg-[#F0A269]/30"></div>
    </div>

    <p
      in:fade={{ delay: 200 }}
      class="mx-auto mb-10 max-w-xs text-center text-xs leading-relaxed text-gray-400"
    >
      Tanpa mengurangi rasa hormat, bagi yang ingin memberikan tanda kasih untuk kami, dapat
      melalui:
    </p>

    <div class="mx-auto max-w-sm space-y-3">
      <!-- BANK TRANSFER ACCORDION -->
      {#if bankGifts.length > 0}
        <div
          in:fly={{ x: 40, delay: 300, duration: 1000, easing: cubicOut }}
          class="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50"
        >
          <button
            type="button"
            on:click={() => (openBank = !openBank)}
            class="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <div class="flex items-center gap-3">
              <!-- bank icon -->
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M3 10h18M3 14h18M5 6l7-3 7 3M4 10v8a1 1 0 001 1h14a1 1 0 001-1v-8"
                  />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-800">Transfer Bank</p>
                <p class="text-[11px] text-gray-400">{bankGifts.length} rekening tersedia</p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-400 transition-transform duration-300 {openBank
                ? 'rotate-180'
                : ''}"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {#if openBank}
            <div transition:slide={{ duration: 300, easing: cubicOut }} class="space-y-2 px-4 pb-4">
              {#each bankGifts as acc, i}
                <div class="rounded-xl bg-white p-4 shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <p class="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                        {acc.bank}
                      </p>
                      <p class="mt-1 font-jomolhari text-xl tracking-wider text-gray-800">
                        {acc.number}
                      </p>
                      <p class="mt-0.5 text-xs text-gray-500">a.n. {acc.name}</p>
                    </div>
                    <button
                      type="button"
                      on:click={() => copy(acc.number, i)}
                      class="mt-1 shrink-0 rounded-xl border border-gray-200 px-3 py-1.5 text-[11px] font-medium
                        text-gray-500 transition hover:bg-gray-50 active:scale-95
                        {copiedIndex === i
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                        : ''}"
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
          class="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50"
        >
          <button
            type="button"
            on:click={() => (openPhysical = !openPhysical)}
            class="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M20 12H4m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0V8a2 2 0 00-2-2H6a2 2 0 00-2 2v4M12 3v5m0 0l-2-2m2 2l2-2"
                  />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-800">Kado Fisik</p>
                <p class="text-[11px] text-gray-400">Alamat pengiriman</p>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-400 transition-transform duration-300 {openPhysical
                ? 'rotate-180'
                : ''}"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {#if openPhysical}
            <div transition:slide={{ duration: 300, easing: cubicOut }} class="px-4 pb-4">
              <div class="rounded-xl bg-white p-4 shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
                <p class="text-xs leading-relaxed text-gray-500">{physicalGift.description}</p>
                {#if physicalGift.imageUrls?.[0]}
                  <img
                    src={physicalGift.imageUrls[0]}
                    alt=""
                    class="mt-3 w-full rounded-lg object-cover"
                  />
                {/if}
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- CLOSING NOTE -->
    <p
      in:fade={{ delay: 600 }}
      class="mx-auto mt-10 max-w-xs text-center text-[11px] leading-relaxed text-gray-300 italic"
    >
      Kehadiran dan doa restu Anda adalah hadiah terbesar bagi kami 🤍
    </p>
  {/if}
</section>
