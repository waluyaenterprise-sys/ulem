<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let invitation: any;

  const gifts: any[] = invitation?.gifts || [];
  let openIdx: number | null = null;
  let copied = '';

  function toggle(i: number) {
    openIdx = openIdx === i ? null : i;
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      copied = text;
      setTimeout(() => (copied = ''), 2000);
    } catch {}
  }

  let visible = false;
  let sectionEl: HTMLElement;
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
    if (sectionEl) observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section bind:this={sectionEl} class="w-full px-5 py-16" style="background:#0d1b2a;">
  {#if visible}
    <!-- Section header -->
    <div in:fade={{ duration: 600 }} class="mb-10 text-center">
      <p
        class="text-xs tracking-[0.55em] uppercase"
        style="color:rgba(201,168,76,0.5);font-family:var(--font-heading,serif);"
      >
        Customs
      </p>
      <p
        class="mt-2 text-sm tracking-[0.45em] uppercase"
        style="color:#c9a84c;font-family:var(--font-heading,serif);"
      >
        Declaration Form
      </p>
      <div style="width:40px;height:1px;background:rgba(201,168,76,0.4);margin:10px auto 0;"></div>
    </div>

    <!-- Declaration card -->
    <div
      in:fly={{ y: 20, delay: 200, duration: 700, easing: cubicOut }}
      class="mx-auto"
      style="max-width:360px;"
    >
      <div style="background:#0f2035;border:1px solid rgba(201,168,76,0.22);">
        <!-- Top band -->
        <div style="height:3px;background:linear-gradient(to right,#c9a84c,#e8d08a,#c9a84c);"></div>

        <!-- Header -->
        <div class="px-5 py-4" style="border-bottom:1px solid rgba(201,168,76,0.12);">
          <div class="flex items-start gap-3">
            <svg width="28" height="28" viewBox="0 0 28 28" style="flex-shrink:0;margin-top:2px;">
              <rect
                x="2"
                y="2"
                width="24"
                height="24"
                rx="2"
                fill="none"
                stroke="#c9a84c"
                stroke-width="0.8"
                opacity="0.4"
              />
              <path
                d="M7 10 L14 6 L21 10 L21 18 L14 22 L7 18 Z"
                fill="none"
                stroke="#c9a84c"
                stroke-width="0.7"
                opacity="0.35"
              />
              <circle
                cx="14"
                cy="14"
                r="2.5"
                fill="none"
                stroke="#c9a84c"
                stroke-width="0.7"
                opacity="0.3"
              />
            </svg>
            <div>
              <p
                class="text-xs tracking-[0.3em] uppercase"
                style="color:rgba(201,168,76,0.5);font-family:var(--font-heading,serif);"
              >
                Wedding Customs Declaration
              </p>
              <p
                class="mt-1 text-xs leading-relaxed"
                style="color:rgba(228,216,180,0.6);font-family:var(--font-heading,serif);"
              >
                Hadiah atau doa yang Anda bawa sangat kami syukuri. Terima kasih telah hadir dalam
                perjalanan kami.
              </p>
            </div>
          </div>
        </div>

        <!-- Gift items -->
        <div>
          {#each gifts as gift, i}
            <div
              style="border-bottom:{i < gifts.length - 1
                ? '1px solid rgba(201,168,76,0.1)'
                : 'none'};"
            >
              <!-- Row -->
              <button
                type="button"
                on:click={() => toggle(i)}
                class="flex w-full items-center justify-between px-5 py-4 text-left transition-colors duration-200"
                style="background:{openIdx === i ? 'rgba(201,168,76,0.05)' : 'transparent'};"
              >
                <div class="flex items-center gap-3">
                  <!-- Checkbox style indicator -->
                  <div
                    style="
                    width:14px;height:14px;flex-shrink:0;
                    border:1px solid rgba(201,168,76,{openIdx === i ? 0.6 : 0.25});
                    background:{openIdx === i ? 'rgba(201,168,76,0.15)' : 'transparent'};
                    display:flex;align-items:center;justify-content:center;
                  "
                  >
                    {#if openIdx === i}
                      <span style="color:#c9a84c;font-size:8px;line-height:1;">✓</span>
                    {/if}
                  </div>
                  <div>
                    <p
                      class="text-xs tracking-[0.3em] uppercase"
                      style="color:rgba(201,168,76,0.35);font-family:var(--font-heading,serif);"
                    >
                      Item {String(i + 1).padStart(2, '0')}
                    </p>
                    <p
                      class="mt-0.5 text-sm"
                      style="color:rgba(228,216,180,0.85);font-family:var(--font-heading,serif);"
                    >
                      {gift.type === 'bank' ? gift.name || 'Bank Transfer' : 'Physical Gift'}
                    </p>
                  </div>
                </div>
                <!-- Toggle icon -->
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  style="transform:rotate({openIdx === i
                    ? 45
                    : 0}deg);transition:transform 0.3s;flex-shrink:0;"
                >
                  <line
                    x1="6"
                    y1="1"
                    x2="6"
                    y2="11"
                    stroke="#c9a84c"
                    stroke-width="1.2"
                    opacity="0.5"
                  />
                  <line
                    x1="1"
                    y1="6"
                    x2="11"
                    y2="6"
                    stroke="#c9a84c"
                    stroke-width="1.2"
                    opacity="0.5"
                  />
                </svg>
              </button>

              <!-- Expanded detail -->
              {#if openIdx === i}
                <div
                  in:fly={{ y: -8, duration: 300, easing: cubicOut }}
                  class="px-5 pb-5"
                  style="border-top:1px dashed rgba(201,168,76,0.12);"
                >
                  {#if gift.type === 'bank'}
                    <div class="flex flex-col gap-3 pt-4">
                      <div>
                        <p
                          class="mb-1 text-sm tracking-[0.3em] uppercase"
                          style="color:rgba(201,168,76,0.35);font-family:var(--font-heading,serif);"
                        >
                          Bank
                        </p>
                        <p
                          class="text-sm"
                          style="color:rgba(228,216,180,0.8);font-family:var(--font-heading,serif);"
                        >
                          {gift.name}
                        </p>
                      </div>
                      <div>
                        <p
                          class="mb-1 text-sm tracking-[0.3em] uppercase"
                          style="color:rgba(201,168,76,0.35);font-family:var(--font-heading,serif);"
                        >
                          Account Holder
                        </p>
                        <p
                          class="text-sm"
                          style="color:rgba(228,216,180,0.8);font-family:var(--font-heading,serif);"
                        >
                          {gift.accountHolder}
                        </p>
                      </div>
                      <div>
                        <p
                          class="mb-1 text-sm tracking-[0.3em] uppercase"
                          style="color:rgba(201,168,76,0.35);font-family:var(--font-heading,serif);"
                        >
                          Account Number
                        </p>
                        <div class="flex items-center gap-2">
                          <p
                            class="text-base tracking-wider"
                            style="color:#c9a84c;font-family:monospace;"
                          >
                            {gift.accountNumber}
                          </p>
                          <button
                            type="button"
                            on:click={() => copy(gift.accountNumber)}
                            class="px-2 py-0.5 text-sm tracking-[0.2em] uppercase transition-all duration-200"
                            style="
                              border:1px solid rgba(201,168,76,0.3);
                              color:{copied === gift.accountNumber
                              ? '#6b8c6b'
                              : 'rgba(201,168,76,0.55)'};
                              font-family:var(--font-heading,serif);
                            "
                          >
                            {copied === gift.accountNumber ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </div>
                  {:else}
                    <div class="pt-4">
                      <p
                        class="mb-1 text-sm tracking-[0.3em] uppercase"
                        style="color:rgba(201,168,76,0.35);font-family:var(--font-heading,serif);"
                      >
                        Delivery Address / Info
                      </p>
                      <p
                        class="text-xs leading-relaxed"
                        style="color:rgba(228,216,180,0.75);font-family:var(--font-heading,serif);"
                      >
                        {gift.description}
                      </p>
                    </div>
                  {/if}
                </div>
              {/if}
            </div>
          {/each}
        </div>

        <!-- Footer stamp -->
        <div
          class="flex items-center justify-between px-5 py-3"
          style="background:rgba(201,168,76,0.03);border-top:1px solid rgba(201,168,76,0.12);"
        >
          <p
            class="text-sm tracking-[0.25em] uppercase"
            style="color:rgba(201,168,76,0.25);font-family:var(--font-heading,serif);"
          >
            Customs Cleared
          </p>
          <svg width="28" height="14" viewBox="0 0 28 14">
            <rect
              x="1"
              y="1"
              width="26"
              height="12"
              rx="1"
              fill="none"
              stroke="rgba(201,168,76,0.2)"
              stroke-width="0.7"
            />
            <text
              x="14"
              y="9.5"
              text-anchor="middle"
              font-size="5"
              fill="rgba(201,168,76,0.2)"
              font-family="serif"
              letter-spacing="1"
            >
              APPROVED
            </text>
          </svg>
        </div>

        <!-- Bottom band -->
        <div
          style="height:2px;background:linear-gradient(to right,transparent,rgba(201,168,76,0.3),transparent);"
        ></div>
      </div>
    </div>
  {/if}
</section>
