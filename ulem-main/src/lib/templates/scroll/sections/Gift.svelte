<script lang="ts">
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';

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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'translateY(0)';
          observer.unobserve(node);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(node);
    return { destroy: () => observer.disconnect() };
  }
</script>

<section
  class="relative w-full overflow-hidden px-5 py-16"
  style="background: linear-gradient(160deg, #EDD9A3 0%, #F4E8C1 50%, #EDD9A3 100%);"
>
  <div
    class="pointer-events-none absolute inset-0 opacity-[0.035]"
    style="background-image: repeating-linear-gradient(0deg, transparent, transparent 27px, #8B4513 27px, #8B4513 28px);"
  ></div>
  <div
    class="pointer-events-none absolute inset-0"
    style="box-shadow: inset 0 0 60px rgba(139,69,19,0.15);"
  ></div>

  <div class="relative z-10 mx-auto max-w-sm">
    <!-- Header -->
    <div use:reveal class="mb-10 text-center">
      <p class="font-body text-[9px] tracking-[0.4em] text-amber-800/50 uppercase">
        Hadiah &amp; Doa
      </p>
      <p class="mt-1 font-script text-4xl text-amber-900">Kirim Hadiah</p>
      <div class="mx-auto mt-3 flex items-center justify-center gap-2">
        <div class="h-px w-10 bg-amber-700/40"></div>
        <div class="h-1 w-1 rotate-45 bg-amber-700/50"></div>
        <div class="h-px w-10 bg-amber-700/40"></div>
      </div>
      <p class="mt-3 font-body text-xs leading-relaxed text-amber-900/50 italic">
        Doa restu Bapak/Ibu/Saudara/i adalah hadiah terbesar bagi kami.<br />
        Bagi yang ingin memberikan hadiah, berikut informasinya.
      </p>
    </div>

    <!-- Bank accordion -->
    {#if bankGifts.length > 0}
      <div use:reveal={{ delay: 100 }} class="mb-4">
        <button
          class="flex w-full items-center justify-between px-5 py-4 text-left transition-all"
          style="
            background: linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(139,105,20,0.1) 100%);
            border: 1px solid rgba(201,162,39,0.4);
            box-shadow: 3px 3px 0 rgba(139,105,20,0.25);
          "
          on:click={() => (openBank = !openBank)}
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-sm"
              style="background: linear-gradient(135deg, #C9A227 0%, #8B6914 100%);"
            >
              <svg viewBox="0 0 24 24" class="h-4 w-4 text-white" fill="currentColor">
                <path
                  d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"
                />
              </svg>
            </div>
            <span class="font-heading text-sm font-semibold text-amber-900"
              >Transfer / E-Wallet</span
            >
          </div>
          <svg
            viewBox="0 0 24 24"
            class="h-4 w-4 text-amber-700/60 transition-transform duration-300"
            class:rotate-180={openBank}
            fill="currentColor"
          >
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>

        {#if openBank}
          <div transition:slide={{ duration: 300 }} class="overflow-hidden">
            {#each bankGifts as g, i}
              <div
                class="border-b border-amber-700/10 px-5 py-4 last:border-b-0"
                style="background: rgba(255,255,255,0.3);"
              >
                <p class="font-body text-[9px] tracking-[0.3em] text-amber-700/60 uppercase">
                  {g.bank}
                </p>
                <p class="mt-1 font-heading text-lg font-bold text-amber-900">{g.number}</p>
                <p class="font-body text-xs text-amber-800/60">a.n. {g.name}</p>
                <button
                  class="mt-3 flex items-center gap-1.5 rounded-sm border border-amber-700/30 px-4 py-1.5 font-body text-[11px] tracking-wider text-amber-800 uppercase transition-all active:scale-95"
                  style="background: rgba(201,162,39,0.1);"
                  on:click={() => copy(g.number, i)}
                >
                  {#if copiedIndex === i}
                    <svg viewBox="0 0 24 24" class="h-3 w-3 text-green-600" fill="currentColor"
                      ><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg
                    >
                    Tersalin
                  {:else}
                    <svg viewBox="0 0 24 24" class="h-3 w-3" fill="currentColor"
                      ><path
                        d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                      /></svg
                    >
                    Salin Nomor
                  {/if}
                </button>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}

    <!-- Physical gift accordion -->
    {#if physicalGift}
      <div use:reveal={{ delay: 180 }}>
        <button
          class="flex w-full items-center justify-between px-5 py-4 text-left transition-all"
          style="
            background: linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(139,105,20,0.1) 100%);
            border: 1px solid rgba(201,162,39,0.4);
            box-shadow: 3px 3px 0 rgba(139,105,20,0.25);
          "
          on:click={() => (openPhysical = !openPhysical)}
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-sm"
              style="background: linear-gradient(135deg, #C9A227 0%, #8B6914 100%);"
            >
              <svg viewBox="0 0 24 24" class="h-4 w-4 text-white" fill="currentColor">
                <path
                  d="M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.48 0 12.36 0c-1.7 0-3.22.7-4.32 1.83L12 5.9l3.96-4.07c.5-.51 1.19-.83 1.96-.83C19.08 1 20 1.92 20 3c0 .57-.24 1.08-.61 1.46L18.14 5.7A6.97 6.97 0 0020 6z"
                />
                <path d="M21 8H3v13h18V8zm-9 11L4.5 11h15L12 19z" />
              </svg>
            </div>
            <span class="font-heading text-sm font-semibold text-amber-900">Kado Fisik</span>
          </div>
          <svg
            viewBox="0 0 24 24"
            class="h-4 w-4 text-amber-700/60 transition-transform duration-300"
            class:rotate-180={openPhysical}
            fill="currentColor"
          >
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>

        {#if openPhysical}
          <div transition:slide={{ duration: 300 }}>
            <div
              class="px-5 py-4"
              style="background: rgba(255,255,255,0.3); border: 1px solid rgba(201,162,39,0.2); border-top: none;"
            >
              <p class="font-body text-xs leading-relaxed text-amber-900/70 italic">
                {physicalGift.description}
              </p>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</section>
