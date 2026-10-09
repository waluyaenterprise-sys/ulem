<script lang="ts">
  import Credit from '$lib/Credit.svelte';
  import { onMount } from 'svelte';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const brideName: string = invitation.bride?.name || 'Bride';
  const coverImage: string =
    invitation.closing?.imageUrls?.[0] || invitation.cover?.imageUrls?.[0] || '';
  const closingMessage: string =
    invitation.closing?.message ||
    'Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.';

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
  class="deck-page relative flex h-svh w-full flex-col items-center justify-end overflow-hidden px-6 pb-16"
  style="scroll-snap-align: start;"
>
  <!-- Background photo -->
  {#if coverImage}
    <img
      src={coverImage}
      alt=""
      class="absolute inset-0 h-full w-full object-cover"
      style="filter: brightness(0.4) saturate(0.9);"
    />
  {:else}
    <div
      class="absolute inset-0"
      style="background: linear-gradient(160deg, #0f0f18 0%, #06060a 100%);"
    ></div>
  {/if}
  <div
    class="absolute inset-0"
    style="background: linear-gradient(to top, rgba(6,6,10,0.95) 0%, rgba(6,6,10,0.5) 50%, rgba(6,6,10,0.2) 100%);"
  ></div>

  {#if visible}
    <div
      class="relative z-10 w-full max-w-sm text-center"
      style="animation: deckIn 0.8s ease both;"
    >
      <div class="deck-divider mx-auto mb-6" style="width: 40px;"></div>

      <p
        style="font-size: 12px; line-height: 1.8; color: rgba(255,255,255,0.45); font-style: italic; font-family: var(--font-body, sans-serif); margin-bottom: 32px;"
      >
        {closingMessage}
      </p>

      <div
        style="font-family: var(--font-script, cursive); font-size: clamp(1.8rem, 9vw, 2.4rem); color: #fff; line-height: 1.2; margin-bottom: 6px;"
      >
        {groomName}
      </div>
      <div
        style="font-size: 11px; letter-spacing: 0.3em; color: rgba(255,255,255,0.25); margin-bottom: 6px;"
      >
        &
      </div>
      <div
        style="font-family: var(--font-script, cursive); font-size: clamp(1.8rem, 9vw, 2.4rem); color: #fff; line-height: 1.2; margin-bottom: 32px;"
      >
        {brideName}
      </div>

      <div class="deck-divider mx-auto"></div>
    </div>

    <div class="relative z-10 mt-6">
      <Credit />
    </div>
  {/if}
</section>

