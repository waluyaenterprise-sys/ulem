<script lang="ts">
  import { slide } from 'svelte/transition';
  import Petals from './Petal.svelte';
  import FlowerIcon from './FlowerIcon.svelte';

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
      el.style.cssText = 'position:fixed;opacity:0;';
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

  function reveal(node: HTMLElement, { delay = 0 } = {}) {
    node.style.opacity = '0';
    node.style.transform = 'translateY(20px)';
    node.style.transition = `opacity 0.9s ease ${delay}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'none';
          io.unobserve(node);
        }
      },
      { threshold: 0.12 }
    );
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }
</script>

<section class="relative w-full bg-white px-8 py-14">
  <!-- Decorative flowers -->
  <div class="pointer-events-none absolute top-4 left-8 z-10">
    <FlowerIcon size={36} opacity={0.3} color="#6b7280" />
  </div>
  <div class="pointer-events-none absolute top-4 right-8 z-10">
    <FlowerIcon size={30} opacity={0.25} color="#6b7280" />
  </div>

  <!-- Header -->
  <div use:reveal class="mb-10 text-center">
    <p class="font-body text-[9px] tracking-[0.45em] text-gray-400 uppercase">Hadiah</p>
    <div class="mt-2 flex items-center justify-center gap-3">
      <FlowerIcon size={18} opacity={0.35} color="#6b7280" />
      <p class="font-heading text-3xl font-light text-gray-900">Kirim Hadiah</p>
      <FlowerIcon size={18} opacity={0.35} color="#6b7280" />
    </div>
    <p class="mx-auto mt-4 max-w-xs font-body text-xs leading-relaxed text-gray-400 italic">
      Kehadiran dan doa restu Anda adalah hadiah terindah bagi kami.
    </p>
  </div>

  <div class="mx-auto max-w-sm space-y-3">
    <!-- Bank transfer -->
    {#if bankGifts.length > 0}
      <div use:reveal={{ delay: 80 }} class="border border-gray-100">
        <button
          class="flex w-full items-center justify-between px-5 py-4"
          on:click={() => (openBank = !openBank)}
        >
          <div class="flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900">
              <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 text-white" fill="currentColor">
                <path
                  d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"
                />
              </svg>
            </div>
            <span class="font-body text-sm text-gray-700">Transfer / E-Wallet</span>
          </div>
          <svg
            viewBox="0 0 24 24"
            class="h-4 w-4 text-gray-300 transition-transform duration-300"
            class:rotate-180={openBank}
            fill="currentColor"
          >
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>

        {#if openBank}
          <div transition:slide={{ duration: 280 }}>
            {#each bankGifts as g, i}
              <div class="border-t border-gray-50 px-5 py-4">
                <p class="font-body text-[9px] tracking-[0.35em] text-gray-400 uppercase">
                  {g.bank}
                </p>
                <p class="mt-1 font-heading text-xl font-light text-gray-900">{g.number}</p>
                <p class="font-body text-xs text-gray-400">a.n. {g.name}</p>
                <button
                  class="mt-3 flex items-center gap-2 font-body text-[11px] tracking-widest text-gray-500 uppercase transition-colors hover:text-gray-900"
                  on:click={() => copy(g.number, i)}
                >
                  {#if copiedIndex === i}
                    <svg viewBox="0 0 24 24" class="h-3 w-3 text-green-500" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    Tersalin
                  {:else}
                    <svg
                      viewBox="0 0 24 24"
                      class="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Salin Nomor
                  {/if}
                </button>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}

    <!-- Physical gift -->
    {#if physicalGift}
      <div use:reveal={{ delay: 140 }} class="border border-gray-100">
        <button
          class="flex w-full items-center justify-between px-5 py-4"
          on:click={() => (openPhysical = !openPhysical)}
        >
          <div class="flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900">
              <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 text-white" fill="currentColor">
                <path
                  d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.48 0 12.36 0c-1.7 0-3.22.7-4.32 1.83L12 5.9l3.96-4.07c.5-.51 1.19-.83 1.96-.83C19.08 1 20 1.92 20 3c0 .57-.24 1.08-.61 1.46L18.14 5.7A6.97 6.97 0 0120 6zM21 8H3v13h18V8z"
                />
              </svg>
            </div>
            <span class="font-body text-sm text-gray-700">Kado Fisik</span>
          </div>
          <svg
            viewBox="0 0 24 24"
            class="h-4 w-4 text-gray-300 transition-transform duration-300"
            class:rotate-180={openPhysical}
            fill="currentColor"
          >
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>

        {#if openPhysical}
          <div transition:slide={{ duration: 280 }}>
            <div class="border-t border-gray-50 px-5 py-4">
              <p class="font-body text-sm leading-relaxed text-gray-500 italic">
                {physicalGift.description}
              </p>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</section>
