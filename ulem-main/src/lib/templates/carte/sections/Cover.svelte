<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const brideName: string = invitation.bride?.name || 'Bride';
  const coverImage: string = invitation.cover?.imageUrls?.[0] || '';
  const guestName: string = invitation.guestName || 'Tamu Undangan';

  let show = false;
  onMount(() => {
    show = true;
  });

  const dispatch = createEventDispatcher();
  function open() {
    dispatch('open');
  }
</script>

{#if show}
  <section
    in:fade={{ duration: 900 }}
    class="relative flex h-svh w-full items-center justify-center overflow-hidden"
    style="background:#faf6ef;"
  >
    <!-- Faint parchment texture overlay -->
    <div
      class="pointer-events-none absolute inset-0"
      style="background:repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(107,20,20,0.015) 28px,rgba(107,20,20,0.015) 29px);"
      aria-hidden="true"
    ></div>

    <!-- Faint cover photo tinted -->
    {#if coverImage}
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          src={coverImage}
          alt=""
          class="h-full w-full object-cover"
          style="filter:sepia(0.4) brightness(0.5) saturate(0.6);opacity:0.55;"
        />
        <div
          class="absolute inset-0"
          style="background:linear-gradient(to bottom,rgba(250,246,239,0.2) 0%,rgba(250,246,239,0.15) 50%,rgba(250,246,239,0.25) 100%);"
        ></div>
      </div>
    {/if}

    <!-- Main card — menu cover style -->
    <div
      in:fly={{ y: 24, delay: 300, duration: 900, easing: cubicOut }}
      class="relative z-10 mx-6 flex w-full max-w-xs flex-col items-center px-8 py-10"
      style="
        background:rgba(250,246,239,0.35);
        border:2px solid #6b1414;
        box-shadow:0 0 0 5px transparent, 0 0 0 7px #6b1414, 4px 8px 40px rgba(107,20,20,0.18);
      "
    >
      <!-- Corner ornaments -->
      {#each ['top-0 left-0', 'top-0 right-0 scale-x-[-1]', 'bottom-0 left-0 scale-y-[-1]', 'bottom-0 right-0 scale-x-[-1] scale-y-[-1]'] as pos}
        <svg
          class="pointer-events-none absolute {pos} -m-0.5"
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          aria-hidden="true"
        >
          <path d="M1 21 L1 1 L21 1" stroke="#6b1414" stroke-width="2" fill="none" />
          <path
            d="M5 17 L5 5 L17 5"
            stroke="#b8962e"
            stroke-width="0.8"
            fill="none"
            opacity="0.7"
          />
        </svg>
      {/each}

      <!-- Crest / logo ornament -->
      <div in:fade={{ delay: 500, duration: 600 }} class="mb-5">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="16" stroke="#6b1414" stroke-width="0.8" opacity="0.4" />
          <circle cx="24" cy="24" r="11" stroke="#b8962e" stroke-width="0.6" opacity="0.5" />
          <!-- stylised fleur / heart -->
          <path
            d="M24 14 C18 14 14 18 14 22 C14 28 24 34 24 34 C24 34 34 28 34 22 C34 18 30 14 24 14Z"
            fill="none"
            stroke="#6b1414"
            stroke-width="0.9"
            opacity="0.6"
          />
          <circle cx="24" cy="22" r="2.5" fill="#b8962e" opacity="0.7" />
        </svg>
      </div>

      <!-- Establishment label -->
      <p
        in:fly={{ y: -8, delay: 400, duration: 600, easing: cubicOut }}
        class="mb-4 text-center text-xs tracking-[0.55em] uppercase"
        style="color:#8b1a1a;font-family:var(--font-heading,serif);"
      >
        Undangan Pernikahan
      </p>

      <!-- Gold divider -->
      <div in:fade={{ delay: 500, duration: 500 }} class="mb-6 flex w-full items-center gap-2">
        <div
          style="flex:1;height:1px;background:linear-gradient(to right,transparent,#b8962e);"
        ></div>
        <svg width="8" height="8" viewBox="0 0 8 8">
          <rect
            x="1"
            y="1"
            width="6"
            height="6"
            transform="rotate(45 4 4)"
            fill="#b8962e"
            opacity="0.8"
          />
        </svg>
        <div
          style="flex:1;height:1px;background:linear-gradient(to left,transparent,#b8962e);"
        ></div>
      </div>

      <!-- Names -->
      <div in:fade={{ delay: 650, duration: 700 }} class="w-full text-center">
        <p
          class="text-4xl leading-tight"
          style="color:#2a1010;font-family:var(--font-script,cursive);"
        >
          {brideName}
        </p>
        <p
          class="my-2 text-xs tracking-[0.6em] uppercase"
          style="color:#b8962e;font-family:var(--font-heading,serif);"
        >
          &amp;
        </p>
        <p
          class="text-4xl leading-tight"
          style="color:#2a1010;font-family:var(--font-script,cursive);"
        >
          {groomName}
        </p>
      </div>

      <!-- Gold divider bottom -->
      <div in:fade={{ delay: 750, duration: 500 }} class="my-6 flex w-full items-center gap-2">
        <div
          style="flex:1;height:1px;background:linear-gradient(to right,transparent,#b8962e);"
        ></div>
        <svg width="6" height="6" viewBox="0 0 6 6">
          <circle cx="3" cy="3" r="2" fill="none" stroke="#b8962e" stroke-width="0.8" />
        </svg>
        <div
          style="flex:1;height:1px;background:linear-gradient(to left,transparent,#b8962e);"
        ></div>
      </div>

      <!-- Guest name -->
      <div in:fade={{ delay: 800, duration: 600 }} class="text-center">
        <p
          class="mb-1 text-xs tracking-[0.4em] uppercase"
          style="color:#8b1a1a;font-family:var(--font-heading,serif);"
        >
          Kepada Yth.
        </p>
        <p class="text-base" style="color:#2a1010;font-family:var(--font-script,cursive);">
          {guestName}
        </p>
      </div>

      <!-- Open button -->
      <button
        in:fly={{ y: 16, delay: 950, duration: 700, easing: cubicOut }}
        onclick={open}
        class="mt-8 w-full py-3 text-xs tracking-[0.55em] uppercase transition-all duration-300"
        style="background:#6b1414;color:#f5ede0;font-family:var(--font-heading,serif);letter-spacing:0.3em;border:1px solid #b8962e;"
        onmouseenter={(e) => {
          (e.currentTarget as HTMLElement).style.background = '#8b1a1a';
        }}
        onmouseleave={(e) => {
          (e.currentTarget as HTMLElement).style.background = '#6b1414';
        }}
      >
        Buka Undangan
      </button>
    </div>
  </section>
{/if}
