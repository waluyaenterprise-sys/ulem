<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { formatIndonesianDate } from '$lib/utils/formatDate';
  import Petals from './Petal.svelte';
  import FlowerIcon from './FlowerIcon.svelte';

  export let invitation: any;

  const events: any[] = invitation.events || [];

  function reveal(node: HTMLElement, { delay = 0, y = 24 } = {}) {
    node.style.opacity = '0';
    node.style.transform = `translateY(${y}px)`;
    node.style.transition = `opacity 0.9s ease ${delay}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'none';
          io.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }
</script>

<section class="relative w-full overflow-hidden bg-white">
  <Petals />

  <!-- Decorative flowers -->
  <div class="pointer-events-none absolute top-4 left-4 z-10">
    <FlowerIcon size={40} opacity={0.35} color="#6b7280" />
  </div>
  <div class="pointer-events-none absolute top-4 right-4 z-10">
    <FlowerIcon size={34} opacity={0.3} color="#6b7280" />
  </div>

  <!-- Header -->
  <div use:reveal class="px-8 pt-14 pb-0 text-center">
    <p class="font-body text-[9px] tracking-[0.45em] text-gray-400 uppercase">Agenda</p>
    <div class="mt-2 flex items-center justify-center gap-3">
      <FlowerIcon size={18} opacity={0.35} color="#6b7280" />
      <p class="font-heading text-3xl font-light text-gray-900">Waktu &amp; Tempat</p>
      <FlowerIcon size={18} opacity={0.35} color="#6b7280" />
    </div>
  </div>

  <!-- Event cards — stacked vertically -->
  {#each events as event, i}
    {@const dateInfo = event?.date ? formatIndonesianDate(event.date, event.startTime, event.endTime) : null}

    <div use:reveal={{ delay: i * 150, y: 32 }} class="mt-6 overflow-hidden">
      <!-- Photo -->
      <div class="relative h-[55vw] max-h-72 w-full overflow-hidden bg-gray-100">
        {#if event?.imageUrls}
          <img src={event.imageUrls[0]} alt={event.title} class="h-full w-full object-cover" />
        {:else}
          <div class="flex h-full w-full items-center justify-center bg-gray-50">
            <svg viewBox="0 0 24 24" class="h-12 w-12 text-gray-200" fill="currentColor">
              <path
                d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
              />
            </svg>
          </div>
        {/if}
      </div>

      <!-- Details -->
      <div class="px-8 py-8">
        <p class="font-body text-[9px] tracking-[0.4em] text-gray-400 uppercase">
          {event?.type || 'Acara'}
        </p>
        <h3 class="mt-1 font-heading text-2xl font-light text-gray-900">
          {event?.title || event?.type || ''}
        </h3>

        <!-- Thin separator -->
        <div class="my-5 h-px w-full bg-gray-100"></div>

        <!-- Date / time row -->
        {#if dateInfo}
          <div class="flex items-start gap-6">
            <!-- Day number block -->
            <div class="shrink-0 text-center">
              <p class="font-heading text-5xl leading-none font-light text-gray-900">
                {dateInfo.day}
              </p>
              <p class="mt-1 font-body text-[10px] tracking-widest text-gray-400 uppercase">
                {dateInfo.monthName}
              </p>
              <p class="font-body text-[10px] tracking-widest text-gray-400">{dateInfo.year}</p>
            </div>
            <div class="w-px self-stretch bg-gray-100"></div>
            <div class="flex-1">
              <p class="font-body text-xs font-medium text-gray-700">{dateInfo.dayName}</p>
              {#if dateInfo.timeRange}
                <p class="mt-1 font-body text-xs text-gray-500">
                  {dateInfo.timeRange}
                </p>
              {/if}
              {#if event?.location}
                <p class="mt-3 font-body text-xs leading-relaxed text-gray-500">{event.location}</p>
              {/if}
            </div>
          </div>
        {:else if event?.location}
          <p class="font-body text-sm leading-relaxed text-gray-600">{event.location}</p>
        {/if}

        <!-- Maps button -->
        {#if event?.locationUrl}
          <a
            href={event.locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="mt-6 flex w-full items-center justify-center gap-2 border border-gray-200 py-3 font-body text-[11px] tracking-[0.25em] text-gray-600 uppercase transition-all hover:bg-gray-50 active:scale-[0.98]"
          >
            <svg
              viewBox="0 0 24 24"
              class="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            Lihat Lokasi
          </a>
        {/if}
      </div>
    </div>
  {/each}
</section>
