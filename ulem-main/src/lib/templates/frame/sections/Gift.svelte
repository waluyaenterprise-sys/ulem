<script lang="ts">
  import { slide } from 'svelte/transition';

  export let invitation: any;

  // Use a gallery photo as background
  const bgImage: string =
    (invitation.gallery?.imageUrls || [])[0] || invitation.cover?.imageUrls?.[0] || '';

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

  function reveal(node: HTMLElement, { delay = 0, y = 20 } = {}) {
    node.style.opacity = '0';
    node.style.transform = `translateY(${y}px)`;
    node.style.transition = `opacity 1s ease ${delay}ms, transform 1s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'none';
          io.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }
</script>

<section class="relative w-full overflow-hidden">
  <!-- Background photo -->
  {#if bgImage}
    <div
      class="absolute inset-0 bg-cover bg-center"
      style="background-image: url('{bgImage}');"
    ></div>
  {:else}
    <div class="absolute inset-0 bg-neutral-900"></div>
  {/if}
  <div class="pointer-events-none absolute inset-0" style="background: rgba(0,0,0,0.7);"></div>

  <!-- Content -->
  <div class="relative z-10 px-8 py-16">
    <!-- Header -->
    <div use:reveal class="mb-10 text-center text-white">
      <p class="font-body text-[9px] tracking-[0.5em] text-white/35 uppercase">Hadiah</p>
      <p class="mt-2 font-heading text-3xl font-light text-white">Kirim Hadiah</p>
      <p class="mx-auto mt-4 max-w-xs font-body text-xs leading-relaxed text-white/45 italic">
        Kehadiran dan doa restu Anda adalah hadiah terindah bagi kami.
      </p>
    </div>

    <div class="mx-auto max-w-sm space-y-3">
      <!-- Bank -->
      {#if bankGifts.length > 0}
        <div
          use:reveal={{ delay: 80 }}
          class="overflow-hidden border border-white/15 backdrop-blur-sm"
        >
          <button
            class="flex w-full items-center justify-between bg-white/5 px-5 py-4 transition-colors hover:bg-white/10"
            on:click={() => (openBank = !openBank)}
          >
            <span class="font-body text-sm text-white/70">Transfer / E-Wallet</span>
            <svg
              viewBox="0 0 24 24"
              class="h-4 w-4 text-white/30 transition-transform duration-300"
              class:rotate-180={openBank}
              fill="currentColor"
            >
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>
          {#if openBank}
            <div transition:slide={{ duration: 280 }}>
              {#each bankGifts as g, i}
                <div class="border-t border-white/8 px-5 py-4">
                  <p class="font-body text-[9px] tracking-[0.35em] text-white/35 uppercase">
                    {g.bank}
                  </p>
                  <p class="mt-1 font-heading text-xl font-light text-white">{g.number}</p>
                  <p class="font-body text-xs text-white/40">a.n. {g.name}</p>
                  <button
                    class="mt-3 inline-flex items-center gap-2 font-body text-[11px] tracking-wider text-white/40 uppercase transition-colors hover:text-white/70"
                    on:click={() => copy(g.number, i)}
                  >
                    {#if copiedIndex === i}
                      <svg viewBox="0 0 24 24" class="h-3 w-3 text-green-400" fill="currentColor">
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
                      Salin
                    {/if}
                  </button>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      <!-- Physical -->
      {#if physicalGift}
        <div
          use:reveal={{ delay: 140 }}
          class="overflow-hidden border border-white/15 backdrop-blur-sm"
        >
          <button
            class="flex w-full items-center justify-between bg-white/5 px-5 py-4 transition-colors hover:bg-white/10"
            on:click={() => (openPhysical = !openPhysical)}
          >
            <span class="font-body text-sm text-white/70">Kado Fisik</span>
            <svg
              viewBox="0 0 24 24"
              class="h-4 w-4 text-white/30 transition-transform duration-300"
              class:rotate-180={openPhysical}
              fill="currentColor"
            >
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>
          {#if openPhysical}
            <div transition:slide={{ duration: 280 }}>
              <div class="border-t border-white/8 px-5 py-4">
                <p class="font-body text-sm leading-relaxed text-white/55 italic">
                  {physicalGift.description}
                </p>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</section>
