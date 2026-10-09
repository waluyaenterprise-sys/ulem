<script lang="ts">
  import { onMount } from 'svelte';
  import { formatIndonesianDate } from '$lib/utils/formatDate';

  export let invitation: any;

  const events: any[] = invitation.events || [];

  function reveal(node: HTMLElement, { delay = 0 } = {}) {
    node.style.opacity = '0';
    node.style.transform = 'translateY(24px)';
    node.style.transition = `opacity 0.9s ease ${delay}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'translateY(0)';
          observer.unobserve(node);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(node);
    return { destroy: () => observer.disconnect() };
  }
</script>

<section
  class="relative w-full overflow-hidden px-5 py-16"
  style="background: linear-gradient(160deg, #2C1810 0%, #3D2318 50%, #2C1810 100%);"
>
  <!-- Gold texture overlay -->
  <div
    class="pointer-events-none absolute inset-0 opacity-[0.06]"
    style="
      background-image: repeating-linear-gradient(45deg, #C9A227 0px, #C9A227 1px, transparent 1px, transparent 8px),
                        repeating-linear-gradient(-45deg, #C9A227 0px, #C9A227 1px, transparent 1px, transparent 8px);
    "
  ></div>

  <div class="relative z-10 mx-auto max-w-sm">
    <!-- Header -->
    <div use:reveal class="mb-10 text-center">
      <p class="font-body text-[9px] tracking-[0.4em] text-amber-400/60 uppercase">
        Diumumkan dengan Hormat
      </p>
      <p class="mt-2 font-script text-4xl text-amber-300">Waktu &amp; Tempat</p>
      <div class="mx-auto mt-3 flex items-center justify-center gap-2">
        <div class="h-px w-10 bg-amber-600/50"></div>
        <div class="h-1 w-1 rotate-45 bg-amber-500/70"></div>
        <div class="h-px w-10 bg-amber-600/50"></div>
      </div>
    </div>

    {#each events as event, i}
      {@const dateInfo = event.date ? formatIndonesianDate(event.date, event.startTime, event.endTime) : null}
      <div
        use:reveal={{ delay: i * 150 }}
        class="mb-6 overflow-hidden"
        style="
          background: linear-gradient(160deg, rgba(244,232,193,0.07) 0%, rgba(201,162,39,0.05) 100%);
          border: 1px solid rgba(201,162,39,0.3);
          box-shadow: inset 0 0 30px rgba(201,162,39,0.04), 0 2px 20px rgba(0,0,0,0.3);
        "
      >
        <!-- Event image -->
        {#if event.images?.[0]}
          <div class="relative h-40 w-full overflow-hidden">
            <img
              src={event.images[0]}
              alt={event.title}
              class="h-full w-full object-cover opacity-70"
            />
            <div
              class="absolute inset-0"
              style="background: linear-gradient(to bottom, transparent 30%, rgba(44,24,16,0.85) 100%);"
            ></div>
            <p
              class="absolute bottom-3 left-4 font-heading text-lg font-bold text-amber-200 italic"
            >
              {event.title || event.type}
            </p>
          </div>
        {/if}

        <div class="px-5 py-5">
          {#if !event.images?.[0]}
            <p class="font-body text-[9px] tracking-[0.35em] text-amber-500/60 uppercase">
              {event.type || 'Acara'}
            </p>
            <h3 class="mt-1 font-heading text-xl font-bold text-amber-200 italic">
              {event.title || event.type}
            </h3>
          {:else}
            <p class="font-body text-[9px] tracking-[0.35em] text-amber-500/60 uppercase">
              {event.type || 'Acara'}
            </p>
          {/if}

          <!-- Divider -->
          <div class="my-3 flex items-center gap-2">
            <div class="h-px flex-1 bg-amber-700/30"></div>
            <div class="h-1 w-1 rotate-45 bg-amber-600/50"></div>
            <div class="h-px flex-1 bg-amber-700/30"></div>
          </div>

          <!-- Date -->
          {#if dateInfo}
            <div class="flex items-start gap-3">
              <div
                class="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-sm"
                style="background: linear-gradient(135deg, #C9A227 0%, #8B6914 100%);"
              >
                <span class="font-heading text-xl leading-none font-bold text-white"
                  >{dateInfo.day}</span
                >
                <span class="font-body text-[9px] tracking-wider text-amber-100/80 uppercase"
                  >{dateInfo.monthName.slice(0, 3)}</span
                >
              </div>
              <div>
                <p class="font-body text-xs font-semibold text-amber-300">
                  {dateInfo.dayName || ''}
                </p>
                <p class="font-body text-[11px] text-amber-200/70">
                  {dateInfo.day}
                  {dateInfo.monthName}
                  {dateInfo.year}
                </p>
                {#if dateInfo?.timeRange}
                  <p class="mt-0.5 font-body text-[11px] text-amber-400/70">{dateInfo.timeRange}</p>
                {/if}
              </div>
            </div>
          {/if}

          <!-- Location -->
          {#if event.location}
            <div class="mt-3 flex items-start gap-2">
              <svg
                viewBox="0 0 24 24"
                class="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500/70"
                fill="currentColor"
              >
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                />
              </svg>
              <p class="font-body text-xs leading-relaxed text-amber-200/60 italic">
                {event.location}
              </p>
            </div>
          {/if}

          <!-- Maps button -->
          {#if event.locationUrl}
            <a
              href={event.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="mt-4 flex w-full items-center justify-center gap-2 rounded-sm border border-amber-600/40 px-4 py-2 font-body text-[11px] tracking-widest text-amber-400 uppercase transition-all hover:bg-amber-800/20"
            >
              <svg viewBox="0 0 24 24" class="h-3 w-3" fill="currentColor">
                <path
                  d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"
                />
              </svg>
              Lihat Lokasi
            </a>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</section>
