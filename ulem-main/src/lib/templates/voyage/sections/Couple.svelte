<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';

  export let invitation: any;

  const groom = invitation?.groom;
  const bride = invitation?.bride;
  const groomPhoto = groom?.imageUrls?.[0] || '';
  const bridePhoto = bride?.imageUrls?.[0] || '';
  const groomIG: string = groom?.socialMedia?.instagram || '';
  const brideIG: string = bride?.socialMedia?.instagram || '';

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
  const groomNameStyle = getAdaptiveNameStyle(groom?.name || 'Groom', {
    maxRem: 2.0,
    minRem: 1.05,
    endAt: 28
  });
  const brideNameStyle = getAdaptiveNameStyle(bride?.name || 'Bride', {
    maxRem: 2.0,
    minRem: 1.05,
    endAt: 28
  });

  let visible = false;
  let sectionEl: HTMLElement;
  let activePage: 'groom' | 'bride' = 'bride';

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
    if (sectionEl) observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section
  bind:this={sectionEl}
  class="w-full px-5 py-16"
  style="background:#0d1b2a;min-height:100svh;"
>
  {#if visible}
    <!-- Section header -->
    <div in:fade={{ duration: 600 }} class="mb-10 text-center">
      <p
        class="text-xs tracking-[0.55em] uppercase"
        style="color:rgba(201,168,76,0.5);font-family:var(--font-heading,serif);"
      >
        Pages 03 — 04
      </p>
      <p
        class="mt-2 text-sm tracking-[0.45em] uppercase"
        style="color:#c9a84c;font-family:var(--font-heading,serif);"
      >
        Personal Particulars
      </p>
      <div style="width:40px;height:1px;background:rgba(201,168,76,0.4);margin:10px auto 0;"></div>
    </div>

    <!-- Page tabs -->
    <div
      in:fade={{ delay: 200, duration: 600 }}
      class="mx-auto mb-6 flex gap-0"
      style="max-width:360px;"
    >
      {#each ['bride', 'groom'] as const as side}
        <button
          type="button"
          on:click={() => (activePage = side)}
          class="flex-1 py-2 text-xs tracking-[0.4em] uppercase transition-all duration-300"
          style="
            font-family:var(--font-heading,serif);
            background:{activePage === side ? 'rgba(201,168,76,0.12)' : 'transparent'};
            color:{activePage === side ? '#c9a84c' : 'rgba(201,168,76,0.3)'};
            border:1px solid {activePage === side
            ? 'rgba(201,168,76,0.4)'
            : 'rgba(201,168,76,0.12)'};
            border-bottom:{activePage === side
            ? '2px solid #c9a84c'
            : '1px solid rgba(201,168,76,0.12)'};
          "
        >
          {side === 'groom' ? 'Groom' : 'Bride'}
        </button>
      {/each}
    </div>

    <!-- Passport page -->
    {#each ['groom', 'bride'] as const as side}
      {#if activePage === side}
        {@const person = side === 'groom' ? groom : bride}
        {@const photo = side === 'groom' ? groomPhoto : bridePhoto}
        {@const personNameStyle = side === 'groom' ? groomNameStyle : brideNameStyle}
        <div
          in:fly={{ x: side === 'groom' ? -20 : 20, duration: 500, easing: cubicOut }}
          class="mx-auto"
          style="max-width:360px;"
        >
          <!-- Passport page card -->
          <div
            class="relative overflow-hidden"
            style="
              background:linear-gradient(145deg,#0f2035,#0a1828);
              border:1px solid rgba(201,168,76,0.25);
              box-shadow:0 20px 60px rgba(0,0,0,0.5);
            "
          >
            <!-- Top gold rule -->
            <div
              style="height:2px;background:linear-gradient(to right,transparent,#c9a84c 20%,#e8d08a 50%,#c9a84c 80%,transparent);"
            ></div>

            <!-- Background security pattern -->
            <div
              class="pointer-events-none absolute inset-0 opacity-30"
              style="
              background-image:
                repeating-linear-gradient(60deg, rgba(201,168,76,0.04) 0, rgba(201,168,76,0.04) 1px, transparent 0, transparent 10px),
                repeating-linear-gradient(-60deg, rgba(201,168,76,0.04) 0, rgba(201,168,76,0.04) 1px, transparent 0, transparent 10px);
              background-size:16px 16px;
            "
            ></div>

            <div class="relative z-10 p-5">
              <!-- Top row: photo + basic details -->
              <div class="mb-5 flex gap-4">
                <!-- Passport photo -->
                <div
                  style="width:90px;height:110px;flex-shrink:0;border:1px solid rgba(201,168,76,0.3);"
                >
                  {#if photo}
                    <img
                      src={photo}
                      alt={person?.name}
                      class="h-full w-full object-cover object-top"
                      style="filter:sepia(15%) contrast(1.05);"
                    />
                  {:else}
                    <div style="width:90px;height:110px;background:rgba(201,168,76,0.05);"></div>
                  {/if}
                </div>

                <!-- Details right of photo -->
                <div class="flex flex-1 flex-col gap-2">
                  <!-- Country of issue badge -->
                  <div class="mb-1 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 14 14">
                      <circle
                        cx="7"
                        cy="7"
                        r="6"
                        stroke="#c9a84c"
                        stroke-width="0.7"
                        fill="none"
                        opacity="0.5"
                      />
                      <path
                        d="M7 2 L8.2 5.5 L12 5.5 L9 7.5 L10.2 11 L7 9 L3.8 11 L5 7.5 L2 5.5 L5.8 5.5 Z"
                        fill="none"
                        stroke="#c9a84c"
                        stroke-width="0.6"
                        opacity="0.4"
                      />
                    </svg>
                    <p
                      class="text-sm tracking-[0.35em] uppercase"
                      style="color:rgba(201,168,76,0.45);font-family:var(--font-heading,serif);"
                    >
                      {side === 'groom' ? 'Groom' : 'Bride'}
                    </p>
                  </div>

                  <!-- Name -->
                  <div>
                    <p
                      class="mb-0.5 text-sm tracking-[0.3em] uppercase"
                      style="color:rgba(201,168,76,0.35);font-family:var(--font-heading,serif);"
                    >
                      Surname / Nama
                    </p>
                    <p
                      class="text-base leading-tight"
                      style={personNameStyle +
                        '; color:#e8d4a0;font-family:var(--font-script,cursive);'}
                    >
                      {person?.name || '-'}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Divider -->
              <div
                style="height:1px;background:linear-gradient(to right,transparent,rgba(201,168,76,0.25),transparent);margin-bottom:14px;"
              ></div>

              <!-- Data fields grid -->
              <div class="grid grid-cols-2 gap-x-4 gap-y-3">
                {#each [{ label: 'Father / Ayah', value: person?.father }, { label: 'Mother / Ibu', value: person?.mother }, { label: 'Nationality', value: 'Indonesian' }, { label: 'Status', value: 'Soon to be Wed' }] as field}
                  <div>
                    <p
                      class="text-sm tracking-[0.25em] uppercase"
                      style="color:rgba(201,168,76,0.35);font-family:var(--font-heading,serif);"
                    >
                      {field.label}
                    </p>
                    <p
                      class="mt-0.5 text-xs leading-snug"
                      style="color:rgba(228,216,180,0.75);font-family:var(--font-heading,serif);"
                    >
                      {field.value || '-'}
                    </p>
                  </div>
                {/each}
              </div>

              <!-- Notes / bio if any -->
              {#if person?.notes}
                <div class="mt-4 pt-3" style="border-top:1px solid rgba(201,168,76,0.12);">
                  <p
                    class="mb-1 text-sm tracking-[0.3em] uppercase"
                    style="color:rgba(201,168,76,0.35);font-family:var(--font-heading,serif);"
                  >
                    Remarks
                  </p>
                  <p
                    class="text-xs leading-relaxed"
                    style="color:rgba(228,216,180,0.6);font-family:var(--font-heading,serif);"
                  >
                    {person.notes}
                  </p>
                </div>
              {/if}
              {#if side === 'groom' ? groomIG : brideIG}
                {@const ig = side === 'groom' ? groomIG : brideIG}
                <a
                  href={igUrl(ig)}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-4 inline-flex items-center gap-1.5 text-xs"
                  style="color:rgba(201,168,76,0.6);"
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
                  {igHandle(ig)}
                </a>
              {/if}
            </div>

            <!-- MRZ strip -->
            <div
              style="background:#081018;padding:8px 14px;border-top:1px solid rgba(201,168,76,0.12);"
            >
              <p
                class="text-sm tracking-[0.08em] break-all"
                style="color:rgba(201,168,76,0.22);font-family:monospace;line-height:1.9;"
              >
                P&lt;WED{(person?.name || 'NAME')
                  .toUpperCase()
                  .replace(
                    /\s/g,
                    '<'
                  )}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br
                />
                {Math.random()
                  .toString(36)
                  .substring(2, 11)
                  .toUpperCase()}WED&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
              </p>
            </div>
          </div>
        </div>
      {/if}
    {/each}
  {/if}
</section>
