<script lang="ts">
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';
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
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.0, minRem: 1.05, endAt: 26 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.0, minRem: 1.05, endAt: 26 });

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

  const people = [
    {
      label: 'A',
      num: '01',
      role: 'Mempelai Wanita',
      name: brideName,
      father: brideFather,
      mother: brideMother,
      notes: brideNotes,
      image: brideImage,
      accent: '#c4754a',
      instagram: invitation.bride?.socialMedia?.instagram || ''
    },
    {
      label: 'B',
      num: '02',
      role: 'Mempelai Pria',
      name: groomName,
      father: groomFather,
      mother: groomMother,
      notes: groomNotes,
      image: groomImage,
      accent: '#2c3e6b',
      instagram: invitation.groom?.socialMedia?.instagram || ''
    }
  ];
</script>

<section bind:this={el} class="w-full px-6 py-24" style="background:#0d1829;">
  <!-- Chapter header -->
  <div
    class="mb-10 flex items-center gap-3"
    style="opacity:{visible ? 1 : 0};transform:translateX({visible
      ? 0
      : -16}px);transition:opacity 600ms ease,transform 600ms ease;"
  >
    <div style="width:3px;height:32px;background:#c4754a;flex-shrink:0;"></div>
    <div>
      <p
        class="text-xs tracking-[0.55em] uppercase"
        style="color:#c4754a;font-family:var(--font-heading,sans-serif);"
      >
        Chapter 02
      </p>
      <p
        class="text-lg font-bold"
        style="color:#f0f4ff;font-family:var(--font-heading,sans-serif);letter-spacing:-0.02em;"
      >
        Mempelai
      </p>
    </div>
    <div class="ml-auto" aria-hidden="true">
      <span
        style="font-size:80px;font-weight:900;color:rgba(196,117,74,0.07);font-family:var(--font-heading,sans-serif);line-height:1;user-select:none;"
        >02</span
      >
    </div>
  </div>

  <!-- People -->
  <div class="flex flex-col gap-5">
    {#each people as p, i}
      <div
        style="
          opacity:{visible ? 1 : 0};
          transform:translateX({visible ? 0 : i === 0 ? -24 : 24}px);
          transition:opacity 700ms {150 + i * 180}ms ease,transform 700ms {150 +
          i * 180}ms cubic-bezier(0.33,1,0.68,1);
          background:#151e30;
          border:1px solid rgba(255,255,255,0.06);
        "
      >
        <!-- Top label row -->
        <div
          class="flex items-center justify-between px-5 py-3"
          style="border-bottom:1px solid rgba(255,255,255,0.05);"
        >
          <div class="flex items-center gap-2">
            <span
              class="flex h-6 w-6 items-center justify-center text-xs font-bold"
              style="background:{p.accent};color:#fff;font-family:var(--font-heading,sans-serif);"
              >{p.num}</span
            >
            <span
              class="text-xs tracking-[0.45em] uppercase"
              style="color:{p.accent};font-family:var(--font-heading,sans-serif);">{p.role}</span
            >
          </div>
          <!-- Data node -->
          <div
            style="width:8px;height:8px;border:1.5px solid {p.accent};transform:rotate(45deg);"
          ></div>
        </div>

        <!-- Body -->
        <div class="flex gap-4 px-5 py-5">
          <!-- Photo -->
          {#if p.image}
            <div
              class="shrink-0 overflow-hidden"
              style="width:80px;height:90px;border:2px solid {p.accent}22;"
            >
              <img
                src={p.image}
                alt={p.name}
                class="h-full w-full object-cover"
                style="filter:grayscale(0.2);"
              />
            </div>
          {:else}
            <div
              class="flex shrink-0 items-center justify-center"
              style="width:80px;height:90px;background:rgba(255,255,255,0.04);border:1px dashed rgba(255,255,255,0.1);"
            >
              <span
                style="font-size:2rem;color:rgba(255,255,255,0.1);font-family:var(--font-heading,sans-serif);"
                >{p.label}</span
              >
            </div>
          {/if}

          <!-- Info -->
          <div class="flex min-w-0 flex-1 flex-col justify-center gap-1">
            <p
              class="truncate p-2 text-xl leading-tight"
              style={p.name === groomName
                ? groomNameStyle + '; color:#f0f4ff;font-family:var(--font-script,cursive);'
                : brideNameStyle + '; color:#f0f4ff;font-family:var(--font-script,cursive);'}
            >
              {p.name}
            </p>

            {#if p.father || p.mother}
              <div class="mt-1 flex items-start gap-2">
                <div
                  style="width:2px;height:100%;min-height:28px;background:{p.accent};opacity:0.5;flex-shrink:0;margin-top:3px;"
                ></div>
                <p
                  class="text-xs leading-relaxed"
                  style="color:#64748b;font-family:var(--font-body,sans-serif);"
                >
                  {p.role === 'Mempelai Wanita' ? 'Putri dari' : 'Putra dari'}
                  {p.father && p.mother ? `${p.father} & ${p.mother}` : p.father || p.mother}
                </p>
              </div>
            {/if}

            {#if p.notes}
              <p
                class="mt-1 text-xs italic"
                style="color:#475569;font-family:var(--font-body,sans-serif);"
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
                style="color:{p.accent};opacity:0.8;"
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

        <!-- Bottom connector -->
        <div
          style="height:2px;background:linear-gradient(to right,{p.accent},transparent);opacity:0.3;"
        ></div>
      </div>
    {/each}
  </div>

  <!-- Flow connector between sections -->
  <div
    class="mt-8 flex flex-col items-center gap-1"
    style="opacity:{visible ? 1 : 0};transition:opacity 700ms 600ms ease;"
  >
    <div
      style="width:1px;height:20px;background:linear-gradient(to bottom,rgba(44,60,107,0.5),transparent);"
    ></div>
    <div style="width:6px;height:6px;background:#2c3e6b;transform:rotate(45deg);"></div>
  </div>
</section>
