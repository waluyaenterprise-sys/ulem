<script lang="ts">
  import { onMount } from 'svelte';

  export let invitation: any;

  const quote: string =
    invitation.quote?.text ||
    '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."';
  const quoteSource: string = invitation.quote?.source || 'QS. Ar-Rum: 21';

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
      { threshold: 0.1 }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  });
</script>

<section
  bind:this={el}
  class="relative w-full overflow-hidden px-6 py-24"
  style="background:#f0f4ff;"
>
  <!-- Chapter tag -->
  <div
    class="mb-8 flex items-center gap-3"
    style="opacity:{visible ? 1 : 0};transform:translateX({visible
      ? 0
      : -16}px);transition:opacity 600ms ease,transform 600ms ease;"
  >
    <div style="width:3px;height:32px;background:#2c3e6b;flex-shrink:0;"></div>
    <div>
      <p
        class="text-xs tracking-[0.55em] uppercase"
        style="color:#2c3e6b;font-family:var(--font-heading,sans-serif);"
      >
        Chapter 01
      </p>
      <p
        class="text-lg font-bold"
        style="color:#0d1829;font-family:var(--font-heading,sans-serif);letter-spacing:-0.02em;"
      >
        Firman &amp; Doa
      </p>
    </div>
    <!-- Ghost number -->
    <div class="ml-auto" aria-hidden="true">
      <span
        style="font-size:80px;font-weight:900;color:rgba(44,60,107,0.06);font-family:var(--font-heading,sans-serif);line-height:1;user-select:none;"
        >01</span
      >
    </div>
  </div>

  <!-- Quote card -->
  <div
    class="relative overflow-hidden"
    style="
      background:#0d1829;
      opacity:{visible ? 1 : 0};
      transform:translateY({visible ? 0 : 24}px);
      transition:opacity 700ms 150ms ease,transform 700ms 150ms cubic-bezier(0.33,1,0.68,1);
    "
  >
    <!-- Top accent stripe -->
    <div style="height:3px;background:linear-gradient(to right,#2c3e6b,#c4754a);"></div>

    <div class="px-7 py-8">
      <!-- Large quote mark — decorative -->
      <div
        class="mb-4 select-none"
        aria-hidden="true"
        style="font-size:5rem;line-height:0.8;color:rgba(44,60,107,0.25);font-family:Georgia,serif;font-style:italic;"
      >
        "
      </div>

      <p
        class="text-sm leading-[1.95] italic"
        style="color:#cbd5e1;font-family:var(--font-body,sans-serif);"
      >
        {quote}
      </p>

      <!-- Source row -->
      <div class="mt-6 flex items-center gap-3">
        <div style="width:24px;height:1px;background:#c4754a;opacity:0.7;"></div>
        <span
          class="text-xs tracking-[0.4em] uppercase"
          style="color:#c4754a;font-family:var(--font-heading,sans-serif);">{quoteSource}</span
        >
      </div>
    </div>

    <!-- Bottom-right tag -->
    <div
      class="absolute right-0 bottom-0 px-3 py-1"
      style="background:rgba(44,60,107,0.12);border-top:1px solid rgba(44,60,107,0.2);border-left:1px solid rgba(44,60,107,0.2);"
    >
      <span
        class="text-xs"
        style="color:rgba(110,128,168,0.7);font-family:var(--font-heading,sans-serif);">verse</span
      >
    </div>
  </div>

  <!-- Flow connector -->
  <div
    class="mt-6 flex items-center gap-2"
    style="opacity:{visible ? 1 : 0};transition:opacity 700ms 400ms ease;"
  >
    <div style="flex:1;height:1px;background:linear-gradient(to right,#e2e8f0,transparent);"></div>
    <div style="width:6px;height:6px;background:#2c3e6b;transform:rotate(45deg);"></div>
  </div>
</section>
