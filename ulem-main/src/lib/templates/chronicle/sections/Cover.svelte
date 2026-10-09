<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';

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

  // CSS animation-delay stagger (no JS reactivity needed)
  function s(delayMs: number) {
    return `animation: coverFadeUp 0.6s cubic-bezier(0.33,1,0.68,1) ${delayMs}ms both;`;
  }
</script>

{#if show}
  <section
    in:fade={{ duration: 600 }}
    class="relative flex h-svh w-full flex-col overflow-hidden"
    style="background:#0d1829;"
  >
    <!-- Background photo — top half -->
    {#if coverImage}
      <div class="absolute inset-0" aria-hidden="true">
        <img
          src={coverImage}
          alt=""
          class="h-full w-full object-cover"
          style="opacity:0.40;filter:grayscale(0.6) brightness(0.7);"
        />
        <div
          class="absolute inset-0"
          style="background:linear-gradient(to bottom,rgba(13,24,41,0.25) 0%,rgba(13,24,41,0.4) 40%,rgba(13,24,41,0.7) 100%);"
        ></div>
      </div>
    {/if}

    <!-- Top bar — chapter indicator -->
    <div class="relative z-10 flex items-center gap-3 px-6 pt-10">
      <div style="width:28px;height:2px;background:#2c3e6b;"></div>
      <span
        class="text-xs tracking-[0.55em] uppercase"
        style="color:#2c3e6b;font-family:var(--font-heading,sans-serif);">Chapter 00</span
      >
    </div>

    <!-- Main content -->
    <div class="relative z-10 flex flex-1 flex-col justify-center px-6 pb-10">
      <!-- Ghost chapter number -->
      <div class="pointer-events-none absolute top-0 right-0" aria-hidden="true">
        <span
          style="font-size:clamp(120px,40vw,200px);font-family:var(--font-heading,sans-serif);font-weight:900;color:rgba(44,60,107,0.06);line-height:1;user-select:none;"
          >00</span
        >
      </div>

      <!-- Label -->
      <div style={s(300)} class="mb-4">
        <span
          class="inline-block px-3 py-1 text-xs tracking-[0.5em] uppercase"
          style="background:rgba(44,60,107,0.15);color:#6e80a8;border:1px solid rgba(44,60,107,0.3);font-family:var(--font-heading,sans-serif);"
          >Undangan Pernikahan</span
        >
      </div>

      <!-- Names -->
      <div style={s(500)} class="mb-2">
        <p
          class="leading-none"
          style="font-size:clamp(2.4rem,10vw,3.5rem);font-family:var(--font-script,cursive);color:#f0f4ff;"
        >
          {brideName}
        </p>
      </div>

      <!-- Connector line + ampersand -->
      <div style={s(700)} class="mb-2 flex items-center gap-3">
        <div
          style="width:32px;height:1px;background:linear-gradient(to right,#c4754a,#2c3e6b);"
        ></div>
        <span
          class="text-xs tracking-[0.6em]"
          style="color:#c4754a;font-family:var(--font-heading,sans-serif);">&amp;</span
        >
        <div
          style="width:32px;height:1px;background:linear-gradient(to left,#c4754a,#2c3e6b);"
        ></div>
      </div>

      <div style={s(750)} class="mb-8">
        <p
          class="leading-none"
          style="font-size:clamp(2.4rem,10vw,3.5rem);font-family:var(--font-script,cursive);color:#f0f4ff;"
        >
          {groomName}
        </p>
      </div>

      <!-- Guest tag -->
      <div style={s(900)} class="mb-6 flex items-start gap-3">
        <div style="width:3px;height:100%;min-height:36px;background:#2c3e6b;flex-shrink:0;"></div>
        <div>
          <p
            class="text-xs tracking-widest uppercase"
            style="color:#64748b;font-family:var(--font-heading,sans-serif);"
          >
            Kepada Yth.
          </p>
          <p
            class="mt-0.5 text-base"
            style="color:#cbd5e1;font-family:var(--font-body,sans-serif);"
          >
            {guestName}
          </p>
        </div>
      </div>

      <!-- Open button -->
      <div style={s(950)}>
        <button
          onclick={open}
          class="group flex items-center gap-3 text-sm tracking-[0.3em] uppercase transition-all duration-300"
          style="font-family:var(--font-heading,sans-serif);"
          onmouseenter={(e) => {
            const box = (e.currentTarget as HTMLElement).querySelector(
              '.btn-box'
            ) as HTMLElement | null;
            if (box) box.style.background = '#1e2a50';
          }}
          onmouseleave={(e) => {
            const box = (e.currentTarget as HTMLElement).querySelector(
              '.btn-box'
            ) as HTMLElement | null;
            if (box) box.style.background = '#2c3e6b';
          }}
        >
          <span
            class="btn-box flex h-10 w-10 items-center justify-center transition-all duration-300"
            style="background:#2c3e6b;color:#fff;"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7 L12 7 M8 3 L12 7 L8 11"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span style="color:#94a3b8;">Buka Undangan</span>
        </button>
      </div>
    </div>

    <!-- Bottom progress strip -->
    <div class="relative z-10 flex h-1 w-full overflow-hidden" style={s(1000)}>
      <div style="flex:1;background:#2c3e6b;"></div>
      <div style="flex:1;background:#4a5c8a;"></div>
      <div style="flex:1;background:#6e80a8;"></div>
      <div style="flex:1;background:#c4754a;"></div>
      <div style="flex:1;background:#d98a6a;"></div>
    </div>
  </section>
{/if}

<style>
  @keyframes coverFadeUp {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
