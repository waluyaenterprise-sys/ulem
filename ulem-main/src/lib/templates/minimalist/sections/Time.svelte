<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { formatIndonesianDate } from '$lib/utils/formatDate';

  export let invitation: any;

  const events: any[] = invitation?.events || [];

  let sectionEl: HTMLElement;
  let visible = false;

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    observer.observe(sectionEl);
    return () => observer.disconnect();
  });
</script>

<section bind:this={sectionEl} class="w-full bg-white px-6 py-20">
  {#if visible}
    <!-- HEADER -->
    <div in:fly={{ y: -20, duration: 1100, easing: cubicOut }} class="mb-10 text-center">
      <p class="font-script text-4xl text-[#F0A269]">Wedding Event</p>
      <div class="mx-auto mt-3 h-px w-12 bg-[#F0A269]/30"></div>
    </div>

    <!-- EVENT CARDS -->
    <div class="flex flex-col gap-8">
      {#each events as event, i}
        {@const info = event.date ? formatIndonesianDate(event.date, event.startTime, event.endTime) : null}
        <div
          in:fly={{ x: i % 2 === 0 ? -60 : 60, delay: i * 200, duration: 1100, easing: cubicOut }}
          class="mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-gray-50 shadow-sm"
        >
          <!-- SECTION 1: IMAGE TOP -->
          {#if event.imageUrls?.[0]}
            <img src={event.imageUrls[0]} alt={event.title} class="h-60 w-full object-cover" />
          {:else}
            <div class="flex h-60 w-full items-center justify-center bg-gray-100 text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          {/if}

          <!-- SECTION 2 + 3: BOTTOM ROW -->
          <div class="my-8 flex h-36 divide-x divide-gray-200">
            <!-- SECTION 2: EVENT NAME vertical (left) -->
            <div class="flex w-16 shrink-0 items-center justify-center">
              <p
                class="font-jomolhari text-sm tracking-widest text-gray-400"
                style="writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg);"
              >
                {event.title}
              </p>
            </div>

            <!-- SECTION 3: DATE & LOCATION (right) -->
            <div class=" flex flex-1 flex-col justify-center gap-3 px-5 py-4">
              {#if info}
                <p class="font-jomolhari text-base font-semibold text-gray-800">
                  {info.dayName}, {info.day}
                  {info.monthName}
                  {info.year}
                </p>
                <p class="text-xs text-gray-400">{info.timeRange}</p>
              {/if}
              <p class="mt-2 text-xs leading-relaxed text-gray-500">{event.location}</p>
              {#if event.locationUrl && event.locationUrl !== '#'}
                <a
                  href={event.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-3 inline-flex w-fit items-center gap-1 rounded-full border border-[#F0A269]/50 px-3 py-1 text-xs text-[#F0A269] transition hover:bg-[#F0A269]/10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Lihat Lokasi
                </a>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>
