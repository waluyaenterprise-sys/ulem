<script lang="ts">
  import { onMount } from 'svelte';

  export let invitation: any;

  const images: string[] = invitation?.gallery?.imageUrls || [];

  // Row 1: all images; Row 2: shifted by half so bricks don't align
  const half = Math.ceil(images.length / 2);
  const row1src = [...images, ...images];
  const row2src = [
    ...images.slice(half),
    ...images.slice(0, half),
    ...images.slice(half),
    ...images.slice(0, half)
  ];

  // Duration: more images = longer cycle, keeps speed consistent
  const duration = Math.max(images.length * 2.8, 12);

  let visible = false;
  let sectionEl: HTMLElement;
  let activeIdx: number | null = null;
  let paused = false;

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

  function handleFrameClick(realIdx: number) {
    if (activeIdx === realIdx) {
      activeIdx = null;
      paused = false;
    } else {
      activeIdx = realIdx;
      paused = true;
    }
  }
</script>

<section bind:this={sectionEl} class="w-full overflow-hidden py-20" style="background:#040404;">
  <!-- HEADER -->
  <div
    class="mb-12 px-5 text-center transition-all duration-700"
    style="opacity:{visible ? 1 : 0};transform:translateY({visible ? 0 : -16}px)"
  >
    <p
      class="text-[9px] tracking-[0.45em] uppercase"
      style="color:#c9a84c;font-family:var(--font-heading,sans-serif);"
    >
      Gallery
    </p>
    <div style="width:40px;height:1px;background:#c9a84c;margin:12px auto 0;opacity:0.6;"></div>
  </div>

  <!-- FILMSTRIP: 2-row brick/zigzag layout -->
  <div class="filmstrip" style="opacity:{visible ? 1 : 0};transition:opacity 800ms 200ms ease;">
    <!-- Top sprocket holes -->
    <div class="sprocket-row top-sprockets"></div>

    <!-- Row 1: scrolls LEFT -->
    <div
      class="film-frames row-forward"
      style="animation-duration:{duration}s;animation-play-state:{paused ? 'paused' : 'running'};"
    >
      {#each row1src as img, i}
        {@const realIdx = i % images.length}
        <button
          type="button"
          class="film-frame"
          on:click={() => handleFrameClick(realIdx)}
          aria-label="View photo {realIdx + 1}"
        >
          <img
            src={img}
            alt="Gallery"
            class="h-full w-full object-contain transition-all duration-500"
            style="filter:{activeIdx === realIdx
              ? 'brightness(1) contrast(1.05)'
              : 'brightness(0.6) grayscale(15%)'};"
          />
          <div
            class="frame-number"
            style="color:{activeIdx === realIdx ? '#c9a84c' : 'rgba(201,168,76,0.35)'};"
          >
            {String(realIdx + 1).padStart(2, '0')}
          </div>
        </button>
      {/each}
    </div>

    <!-- Gold divider between rows (the "mortar" in the brick pattern) -->
    <div
      style="height:3px;background:linear-gradient(to right,transparent,rgba(201,168,76,0.18) 20%,rgba(201,168,76,0.18) 80%,transparent);margin:2px 0;"
    ></div>

    <!-- Row 2: scrolls RIGHT, offset for brick stagger -->
    <div
      class="film-frames row-reverse"
      style="animation-duration:{duration * 1.15}s;animation-play-state:{paused
        ? 'paused'
        : 'running'};"
    >
      {#each row2src as img, i}
        {@const realIdx = (i + Math.ceil(images.length / 2)) % images.length}
        <button
          type="button"
          class="film-frame"
          on:click={() => handleFrameClick(realIdx)}
          aria-label="View photo {realIdx + 1}"
        >
          <img
            src={img}
            alt="Gallery"
            class="h-full w-full object-contain transition-all duration-500"
            style="filter:{activeIdx === realIdx
              ? 'brightness(1) contrast(1.05)'
              : 'brightness(0.6) grayscale(15%)'};"
          />
          <div
            class="frame-number"
            style="color:{activeIdx === realIdx ? '#c9a84c' : 'rgba(201,168,76,0.35)'};"
          >
            {String(realIdx + 1).padStart(2, '0')}
          </div>
        </button>
      {/each}
    </div>

    <!-- Bottom sprocket holes -->
    <div class="sprocket-row bottom-sprockets"></div>
  </div>

  <!-- Enlarged view -->
  {#if activeIdx !== null && images[activeIdx]}
    <div class="mt-8 px-5">
      <div
        class="mx-auto overflow-hidden"
        style="max-width:380px;border:1px solid rgba(201,168,76,0.3);box-shadow:0 0 60px rgba(201,168,76,0.08);"
      >
        <img
          src={images[activeIdx]}
          alt="Gallery"
          style="max-height:400px;width:100%;object-fit:contain;display:block;"
        />
      </div>
      <p
        class="mt-3 text-center text-[9px] tracking-[0.3em] uppercase"
        style="color:rgba(201,168,76,0.5);font-family:var(--font-heading,sans-serif);"
      >
        {String(activeIdx + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
      </p>
      <div class="mt-4 text-center">
        <button
          type="button"
          on:click={() => {
            activeIdx = null;
            paused = false;
          }}
          style="color:rgba(201,168,76,0.55);font-size:9px;letter-spacing:0.3em;text-transform:uppercase;font-family:var(--font-heading,sans-serif);"
        >
          ✕ close
        </button>
      </div>
    </div>
  {/if}
</section>

<style>
  .filmstrip {
    position: relative;
    background: #0a0a0a;
    border-top: 1px solid rgba(201, 168, 76, 0.1);
    border-bottom: 1px solid rgba(201, 168, 76, 0.1);
    padding: 4px 0;
    overflow: hidden;
  }

  /* Sprocket holes using CSS repeating background */
  .sprocket-row {
    width: 100%;
    height: 12px;
    background-image: repeating-linear-gradient(
      to right,
      transparent 0px,
      transparent 8px,
      transparent 8px,
      transparent 10px
    );
    background-repeat: repeat-x;
    position: relative;
  }
  .sprocket-row::before {
    content: '';
    position: absolute;
    inset: 1px 0;
    background-image: repeating-linear-gradient(
      to right,
      rgba(4, 4, 4, 1) 0px,
      rgba(4, 4, 4, 1) 14px,
      transparent 14px,
      transparent 36px
    );
    border-image: repeating-linear-gradient(
        to right,
        rgba(201, 168, 76, 0.25) 0px,
        rgba(201, 168, 76, 0.25) 14px,
        transparent 14px,
        transparent 36px
      )
      1;
  }
  .top-sprockets {
    margin-bottom: 5px;
    background: repeating-linear-gradient(
      to right,
      #040404 0px,
      #040404 14px,
      #0a0a0a 14px,
      #0a0a0a 36px
    );
    border-top: 1px solid rgba(201, 168, 76, 0.2);
    border-bottom: 1px solid rgba(201, 168, 76, 0.2);
    outline: none;
    box-shadow:
      inset 0 1px 0 rgba(201, 168, 76, 0.08),
      inset 0 -1px 0 rgba(201, 168, 76, 0.08);
  }
  .bottom-sprockets {
    margin-top: 5px;
    background: repeating-linear-gradient(
      to right,
      #040404 0px,
      #040404 14px,
      #0a0a0a 14px,
      #0a0a0a 36px
    );
    border-top: 1px solid rgba(201, 168, 76, 0.2);
    border-bottom: 1px solid rgba(201, 168, 76, 0.2);
  }

  /* Auto-scrolling frames */
  .film-frames {
    display: flex;
    gap: 4px;
    padding: 0 8px;
    width: max-content;
  }

  .row-forward {
    animation: film-roll linear infinite;
  }

  .row-reverse {
    animation: film-roll-reverse linear infinite;
  }

  @keyframes film-roll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  @keyframes film-roll-reverse {
    0% {
      transform: translateX(-50%);
    }
    100% {
      transform: translateX(0);
    }
  }

  .film-frame {
    flex-shrink: 0;
    width: 130px;
    height: 100px;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(201, 168, 76, 0.15);
    cursor: pointer;
    background: #111;
    transition: border-color 0.3s;
  }
  .film-frame:hover {
    border-color: rgba(201, 168, 76, 0.5);
  }

  .frame-number {
    position: absolute;
    bottom: 4px;
    right: 6px;
    font-size: 9px;
    font-family: var(--font-heading, monospace);
    transition: color 0.3s;
    letter-spacing: 0.1em;
  }
</style>
