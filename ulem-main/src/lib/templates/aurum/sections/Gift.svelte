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
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section bind:this={sectionEl} class="w-full px-5 py-20" style="background:#040404;">
  {#if visible}
    <!-- Header -->
    <div in:fade={{ duration: 700 }} class="mb-3 text-center">
      <p
        class="text-[9px] tracking-[0.45em] uppercase"
        style="color:#c9a84c;font-family:var(--font-heading,sans-serif);"
      >
        Wedding Gift
      </p>
      <div style="width:40px;height:1px;background:#c9a84c;margin:12px auto 0;opacity:0.6;"></div>
    </div>

    <p
      in:fade={{ delay: 200 }}
      class="mx-auto mb-12 max-w-xs text-center text-xs leading-relaxed"
      style="color:rgba(255,255,255,0.35);font-family:var(--font-body,sans-serif);"
    >
      Tanpa mengurangi rasa hormat, bagi yang ingin memberikan tanda kasih untuk kami, dapat
      melalui:
    </p>

    <div class="mx-auto max-w-sm space-y-1">
      <!-- BANK -->
      {#if bankGifts.length > 0}
        <div in:fly={{ x: -30, delay: 300, duration: 900, easing: cubicOut }}>
          <button
            type="button"
            class="flex w-full items-center justify-between border-b py-5 text-left transition hover:opacity-70"
            style="border-color:rgba(201,168,76,0.2);"
            on:click={() => (openBank = !openBank)}
          >
            <div class="flex items-center gap-5">
              <!-- Minimal icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#c9a84c"
                stroke-width="1"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 10h18M3 14h18M5 6l7-3 7 3M4 10v8a1 1 0 001 1h14a1 1 0 001-1v-8"
                />
              </svg>
              <div>
                <p
                  class="text-sm"
                  style="color:rgba(255,255,255,0.85);font-family:var(--font-heading,sans-serif);"
                >
                  Transfer Bank
                </p>
                <p
                  class="text-[10px]"
                  style="color:rgba(201,168,76,0.55);font-family:var(--font-body,sans-serif);"
                >
                  {bankGifts.length} rekening tersedia
                </p>
              </div>
            </div>
            <!-- Plus/minus -->
            <div
              class="transition-transform duration-300"
              style="transform:rotate({openBank ? '45deg' : '0deg'});"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <line
                  x1="7"
                  y1="1"
                  x2="7"
                  y2="13"
                  stroke="#c9a84c"
                  stroke-width="1.2"
                  stroke-opacity="0.7"
                />
                <line
                  x1="1"
                  y1="7"
                  x2="13"
                  y2="7"
                  stroke="#c9a84c"
                  stroke-width="1.2"
                  stroke-opacity="0.7"
                />
              </svg>
            </div>
          </button>

          {#if openBank}
            <div transition:slide={{ duration: 300, easing: cubicOut }} class="space-y-4 py-5">
              {#each bankGifts as acc, i}
                <div
                  class="flex items-center justify-between border-l-2 py-1 pl-5"
                  style="border-color:rgba(201,168,76,0.5);"
                >
                  <div>
                    <p
                      class="text-[9px] tracking-[0.3em] uppercase"
                      style="color:rgba(201,168,76,0.6);font-family:var(--font-heading,sans-serif);"
                    >
                      {acc.bank}
                    </p>
                    <p
                      class="mt-1 text-xl tracking-widest"
                      style="color:#fff;font-family:var(--font-heading,sans-serif);"
                    >
                      {acc.number}
                    </p>
                    <p
                      class="mt-0.5 text-[11px]"
                      style="color:rgba(255,255,255,0.4);font-family:var(--font-body,sans-serif);"
                    >
                      a.n. {acc.name}
                    </p>
                  </div>
                  <button
                    type="button"
                    on:click={() => copy(acc.number, i)}
                    class="ml-4 shrink-0 border px-3 py-1.5 text-[10px] tracking-widest uppercase transition active:scale-95"
                    style="
                      font-family:var(--font-heading,sans-serif);
                      border-color:{copiedIndex === i ? '#c9a84c' : 'rgba(201,168,76,0.35)'};
                      color:{copiedIndex === i ? '#c9a84c' : 'rgba(201,168,76,0.55)'};
                      background:{copiedIndex === i ? 'rgba(201,168,76,0.1)' : 'transparent'};
                    ">{copiedIndex === i ? '✓' : 'Salin'}</button
                  >
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      <!-- PHYSICAL -->
      {#if physicalGift}
        <div in:fly={{ x: -30, delay: 450, duration: 900, easing: cubicOut }}>
          <button
            type="button"
            class="flex w-full items-center justify-between border-b py-5 text-left transition hover:opacity-70"
            style="border-color:rgba(201,168,76,0.2);"
            on:click={() => (openPhysical = !openPhysical)}
          >
            <div class="flex items-center gap-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#c9a84c"
                stroke-width="1"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M20 12H4m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0V8a2 2 0 00-2-2H6a2 2 0 00-2 2v4M12 3v5m0 0l-2-2m2 2l2-2"
                />
              </svg>
              <div>
                <p
                  class="text-sm"
                  style="color:rgba(255,255,255,0.85);font-family:var(--font-heading,sans-serif);"
                >
                  Kado Fisik
                </p>
                <p
                  class="text-[10px]"
                  style="color:rgba(201,168,76,0.55);font-family:var(--font-body,sans-serif);"
                >
                  Alamat pengiriman
                </p>
              </div>
            </div>
            <div
              class="transition-transform duration-300"
              style="transform:rotate({openPhysical ? '45deg' : '0deg'});"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <line
                  x1="7"
                  y1="1"
                  x2="7"
                  y2="13"
                  stroke="#c9a84c"
                  stroke-width="1.2"
                  stroke-opacity="0.7"
                />
                <line
                  x1="1"
                  y1="7"
                  x2="13"
                  y2="7"
                  stroke="#c9a84c"
                  stroke-width="1.2"
                  stroke-opacity="0.7"
                />
              </svg>
            </div>
          </button>

          {#if openPhysical}
            <div transition:slide={{ duration: 300, easing: cubicOut }} class="py-5">
              <div class="border-l-2 pl-5" style="border-color:rgba(201,168,76,0.5);">
                <p
                  class="text-sm leading-relaxed"
                  style="color:rgba(255,255,255,0.5);font-family:var(--font-body,sans-serif);"
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
