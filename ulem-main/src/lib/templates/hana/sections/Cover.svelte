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
    style="background:#faf8f5;"
  >
    <!-- Faint 청첩장 watermark -->
    <div
      class="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <span
        class="text-[120px] font-bold tracking-widest select-none"
        style="color:rgba(180,158,140,0.06);font-family:var(--font-heading,serif);writing-mode:vertical-rl;transform:rotate(180deg);"
        >청첩장</span
      >
    </div>

    <!-- Top floral decoration -->
    <div
      class="pointer-events-none absolute top-0 right-0 left-0 flex justify-center pt-6"
      aria-hidden="true"
    >
      <svg width="220" height="60" viewBox="0 0 220 60" fill="none">
        <!-- center stem -->
        <line x1="110" y1="0" x2="110" y2="48" stroke="#d4a0a0" stroke-width="0.7" opacity="0.5" />
        <!-- horizontal line -->
        <line x1="30" y1="48" x2="190" y2="48" stroke="#d4a0a0" stroke-width="0.5" opacity="0.4" />
        <!-- small diamond center -->
        <rect
          x="107"
          y="45"
          width="6"
          height="6"
          transform="rotate(45 110 48)"
          fill="#d4a0a0"
          opacity="0.5"
        />
        <!-- left branch -->
        <line x1="110" y1="20" x2="70" y2="38" stroke="#d4a0a0" stroke-width="0.5" opacity="0.4" />
        <line x1="110" y1="30" x2="85" y2="42" stroke="#d4a0a0" stroke-width="0.5" opacity="0.3" />
        <!-- right branch -->
        <line x1="110" y1="20" x2="150" y2="38" stroke="#d4a0a0" stroke-width="0.5" opacity="0.4" />
        <line x1="110" y1="30" x2="135" y2="42" stroke="#d4a0a0" stroke-width="0.5" opacity="0.3" />
        <!-- blossoms -->
        {#each [{ cx: 68, cy: 36 }, { cx: 82, cy: 30 }, { cx: 60, cy: 44 }, { cx: 152, cy: 36 }, { cx: 138, cy: 30 }, { cx: 160, cy: 44 }, { cx: 110, cy: 10 }] as b}
          <circle cx={b.cx} cy={b.cy} r="3.5" fill="#e8c4b8" opacity="0.6" />
          <circle cx={b.cx} cy={b.cy} r="1.2" fill="#d4a0a0" opacity="0.7" />
        {/each}
      </svg>
    </div>

    <!-- Main content -->
    <div class="relative z-10 flex w-full max-w-xs flex-col items-center px-6 text-center">
      <!-- 청첩장 label -->
      <p
        in:fly={{ y: -10, delay: 300, duration: 700, easing: cubicOut }}
        class="mb-4 text-xs tracking-[0.6em] uppercase"
        style="color:#b8a99a;font-family:var(--font-heading,serif);"
      >
        청첩장
      </p>

      <!-- Thin divider -->
      <div in:fade={{ delay: 400, duration: 600 }} class="mb-6 flex items-center gap-3">
        <div
          style="width:40px;height:1px;background:linear-gradient(to right,transparent,#d4a0a0);"
        ></div>
        <svg width="8" height="8" viewBox="0 0 8 8"
          ><rect
            x="1"
            y="1"
            width="6"
            height="6"
            transform="rotate(45 4 4)"
            fill="none"
            stroke="#d4a0a0"
            stroke-width="0.8"
          /></svg
        >
        <div
          style="width:40px;height:1px;background:linear-gradient(to left,transparent,#d4a0a0);"
        ></div>
      </div>

      <!-- Cover photo -->
      {#if coverImage}
        <div
          in:fade={{ delay: 500, duration: 800 }}
          class="mb-6 w-full overflow-hidden"
          style="height:200px;border:1px solid #e8ddd5;box-shadow:0 8px 30px rgba(180,150,130,0.15);"
        >
          <img
            src={coverImage}
            alt="Cover"
            class="h-full w-full object-cover"
            style="filter:brightness(0.95) saturate(0.9);"
          />
        </div>
      {/if}

      <!-- Wedding of label -->
      <p
        in:fade={{ delay: 600, duration: 700 }}
        class="mb-2 text-xs tracking-[0.4em] uppercase"
        style="color:#b8a99a;font-family:var(--font-heading,serif);"
      >
        The Wedding of
      </p>

      <!-- Names -->
      <div in:fly={{ y: 14, delay: 700, duration: 800, easing: cubicOut }}>
        <p
          class="text-3xl"
          style="color:#4a3f35;font-family:var(--font-script,cursive);line-height:1.25;"
        >
          {brideName}
        </p>
        <p
          class="my-1.5 text-xs tracking-[0.4em] uppercase"
          style="color:#c4a97e;font-family:var(--font-heading,serif);"
        >
          &amp;
        </p>
        <p
          class="text-3xl"
          style="color:#4a3f35;font-family:var(--font-script,cursive);line-height:1.25;"
        >
          {groomName}
        </p>
      </div>

      <!-- Guest name -->
      <div
        in:fade={{ delay: 900, duration: 600 }}
        class="mt-6 w-full border-t pt-4"
        style="border-color:#e8ddd5;"
      >
        <p
          class="text-xs tracking-[0.35em] uppercase"
          style="color:#b8a99a;font-family:var(--font-heading,serif);"
        >
          Kepada Yth.
        </p>
        <p
          class="mt-1 text-sm tracking-wide"
          style="color:#7a6b5e;font-family:var(--font-heading,serif);"
        >
          {guestName}
        </p>
      </div>

      <!-- CTA button -->
      <button
        in:fly={{ y: 12, delay: 1050, duration: 700, easing: cubicOut }}
        onclick={open}
        class="mt-6 px-10 py-3 text-xs tracking-[0.5em] uppercase transition-all duration-300"
        style="border:1px solid #d4a0a0;color:#d4a0a0;background:transparent;font-family:var(--font-heading,serif);"
        onmouseenter={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,160,0.08)';
        }}
        onmouseleave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'transparent';
        }}
      >
        Buka Undangan
      </button>
    </div>

    <!-- Bottom floral -->
    <div
      class="pointer-events-none absolute right-0 bottom-0 left-0 flex rotate-180 justify-center pb-6"
      aria-hidden="true"
    >
      <svg width="220" height="60" viewBox="0 0 220 60" fill="none">
        <line x1="110" y1="0" x2="110" y2="48" stroke="#8fa89c" stroke-width="0.7" opacity="0.4" />
        <line x1="30" y1="48" x2="190" y2="48" stroke="#8fa89c" stroke-width="0.5" opacity="0.35" />
        <rect
          x="107"
          y="45"
          width="6"
          height="6"
          transform="rotate(45 110 48)"
          fill="#8fa89c"
          opacity="0.4"
        />
        <line x1="110" y1="20" x2="70" y2="38" stroke="#8fa89c" stroke-width="0.5" opacity="0.35" />
        <line x1="110" y1="30" x2="85" y2="42" stroke="#8fa89c" stroke-width="0.5" opacity="0.25" />
        <line
          x1="110"
          y1="20"
          x2="150"
          y2="38"
          stroke="#8fa89c"
          stroke-width="0.5"
          opacity="0.35"
        />
        <line
          x1="110"
          y1="30"
          x2="135"
          y2="42"
          stroke="#8fa89c"
          stroke-width="0.5"
          opacity="0.25"
        />
        {#each [{ cx: 68, cy: 36 }, { cx: 82, cy: 30 }, { cx: 60, cy: 44 }, { cx: 152, cy: 36 }, { cx: 138, cy: 30 }, { cx: 160, cy: 44 }, { cx: 110, cy: 10 }] as b}
          <circle cx={b.cx} cy={b.cy} r="3.5" fill="#b8cfc5" opacity="0.5" />
          <circle cx={b.cx} cy={b.cy} r="1.2" fill="#8fa89c" opacity="0.6" />
        {/each}
      </svg>
    </div>
  </section>
{/if}
