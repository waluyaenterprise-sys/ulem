<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

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

  const people = [
    {
      name: brideName,
      father: brideFather,
      mother: brideMother,
      notes: brideNotes,
      image: brideImage,
      role: 'Mempelai Wanita',
      delay: 0,
      instagram: invitation.bride?.socialMedia?.instagram || ''
    },
    {
      name: groomName,
      father: groomFather,
      mother: groomMother,
      notes: groomNotes,
      image: groomImage,
      role: 'Mempelai Pria',
      delay: 150,
      instagram: invitation.groom?.socialMedia?.instagram || ''
    }
  ];
</script>

<section bind:this={el} class="w-full px-6 py-20" style="background:#faf6ef;">
  <!-- Header -->
  <div
    class="mb-12 text-center"
    style="opacity:{visible ? 1 : 0};transform:translateY({visible
      ? 0
      : -14}px);transition:opacity 700ms ease,transform 700ms ease;"
  >
    <p
      class="text-xs tracking-[0.6em] uppercase"
      style="color:#8b1a1a;font-family:var(--font-heading,serif);"
    >
      — Yang Berbahagia —
    </p>
    <p class="mt-2 text-2xl" style="color:#2a1010;font-family:var(--font-script,cursive);">
      Mempelai
    </p>
    <div class="mx-auto mt-3 flex items-center gap-2" style="width:160px;">
      <div
        style="flex:1;height:1px;background:linear-gradient(to right,transparent,#b8962e);"
      ></div>
      <svg width="7" height="7" viewBox="0 0 7 7">
        <rect
          x="0.5"
          y="0.5"
          width="6"
          height="6"
          transform="rotate(45 3.5 3.5)"
          fill="none"
          stroke="#b8962e"
          stroke-width="0.8"
        />
      </svg>
      <div style="flex:1;height:1px;background:linear-gradient(to left,transparent,#b8962e);"></div>
    </div>
  </div>

  <!-- Person cards -->
  <div class="flex flex-col items-center gap-10">
    {#each people as p, i}
      {#if visible}
        <div
          in:fly={{ y: 30, delay: 200 + p.delay, duration: 700, easing: cubicOut }}
          class="w-full max-w-xs overflow-hidden"
          style="background:#fff;border:1px solid #e8d8c8;box-shadow:0 0 0 3px #faf6ef,0 0 0 4px #ddb88088;"
        >
          <!-- Maroon top bar -->
          <div
            style="height:3px;background:linear-gradient(to right,#6b1414,#8b1a1a,#b8962e,#8b1a1a,#6b1414);"
          ></div>

          <!-- Photo -->
          {#if p.image}
            <div style="height:220px;overflow:hidden;">
              <img
                src={p.image}
                alt={p.name}
                class="h-full w-full object-cover"
                style="filter:sepia(0.15) brightness(0.97);"
              />
            </div>
          {/if}

          <!-- Info -->
          <div class="px-6 py-6">
            <p
              class="mb-1 text-xs tracking-[0.5em] uppercase"
              style="color:#b8962e;font-family:var(--font-heading,serif);"
            >
              {p.role}
            </p>
            <p class="mb-3 text-2xl" style="color:#2a1010;font-family:var(--font-script,cursive);">
              {p.name}
            </p>

            <div
              style="height:1px;background:linear-gradient(to right,#6b1414,transparent);margin-bottom:12px;opacity:0.3;"
            ></div>

            {#if p.father || p.mother}
              <p
                class="text-xs leading-relaxed"
                style="color:#7a4040;font-family:var(--font-body,sans-serif);"
              >
                {#if p.name === brideName}
                  Putri dari Bapak <strong>{p.father || '—'}</strong>
                  {#if p.mother}
                    &amp; Ibu <strong>{p.mother}</strong>
                  {/if}
                {:else}
                  Putra dari Bapak <strong>{p.father || '—'}</strong>
                  {#if p.mother}
                    &amp; Ibu <strong>{p.mother}</strong>
                  {/if}
                {/if}
              </p>
            {/if}

            {#if p.notes}
              <p
                class="mt-2 text-xs italic"
                style="color:#9a6060;font-family:var(--font-body,sans-serif);"
              >
                {p.notes}
              </p>
            {/if}
            {#if p.instagram}
              <a
                href={igUrl(p.instagram)}
                target="_blank"
                rel="noopener noreferrer"
                class="mt-2 inline-flex items-center gap-1.5 text-xs"
                style="color:#b8962e;"
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
                {igHandle(p.instagram)}
              </a>
            {/if}
          </div>

          <!-- Bottom bar -->
          <div
            style="height:1px;background:linear-gradient(to right,transparent,#b8962e,transparent);opacity:0.5;"
          ></div>
        </div>
      {/if}
    {/each}
  </div>
</section>
