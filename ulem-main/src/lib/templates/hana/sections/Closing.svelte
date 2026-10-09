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
  const closingMessage: string = invitation.closing?.message || 'Mohon doa restu agar kami senantiasa diberikan kebahagiaan, keberkahan, dan cinta yang abadi.';

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
  style="background:#faf8f5;"
>
  <!-- Faint bg photo -->
  {#if closingImage}
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <img
        src={closingImage}
        alt=""
        class="h-full w-full object-cover"
        style="filter:brightness(0.94) saturate(0.7) opacity(0.18);"
      />
    </div>
  {/if}

  <!-- Top floral -->
  <div
    class="pointer-events-none absolute top-0 right-0 left-0 flex justify-center pt-6"
    aria-hidden="true"
  >
    <svg width="220" height="60" viewBox="0 0 220 60" fill="none">
      <line x1="110" y1="0" x2="110" y2="48" stroke="#d4a0a0" stroke-width="0.7" opacity="0.5" />
      <line x1="30" y1="48" x2="190" y2="48" stroke="#d4a0a0" stroke-width="0.5" opacity="0.4" />
      <rect
        x="107"
        y="45"
        width="6"
        height="6"
        transform="rotate(45 110 48)"
        fill="#d4a0a0"
        opacity="0.5"
      />
      <line x1="110" y1="20" x2="70" y2="38" stroke="#d4a0a0" stroke-width="0.5" opacity="0.4" />
      <line x1="110" y1="30" x2="85" y2="42" stroke="#d4a0a0" stroke-width="0.5" opacity="0.3" />
      <line x1="110" y1="20" x2="150" y2="38" stroke="#d4a0a0" stroke-width="0.5" opacity="0.4" />
      <line x1="110" y1="30" x2="135" y2="42" stroke="#d4a0a0" stroke-width="0.5" opacity="0.3" />
      {#each [{ cx: 68, cy: 36 }, { cx: 82, cy: 30 }, { cx: 60, cy: 44 }, { cx: 152, cy: 36 }, { cx: 138, cy: 30 }, { cx: 160, cy: 44 }, { cx: 110, cy: 10 }] as b}
        <circle cx={b.cx} cy={b.cy} r="3.5" fill="#e8c4b8" opacity="0.6" />
        <circle cx={b.cx} cy={b.cy} r="1.2" fill="#d4a0a0" opacity="0.7" />
      {/each}
    </svg>
  </div>

  <div class="relative z-10 w-full max-w-xs text-center">
    {#if visible}
      <!-- Thank you label -->
      <p
        in:fly={{ y: -10, delay: 100, duration: 700, easing: cubicOut }}
        class="mb-3 text-xs tracking-[0.6em] uppercase"
        style="color:#b8a99a;font-family:var(--font-heading,serif);"
      >
        Terima Kasih
      </p>

      <!-- Divider -->
      <div in:fade={{ delay: 250, duration: 600 }} class="mb-6 flex items-center gap-3">
        <div
          style="flex:1;height:1px;background:linear-gradient(to right,transparent,#d4a0a0);"
        ></div>
        <svg width="8" height="8" viewBox="0 0 8 8"
          ><rect
            x="0.5"
            y="0.5"
            width="7"
            height="7"
            transform="rotate(45 4 4)"
            fill="none"
            stroke="#d4a0a0"
            stroke-width="0.8"
          /></svg
        >
        <div
          style="flex:1;height:1px;background:linear-gradient(to left,transparent,#d4a0a0);"
        ></div>
      </div>

      <!-- Names -->
      <div in:fly={{ y: 16, delay: 350, duration: 800, easing: cubicOut }}>
        <p
          class="text-4xl leading-tight"
          style="color:#4a3f35;font-family:var(--font-script,cursive);"
        >
          {groomName}
        </p>
        <p
          class="my-2 text-sm tracking-[0.4em]"
          style="color:#c4a97e;font-family:var(--font-heading,serif);"
        >
          &amp;
        </p>
        <p
          class="text-4xl leading-tight"
          style="color:#4a3f35;font-family:var(--font-script,cursive);"
        >
          {brideName}
        </p>
      </div>

      <!-- Message -->
      <p
        in:fade={{ delay: 600, duration: 700 }}
        class="mx-auto mt-8 max-w-55 text-xs leading-loose"
        style="color:#9a8a7e;font-family:var(--font-body,sans-serif);"
      >
        {closingMessage}
      </p>

      <!-- Floral divider bottom -->
      <div
        in:fade={{ delay: 700, duration: 600 }}
        class="mx-auto mt-8 flex items-center gap-2"
        style="width:160px;"
      >
        <div
          style="flex:1;height:1px;background:linear-gradient(to right,transparent,#8fa89c 60%);"
        ></div>
        <svg width="6" height="6" viewBox="0 0 6 6"
          ><rect
            x="0.5"
            y="0.5"
            width="5"
            height="5"
            transform="rotate(45 3 3)"
            fill="none"
            stroke="#8fa89c"
            stroke-width="0.8"
          /></svg
        >
        <div
          style="flex:1;height:1px;background:linear-gradient(to left,transparent,#8fa89c 60%);"
        ></div>
      </div>

      <!-- Credit -->
      <div class="mt-8">
        <Credit />
      </div>
    {/if}
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
      <line x1="110" y1="20" x2="150" y2="38" stroke="#8fa89c" stroke-width="0.5" opacity="0.35" />
      <line x1="110" y1="30" x2="135" y2="42" stroke="#8fa89c" stroke-width="0.5" opacity="0.25" />
      {#each [{ cx: 68, cy: 36 }, { cx: 82, cy: 30 }, { cx: 60, cy: 44 }, { cx: 152, cy: 36 }, { cx: 138, cy: 30 }, { cx: 160, cy: 44 }, { cx: 110, cy: 10 }] as b}
        <circle cx={b.cx} cy={b.cy} r="3.5" fill="#b8cfc5" opacity="0.5" />
        <circle cx={b.cx} cy={b.cy} r="1.2" fill="#8fa89c" opacity="0.6" />
      {/each}
    </svg>
  </div>
</section>
