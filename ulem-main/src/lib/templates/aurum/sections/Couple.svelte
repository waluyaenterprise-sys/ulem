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
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 2.15, minRem: 1.1, endAt: 26 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 2.15, minRem: 1.1, endAt: 26 });

  let visible = false;
  let el: HTMLElement;

  // Which panel is "active" — tapping flips between groom and bride on small screens
  let active: 'groom' | 'bride' = 'bride';

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (el) observer.observe(el);
  });
</script>

<section
  bind:this={el}
  class="relative w-full overflow-hidden"
  style="background:#040404;min-height:100svh;"
>
  <!-- Section label centered top -->
  <div
    class="absolute top-0 right-0 left-0 z-20 flex flex-col items-center pt-10 pb-4 transition-all duration-700"
    style="opacity:{visible ? 1 : 0};transform:translateY({visible ? 0 : -16}px)"
  >
    <p
      class="text-[9px] tracking-[0.45em] uppercase"
      style="color:#c9a84c;font-family:var(--font-heading,sans-serif);"
    >
      The Couple
    </p>
    <div style="width:40px;height:1px;background:#c9a84c;margin-top:10px;opacity:0.6;"></div>
  </div>

  <!-- Split panel container -->
  <div class="flex flex-col" style="min-height:100svh;">
    <!-- BRIDE PANEL -->
    <div
      class="relative flex-1 cursor-pointer overflow-hidden transition-all duration-500"
      style="min-height:45svh;opacity:{visible ? 1 : 0};transform:translateX({visible
        ? 0
        : 40}px);transition-delay:150ms;"
      on:click={() => (active = 'bride')}
      role="button"
      tabindex="0"
      on:keydown={(e) => e.key === 'Enter' && (active = 'bride')}
    >
      {#if brideImage}
        <img
          src={brideImage}
          alt={brideName}
          class="absolute inset-0 h-full w-full object-cover transition-all duration-500"
          style="filter:{active === 'bride'
            ? 'brightness(0.55)'
            : 'brightness(0.25) grayscale(50%)'};"
        />
      {:else}
        <div class="absolute inset-0" style="background:#0a0a0a;"></div>
      {/if}

      <!-- Gold right border -->
      <div
        class="absolute top-0 right-0 bottom-0 transition-all duration-500"
        style="width:{active === 'bride'
          ? '3px'
          : '1px'};background:linear-gradient(to bottom,transparent,#c9a84c 20%,#c9a84c 80%,transparent);opacity:{active ===
        'bride'
          ? 1
          : 0.4};"
      ></div>

      <!-- Content overlay -->
      <div class="absolute inset-0 flex flex-col items-end justify-end p-8 text-right">
        <p
          class="mb-1 text-[9px] tracking-[0.35em] uppercase"
          style="color:#c9a84c;font-family:var(--font-heading,sans-serif);"
        >
          Bride
        </p>
        <div
          style="width:24px;height:1px;background:#c9a84c;margin-bottom:8px;opacity:0.7;margin-left:auto;"
        ></div>
        <p
          class="text-4xl leading-none"
          style={brideNameStyle + '; font-family:var(--font-script,serif);color:#fff;'}
        >
          {brideName}
        </p>
        {#if brideNotes}
          <p
            class="mt-1 text-xs"
            style="color:rgba(201,168,76,0.7);font-family:var(--font-body,sans-serif);"
          >
            {brideNotes}
          </p>
        {/if}

        <div
          class="overflow-hidden transition-all duration-500"
          style="max-height:{active === 'bride' ? '80px' : '0'};opacity:{active === 'bride'
            ? 1
            : 0};"
        >
          {#if brideFather || brideMother}
            <p
              class="mt-3 text-[11px] leading-relaxed"
              style="color:rgba(255,255,255,0.45);font-family:var(--font-body,sans-serif);"
            >
              Putri dari Bapak {brideFather}{brideMother ? ` & Ibu ${brideMother}` : ''}
            </p>
          {/if}
          {#if brideNotes}
            <p
              class="mt-1 text-xs italic"
              style="color:rgba(201,168,76,0.6);font-family:var(--font-body,sans-serif);"
            >
              {brideNotes}
            </p>
          {/if}
          {#if brideIG}
            <a
              href={igUrl(brideIG)}
              target="_blank"
              rel="noopener noreferrer"
              style="margin-top:8px;display:inline-flex;align-items:center;gap:4px;font-size:11px;color:rgba(201,168,76,0.7);"
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
              {igHandle(brideIG)}
            </a>
          {/if}
        </div>
      </div>
    </div>

    <!-- Gold separator line with center diamond -->
    <div
      class="relative z-10 flex items-center justify-center"
      style="height:2px;background:linear-gradient(to right,transparent,#c9a84c 30%,#c9a84c 70%,transparent);"
    >
      <div
        style="width:12px;height:12px;background:#040404;border:1px solid #c9a84c;transform:rotate(45deg);position:absolute;"
      ></div>
    </div>

    <!-- GROOM PANEL -->
    <div
      class="relative flex-1 cursor-pointer overflow-hidden transition-all duration-500"
      style="min-height:45svh;opacity:{visible ? 1 : 0};transform:translateX({visible
        ? 0
        : -40}px);transition-delay:300ms;"
      on:click={() => (active = 'groom')}
      role="button"
      tabindex="0"
      on:keydown={(e) => e.key === 'Enter' && (active = 'groom')}
    >
      {#if groomImage}
        <img
          src={groomImage}
          alt={groomName}
          class="absolute inset-0 h-full w-full object-cover transition-all duration-500"
          style="filter:{active === 'groom'
            ? 'brightness(0.55)'
            : 'brightness(0.25) grayscale(50%)'};"
        />
      {:else}
        <div class="absolute inset-0" style="background:#0a0a0a;"></div>
      {/if}

      <!-- Gold left border -->
      <div
        class="absolute top-0 bottom-0 left-0 transition-all duration-500"
        style="width:{active === 'groom'
          ? '3px'
          : '1px'};background:linear-gradient(to bottom,transparent,#c9a84c 20%,#c9a84c 80%,transparent);opacity:{active ===
        'groom'
          ? 1
          : 0.4};"
      ></div>

      <!-- Content overlay -->
      <div class="absolute inset-0 flex flex-col justify-end p-8">
        <p
          class="mb-1 text-[9px] tracking-[0.35em] uppercase"
          style="color:#c9a84c;font-family:var(--font-heading,sans-serif);"
        >
          Groom
        </p>
        <div style="width:24px;height:1px;background:#c9a84c;margin-bottom:8px;opacity:0.7;"></div>
        <p
          class="text-4xl leading-none"
          style={groomNameStyle + '; font-family:var(--font-script,serif);color:#fff;'}
        >
          {groomName}
        </p>
        {#if groomNotes}
          <p
            class="mt-1 text-xs"
            style="color:rgba(201,168,76,0.7);font-family:var(--font-body,sans-serif);"
          >
            {groomNotes}
          </p>
        {/if}

        <!-- Family info — visible when active -->
        <div
          class="overflow-hidden transition-all duration-500"
          style="max-height:{active === 'groom' ? '80px' : '0'};opacity:{active === 'groom'
            ? 1
            : 0};"
        >
          {#if groomFather || groomMother}
            <p
              class="mt-3 text-[11px] leading-relaxed"
              style="color:rgba(255,255,255,0.45);font-family:var(--font-body,sans-serif);"
            >
              Putra dari Bapak {groomFather}{groomMother ? ` & Ibu ${groomMother}` : ''}
            </p>
          {/if}
          {#if groomNotes}
            <p
              class="mt-1 text-xs italic"
              style="color:rgba(201,168,76,0.6);font-family:var(--font-body,sans-serif);"
            >
              {groomNotes}
            </p>
          {/if}
          {#if groomIG}
            <a
              href={igUrl(groomIG)}
              target="_blank"
              rel="noopener noreferrer"
              style="margin-top:8px;display:inline-flex;align-items:center;gap:4px;font-size:11px;color:rgba(201,168,76,0.7);"
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
              {igHandle(groomIG)}
            </a>
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>
