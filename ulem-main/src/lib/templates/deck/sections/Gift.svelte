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
      { threshold: 0.15 }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  });
</script>

<section
  data-deck-page
  bind:this={el}
  class="deck-page deck-page-bg relative flex h-svh w-full flex-col items-center justify-center overflow-hidden px-6"
  style="scroll-snap-align: start;"
>
  {#if visible}
    <div style="width: 100%; max-width: 340px;">
      <div class="mb-5" style="animation: deckIn 0.5s ease both;">
        <p class="deck-label mb-1">Hadiah</p>
        <h2 class="deck-title">Wedding Gift</h2>
      </div>

      <div class="deck-card" style="animation: deckIn 0.6s ease both;">
        <div class="deck-body space-y-2">
          {#if bankGifts.length > 0}
            <div>
              <button
                on:click={() => (openBank = !openBank)}
                style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 10px 0; background: none; border: none; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.06);"
              >
                <span style="font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.6);"
                  >Transfer / E-Wallet</span
                >
                <span style="color: rgba(255,255,255,0.25); font-size: 11px;"
                  >{openBank ? '▲' : '▼'}</span
                >
              </button>
              {#if openBank}
                <div transition:slide={{ duration: 200 }} class="mt-3 space-y-3">
                  {#each bankGifts as g, i}
                    <div
                      style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 12px;"
                    >
                      <p class="deck-label mb-1">{g.bank}</p>
                      <p
                        style="font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.8); letter-spacing: 0.04em;"
                      >
                        {g.number}
                      </p>
                      <p class="deck-small">a/n {g.name}</p>
                      <button
                        on:click={() => copy(g.number, i)}
                        style="margin-top: 8px; width: 100%; padding: 7px; background: {copiedIndex ===
                        i
                          ? 'rgba(255,255,255,0.08)'
                          : 'transparent'}; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-size: 10px; font-weight: 600; color: {copiedIndex ===
                        i
                          ? 'rgba(255,255,255,0.7)'
                          : 'rgba(255,255,255,0.3)'}; cursor: pointer; letter-spacing: 0.1em; text-transform: uppercase;"
                      >
                        {copiedIndex === i ? '✓ Tersalin' : 'Salin Nomor'}
                      </button>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}

          {#if physicalGift}
            <div>
              <button
                on:click={() => (openPhysical = !openPhysical)}
                style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 10px 0; background: none; border: none; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.06);"
              >
                <span style="font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.6);"
                  >Kado Fisik</span
                >
                <span style="color: rgba(255,255,255,0.25); font-size: 11px;"
                  >{openPhysical ? '▲' : '▼'}</span
                >
              </button>
              {#if openPhysical}
                <div
                  transition:slide={{ duration: 200 }}
                  style="margin-top: 12px; background: rgba(255,255,255,0.03); border-radius: 12px; padding: 12px;"
                >
                  <p class="deck-small" style="line-height: 1.7;">
                    {physicalGift.address ||
                      physicalGift.notes ||
                      'Hubungi kami untuk info pengiriman.'}
                  </p>
                </div>
              {/if}
            </div>
          {/if}

          {#if bankGifts.length === 0 && !physicalGift}
            <p class="deck-small py-6 text-center">Do'a & restu Anda adalah hadiah terbaik kami.</p>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</section>
