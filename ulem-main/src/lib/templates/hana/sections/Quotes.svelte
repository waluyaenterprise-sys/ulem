<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  export let invitation: any;

  const quote: string =
    invitation.quote?.text ||
    '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."';
  const quoteSource: string = invitation.quote?.source || 'QS. Ar-Rum: 21';

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
  style="background:#f7f4f0;"
>
  <!-- Soft bg blobs -->
  <div class="pointer-events-none absolute inset-0" aria-hidden="true">
    <div
      style="position:absolute;top:-60px;right:-60px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(212,160,160,0.12),transparent 70%);"
    ></div>
    <div
      style="position:absolute;bottom:-60px;left:-60px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(143,168,156,0.1),transparent 70%);"
    ></div>
  </div>

  <div class="relative z-10 w-full max-w-xs text-center">
    <!-- Floral corner top-left -->
    <div class="absolute -top-2 -left-2" aria-hidden="true">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M5 55 Q5 5 55 5" stroke="#d4a0a0" stroke-width="0.7" fill="none" opacity="0.5" />
        <path d="M5 40 Q5 5 40 5" stroke="#d4a0a0" stroke-width="0.5" fill="none" opacity="0.35" />
        {#each [{ cx: 8, cy: 8 }, { cx: 16, cy: 6 }, { cx: 6, cy: 16 }] as b}
          <circle cx={b.cx} cy={b.cy} r="3" fill="#e8c4b8" opacity="0.7" />
          <circle cx={b.cx} cy={b.cy} r="1" fill="#d4a0a0" opacity="0.8" />
        {/each}
      </svg>
    </div>

    <!-- Floral corner bottom-right -->
    <div class="absolute -right-2 -bottom-2 rotate-180" aria-hidden="true">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M5 55 Q5 5 55 5" stroke="#8fa89c" stroke-width="0.7" fill="none" opacity="0.45" />
        <path d="M5 40 Q5 5 40 5" stroke="#8fa89c" stroke-width="0.5" fill="none" opacity="0.3" />
        {#each [{ cx: 8, cy: 8 }, { cx: 16, cy: 6 }, { cx: 6, cy: 16 }] as b}
          <circle cx={b.cx} cy={b.cy} r="3" fill="#b8cfc5" opacity="0.6" />
          <circle cx={b.cx} cy={b.cy} r="1" fill="#8fa89c" opacity="0.7" />
        {/each}
      </svg>
    </div>

    <!-- Section label -->
    <div
      style="opacity:{visible ? 1 : 0};transform:translateY({visible
        ? 0
        : -12}px);transition:opacity 700ms ease,transform 700ms ease;"
      class="mb-6"
    >
      <p
        class="text-xs tracking-[0.5em] uppercase"
        style="color:#b8a99a;font-family:var(--font-heading,serif);"
      >
        Firman & Doa
      </p>
      <div class="mx-auto mt-3 flex items-center gap-2">
        <div
          style="flex:1;height:1px;background:linear-gradient(to right,transparent,#d4a0a0 60%);"
        ></div>
        <svg width="6" height="6" viewBox="0 0 6 6"
          ><rect
            x="0.5"
            y="0.5"
            width="5"
            height="5"
            transform="rotate(45 3 3)"
            fill="none"
            stroke="#d4a0a0"
            stroke-width="0.8"
          /></svg
        >
        <div
          style="flex:1;height:1px;background:linear-gradient(to left,transparent,#d4a0a0 60%);"
        ></div>
      </div>
    </div>

    <!-- Quote text -->
    <div
      style="opacity:{visible ? 1 : 0};transform:translateY({visible
        ? 0
        : 20}px);transition:opacity 800ms 200ms ease,transform 800ms 200ms cubic-bezier(0.33,1,0.68,1);"
    >
      <p
        class="leading-relaxed italic"
        style="color:#6b5d52;font-family:var(--font-body,sans-serif);font-size:0.9rem;line-height:1.9;"
      >
        {quote}
      </p>

      <div
        class="mx-auto mt-6 mb-2"
        style="width:30px;height:1px;background:#d4a0a0;opacity:0.6;"
      ></div>

      <p
        class="text-xs tracking-widest"
        style="color:#b8a99a;font-family:var(--font-heading,serif);"
      >
        {quoteSource}
      </p>
    </div>
  </div>
</section>
