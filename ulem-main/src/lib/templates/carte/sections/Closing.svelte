<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import Credit from '$lib/Credit.svelte';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const brideName: string = invitation.bride?.name || 'Bride';
  const closingImage: string =
    invitation.closing?.imageUrls?.[0] || invitation.cover?.imageUrls?.[0] || '';
  const closingMessage: string = invitation.closing?.message || '';

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

<section
  bind:this={el}
  class="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-8 py-20"
  style="background:#3d0a0a;"
>
  <!-- Faint closing photo -->
  {#if closingImage}
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <img
        src={closingImage}
        alt=""
        class="h-full w-full object-cover"
        style="filter:sepia(0.6) brightness(0.35) saturate(0.5);opacity:0.35;"
      />
      <div
        class="absolute inset-0"
        style="background:linear-gradient(to bottom,rgba(61,10,10,0.7),rgba(61,10,10,0.5),rgba(61,10,10,0.8));"
      ></div>
    </div>
  {/if}

  <!-- Warm center glow -->
  <div
    class="pointer-events-none absolute inset-0 flex items-center justify-center"
    aria-hidden="true"
  >
    <div
      style="width:350px;height:350px;border-radius:50%;background:radial-gradient(circle,rgba(184,150,46,0.1) 0%,transparent 70%);"
    ></div>
  </div>

  <div class="relative z-10 w-full max-w-xs text-center">
    <!-- Outer frame -->
    <div
      class="relative px-8 py-12"
      style="border:1px solid rgba(184,150,46,0.35);box-shadow:0 0 0 4px rgba(61,10,10,0.8),0 0 0 5px rgba(184,150,46,0.25);"
    >
      <!-- Corner ornaments -->
      {#each ['top-0 left-0', 'top-0 right-0 scale-x-[-1]', 'bottom-0 left-0 scale-y-[-1]', 'bottom-0 right-0 scale-x-[-1] scale-y-[-1]'] as pos}
        <div class="pointer-events-none absolute {pos} p-1" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 13 L1 1 L13 1"
              stroke="#b8962e"
              stroke-width="1"
              fill="none"
              opacity="0.55"
            />
          </svg>
        </div>
      {/each}

      {#if visible}
        <!-- Thank you label -->
        <p
          in:fly={{ y: -10, delay: 100, duration: 700, easing: cubicOut }}
          class="mb-4 text-xs tracking-[0.6em] uppercase"
          style="color:rgba(184,150,46,0.7);font-family:var(--font-heading,serif);"
        >
          Terima Kasih
        </p>

        <!-- Gold divider -->
        <div in:fade={{ delay: 250, duration: 600 }} class="mb-7 flex items-center gap-2">
          <div style="flex:1;height:1px;background:#b8962e;opacity:0.4;"></div>
          <svg width="7" height="7" viewBox="0 0 7 7">
            <rect
              x="0.5"
              y="0.5"
              width="6"
              height="6"
              transform="rotate(45 3.5 3.5)"
              fill="#b8962e"
              opacity="0.7"
            />
          </svg>
          <div style="flex:1;height:1px;background:#b8962e;opacity:0.4;"></div>
        </div>

        <!-- Names -->
        <div in:fly={{ y: 16, delay: 350, duration: 800, easing: cubicOut }}>
          <p
            class="text-4xl leading-tight"
            style="color:#f5ede0;font-family:var(--font-script,cursive);"
          >
            {groomName}
          </p>
          <p
            class="my-3 text-xs tracking-[0.6em]"
            style="color:rgba(184,150,46,0.6);font-family:var(--font-heading,serif);"
          >
            &amp;
          </p>
          <p
            class="text-4xl leading-tight"
            style="color:#f5ede0;font-family:var(--font-script,cursive);"
          >
            {brideName}
          </p>
        </div>

        <!-- Closing message or default -->
        <p
          in:fade={{ delay: 600, duration: 700 }}
          class="mx-auto mt-8 max-w-55 text-xs leading-loose"
          style="color:rgba(245,237,224,0.65);font-family:var(--font-body,sans-serif);"
        >
          {closingMessage ||
            'Mohon doa restu agar kami senantiasa diberikan kebahagiaan, keberkahan, dan cinta yang abadi.'}
        </p>

        <!-- Bottom divider -->
        <div
          in:fade={{ delay: 700, duration: 600 }}
          class="mx-auto mt-8 flex items-center gap-2"
          style="width:120px;"
        >
          <div style="flex:1;height:1px;background:#b8962e;opacity:0.35;"></div>
          <svg width="6" height="6" viewBox="0 0 6 6">
            <circle
              cx="3"
              cy="3"
              r="2"
              fill="none"
              stroke="#b8962e"
              stroke-width="0.7"
              opacity="0.6"
            />
          </svg>
          <div style="flex:1;height:1px;background:#b8962e;opacity:0.35;"></div>
        </div>
      {/if}
    </div>
    <div class="mt-8">
      <Credit />
    </div>
  </div>
</section>
