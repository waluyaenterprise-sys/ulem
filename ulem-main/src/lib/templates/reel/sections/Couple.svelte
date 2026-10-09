<script lang="ts">
  import { onMount } from 'svelte';

  export let invitation: any;

  const groomName: string = invitation.groom?.name || 'Groom';
  const groomFather: string = invitation.groom?.father || '';
  const groomMother: string = invitation.groom?.mother || '';
  const groomNotes: string = invitation.groom?.notes || '';
  const groomIG: string = invitation.groom?.socialMedia?.instagram || '';
  const groomImage: string = invitation.groom?.imageUrls?.[0] || '';

  const brideName: string = invitation.bride?.name || 'Bride';
  const brideFather: string = invitation.bride?.father || '';
  const brideMother: string = invitation.bride?.mother || '';
  const brideNotes: string = invitation.bride?.notes || '';
  const brideIG: string = invitation.bride?.socialMedia?.instagram || '';
  const brideImage: string = invitation.bride?.imageUrls?.[0] || '';

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
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  });

  const cast = [
    {
      role: 'Mempelai Wanita',
      name: brideName,
      father: brideFather,
      mother: brideMother,
      notes: brideNotes,
      instagram: brideIG,
      image: brideImage
    },
    {
      role: 'Mempelai Pria',
      name: groomName,
      father: groomFather,
      mother: groomMother,
      notes: groomNotes,
      instagram: groomIG,
      image: groomImage
    }
  ];

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

  function s(delayMs: number) {
    return `animation: coupleFadeIn 0.8s ease ${delayMs}ms both;`;
  }
</script>

<section
  bind:this={el}
  class="relative w-full overflow-hidden px-6 py-24"
  style="background:#0d0905;"
>
  <!-- Film grain -->
  <div
    class="film-grain pointer-events-none absolute inset-0"
    style="opacity:0.3"
    aria-hidden="true"
  ></div>

  {#if visible}
    <!-- Scene header -->
    <div style={s(0)} class="mb-10 text-center">
      <p
        class="text-xs tracking-[0.6em] uppercase"
        style="color:#7a6848;font-family:var(--font-heading,sans-serif);"
      >
        Scene II
      </p>
      <p
        class="mt-1 text-xl font-bold"
        style="color:#f5e6c8;font-family:var(--font-heading,sans-serif);letter-spacing:-0.01em;"
      >
        The Cast
      </p>
      <div class="mx-auto mt-3" style="width:40px;height:1px;background:#c9933a;opacity:0.6;"></div>
    </div>

    <!-- Cast cards -->
    {#each cast as person, i}
      <div style={s(200 + i * 200)} class="relative mx-auto mb-8 max-w-xs overflow-hidden">
        <!-- Film-style outer border -->
        <div style="border:1px solid rgba(201,147,58,0.25);padding:2px;">
          <!-- Photo with sepia -->
          {#if person.image}
            <div style="height:240px;overflow:hidden;position:relative;">
              <img
                src={person.image}
                alt={person.name}
                class="h-full w-full object-cover"
                style="filter:sepia(0.5) contrast(1.1) brightness(0.85);"
              />
              <!-- Gradient overlay -->
              <div
                class="absolute inset-0"
                style="background:linear-gradient(to top,rgba(13,9,5,0.85) 0%,transparent 55%);"
              ></div>
              <!-- Role badge on photo -->
              <div class="absolute right-0 bottom-0 left-0 px-4 pb-4">
                <p
                  class="text-xs tracking-[0.45em] uppercase"
                  style="color:#c9933a;font-family:var(--font-heading,sans-serif);"
                >
                  {person.role}
                </p>
                <p
                  style="font-size:1.6rem;font-family:var(--font-script,cursive);color:#f5e6c8;line-height:1.1;"
                >
                  {person.name}
                </p>
              </div>
            </div>
          {:else}
            <div
              style="height:120px;background:#1a1008;display:flex;align-items:flex-end;padding:16px;"
            >
              <div>
                <p
                  class="text-xs tracking-[0.45em] uppercase"
                  style="color:#c9933a;font-family:var(--font-heading,sans-serif);"
                >
                  {person.role}
                </p>
                <p style="font-size:1.6rem;font-family:var(--font-script,cursive);color:#f5e6c8;">
                  {person.name}
                </p>
              </div>
            </div>
          {/if}

          <!-- Info block -->
          <div style="background:#120c06;padding:16px 16px 20px;">
            {#if person.father || person.mother}
              <div
                class="mb-3"
                style="border-left:2px solid rgba(201,147,58,0.3);padding-left:10px;"
              >
                <p
                  class="text-xs"
                  style="color:#5a4e38;font-family:var(--font-heading,sans-serif);letter-spacing:0.05em;"
                >
                  Putra/Putri dari
                </p>
                {#if person.father}
                  <p
                    class="mt-0.5 text-sm"
                    style="color:#c9a96e;font-family:var(--font-body,sans-serif);"
                  >
                    Bapak {person.father}
                  </p>
                {/if}
                {#if person.mother}
                  <p class="text-sm" style="color:#c9a96e;font-family:var(--font-body,sans-serif);">
                    Ibu {person.mother}
                  </p>
                {/if}
              </div>
            {/if}
            {#if person.notes}
              <p
                class="text-xs leading-relaxed italic"
                style="color:#4a4030;font-family:var(--font-body,sans-serif);"
              >
                {person.notes}
              </p>
            {/if}
            {#if person.instagram}
              <a
                href={igUrl(person.instagram)}
                target="_blank"
                rel="noopener noreferrer"
                class="mt-3 inline-flex items-center gap-1.5 text-xs"
                style="color:#4a4030;"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  ><path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                  /></svg
                >
                {igHandle(person.instagram)}
              </a>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  {/if}
</section>

<style>
  @keyframes coupleFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .film-grain {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    background-repeat: repeat;
  }
</style>
