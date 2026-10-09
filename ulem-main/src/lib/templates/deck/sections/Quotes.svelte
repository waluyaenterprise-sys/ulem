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
      { threshold: 0.2 }
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
    <div class="deck-card" style="animation: deckIn 0.7s ease both;">
      <div class="deck-card-header">
        <span class="deck-label">Firman</span>
        <span class="deck-num">01</span>
      </div>
      <div class="deck-body">
        <div
          style="font-size: 3rem; line-height: 0.7; color: rgba(255,255,255,0.06); font-family: Georgia, serif; margin-bottom: 12px; user-select: none;"
          aria-hidden="true"
        >
          "
        </div>
        <p
          style="font-size: 13px; line-height: 1.8; color: rgba(255,255,255,0.6); font-style: italic; font-family: var(--font-body, sans-serif);"
        >
          {quote}
        </p>
        <div class="deck-divider" style="margin-top: 16px;"></div>
        <p style="font-size: 10px; color: rgba(255,255,255,0.25); letter-spacing: 0.1em;">
          {quoteSource}
        </p>
      </div>
    </div>
  {/if}
</section>

