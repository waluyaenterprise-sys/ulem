<script lang="ts">
  import { onMount } from 'svelte';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const groomFather: string = invitation.groom?.father || '';
  const groomMother: string = invitation.groom?.mother || '';
  const groomNotes: string = invitation.groom?.notes || '';
  const groomImage: string = invitation.groom?.imageUrls?.[0] || '';

  const brideName: string = invitation.bride?.name || 'Bride';
  const brideFather: string = invitation.bride?.father || '';
  const brideMother: string = invitation.bride?.mother || '';
  const brideNotes: string = invitation.bride?.notes || '';
  const brideImage: string = invitation.bride?.imageUrls?.[0] || '';
  function igUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://instagram.com/${url}`;
  }
  function igHandle(url: string): string {
    if (!url) return '';
    const match = url.match(/instagram\.com\/([^/?#]+)/);
    return match ? `@${match[1]}` : url;
  }

  let el: HTMLElement;
  let visible = false;
  let active = 0;

  const cards = [
    {
      label: 'Mempelai Wanita',
      name: brideName,
      father: brideFather,
      mother: brideMother,
      notes: brideNotes,
      image: brideImage,
      instagram: invitation.bride?.socialMedia?.instagram || ''
    },
    {
      label: 'Mempelai Pria',
      name: groomName,
      father: groomFather,
      mother: groomMother,
      notes: groomNotes,
      image: groomImage,
      instagram: invitation.groom?.socialMedia?.instagram || ''
    }
  ];

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
    <div class="mb-5 flex gap-2" style="animation: deckIn 0.5s ease both;">
      {#each cards as c, i}
        <button
          on:click={() => (active = i)}
          style="padding: 5px 16px; border-radius: 100px; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; cursor: pointer; transition: all 0.2s; border: 1px solid {active ===
          i
            ? 'rgba(255,255,255,0.3)'
            : 'rgba(255,255,255,0.08)'}; background: {active === i
            ? 'rgba(255,255,255,0.08)'
            : 'transparent'}; color: {active === i
            ? 'rgba(255,255,255,0.8)'
            : 'rgba(255,255,255,0.25)'};"
        >
          {c.label === 'Mempelai Wanita' ? 'Bride' : 'Groom'}
        </button>
      {/each}
    </div>

    {#each cards as card, i}
      {#if active === i}
        <div class="deck-card" style="animation: deckIn 0.5s ease both;">
          <!-- Photo -->
          <div style="height: 200px; position: relative; background: rgba(255,255,255,0.03);">
            {#if card.image}
              <img
                src={card.image}
                alt={card.name}
                class="h-full w-full object-cover"
                style="object-position: center top;"
              />
              <div
                class="absolute inset-0"
                style="background: linear-gradient(to bottom, transparent 50%, rgba(6,6,10,0.85) 100%);"
              ></div>
            {:else}
              <div class="flex h-full w-full items-center justify-center">
                <span style="font-size: 2.5rem; opacity: 0.08;">◇</span>
              </div>
            {/if}
            <div class="absolute right-0 bottom-0 left-0 p-4">
              <div class="deck-label mb-1">{card.label}</div>
              <div class="deck-script">{card.name}</div>
            </div>
          </div>

          <!-- Info -->
          <div class="deck-body space-y-3">
            {#if card.notes}
              <p class="deck-small italic">{card.notes}</p>
            {/if}
            {#if card.father || card.mother}
              <div class="deck-divider"></div>
              <div class="space-y-1">
                {#if card.father}
                  <p class="deck-small">
                    Putra/i dari <span style="color: rgba(255,255,255,0.55);">{card.father}</span>
                  </p>
                {/if}
                {#if card.mother}
                  <p class="deck-small">
                    dan <span style="color: rgba(255,255,255,0.55);">{card.mother}</span>
                  </p>
                {/if}
              </div>
            {/if}
            {#if card.instagram}
              <a
                href={igUrl(card.instagram)}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-xs text-gray-400 transition hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style="width:12px;height:12px;"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  ><path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                  /></svg
                >
                {igHandle(card.instagram)}
              </a>
            {/if}
          </div>
        </div>
      {/if}
    {/each}
  {/if}
</section>
