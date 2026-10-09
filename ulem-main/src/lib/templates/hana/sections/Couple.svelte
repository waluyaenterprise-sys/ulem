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
  const groomIG: string = invitation.groom?.socialMedia?.instagram || '';
  const brideIG: string = invitation.bride?.socialMedia?.instagram || '';
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

  function PersonCard(
    name: string,
    father: string,
    mother: string,
    notes: string,
    image: string,
    role: string,
    accentColor: string,
    delay: number,
    instagram: string = ''
  ) {
    return { name, father, mother, notes, image, role, accentColor, delay, instagram };
  }

  const people = [
    PersonCard(
      brideName,
      brideFather,
      brideMother,
      brideNotes,
      brideImage,
      'Mempelai Wanita',
      '#d4a0a0',
      0,
      brideIG
    ),
    PersonCard(
      groomName,
      groomFather,
      groomMother,
      groomNotes,
      groomImage,
      'Mempelai Pria',
      '#8fa89c',
      150,
      groomIG
    )
  ];
</script>

<section bind:this={el} class="w-full px-6 py-20" style="background:#faf8f5;">
  <!-- Header -->
  <div
    class="mb-12 text-center"
    style="opacity:{visible ? 1 : 0};transform:translateY({visible
      ? 0
      : -14}px);transition:opacity 700ms ease,transform 700ms ease;"
  >
    <p
      class="text-xs tracking-[0.5em] uppercase"
      style="color:#b8a99a;font-family:var(--font-heading,serif);"
    >
      Yang Berbahagia
    </p>
    <p class="mt-2 text-2xl" style="color:#4a3f35;font-family:var(--font-script,cursive);">
      Mempelai
    </p>
    <div class="mx-auto mt-3 flex items-center gap-2" style="width:140px;">
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

  <!-- Cards -->
  <div class="flex flex-col items-center gap-10">
    {#each people as p, i}
      {#if visible}
        <div
          in:fly={{ y: 30, delay: 200 + p.delay, duration: 700, easing: cubicOut }}
          class="w-full max-w-xs overflow-hidden"
          style="background:#fff;border:1px solid #ede7e0;box-shadow:0 4px 24px rgba(180,150,130,0.08);"
        >
          <!-- Accent top bar -->
          <div
            style="height:3px;background:linear-gradient(to right,transparent,{p.accentColor},{p.accentColor},transparent);opacity:0.7;"
          ></div>

          <!-- Photo -->
          {#if p.image}
            <div style="height:220px;overflow:hidden;">
              <img
                src={p.image}
                alt={p.name}
                class="h-full w-full object-cover"
                style="filter:brightness(0.96) saturate(0.85);"
              />
            </div>
          {:else}
            <div
              class="flex items-center justify-center"
              style="height:160px;background:linear-gradient(135deg,#faf0ee,#eef3f0);"
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle
                  cx="24"
                  cy="18"
                  r="10"
                  stroke={p.accentColor}
                  stroke-width="1"
                  opacity="0.5"
                />
                <path
                  d="M4 44 Q4 30 24 30 Q44 30 44 44"
                  stroke={p.accentColor}
                  stroke-width="1"
                  fill="none"
                  opacity="0.5"
                />
              </svg>
            </div>
          {/if}

          <!-- Info -->
          <div class="px-6 py-5">
            <!-- Role badge -->
            <p
              class="mb-1 text-xs tracking-[0.45em] uppercase"
              style="color:{p.accentColor};font-family:var(--font-heading,serif);"
            >
              {p.role}
            </p>
            <!-- Name -->
            <p class="mb-4 text-2xl" style="color:#4a3f35;font-family:var(--font-script,cursive);">
              {p.name}
            </p>

            <!-- Divider -->
            <div
              style="height:1px;background:linear-gradient(to right,{p.accentColor},transparent);opacity:0.35;margin-bottom:16px;"
            ></div>

            <!-- Parents -->
            {#if p.father}
              <div class="mb-2 flex gap-3">
                <p
                  class="w-16 shrink-0 text-xs tracking-widest uppercase"
                  style="color:#b8a99a;font-family:var(--font-heading,serif);"
                >
                  Ayah
                </p>
                <p class="text-sm" style="color:#6b5d52;font-family:var(--font-body,sans-serif);">
                  {p.father}
                </p>
              </div>
            {/if}
            {#if p.mother}
              <div class="mb-2 flex gap-3">
                <p
                  class="w-16 shrink-0 text-xs tracking-widest uppercase"
                  style="color:#b8a99a;font-family:var(--font-heading,serif);"
                >
                  Ibu
                </p>
                <p class="text-sm" style="color:#6b5d52;font-family:var(--font-body,sans-serif);">
                  {p.mother}
                </p>
              </div>
            {/if}
            {#if p.notes}
              <div class="mt-3 border-t pt-3" style="border-color:#ede7e0;">
                <p
                  class="text-sm leading-relaxed italic"
                  style="color:#9a8a7e;font-family:var(--font-body,sans-serif);"
                >
                  {p.notes}
                </p>
              </div>
            {/if}
            {#if p.instagram}
              <a
                href={igUrl(p.instagram)}
                target="_blank"
                rel="noopener noreferrer"
                class="mt-3 inline-flex items-center gap-1.5 text-xs"
                style="color:{p.accentColor};"
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
        </div>
      {/if}
    {/each}
  </div>
</section>
