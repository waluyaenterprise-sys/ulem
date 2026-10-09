<script lang="ts">
  import { formatIndonesianDate } from '$lib/utils/formatDate';
  import { onMount, onDestroy } from 'svelte';

  export let invitation: any;

  const akadEvent = invitation?.events?.find((e: any) => e.type === 'akad');
  const resepsiEvent = invitation?.events?.find((e: any) => e.type === 'reception');

  const akadDate: string = akadEvent?.date ?? '';
  const resepsiDate: string = resepsiEvent?.date ?? '';
  const akadLocation: string = akadEvent?.location ?? 'Lokasi tidak tersedia';
  const resepsiLocation: string = resepsiEvent?.location ?? 'Lokasi tidak tersedia';
  const akadGoogleMapsLink: string = akadEvent?.locationUrl ?? '#';
  const resepsiGoogleMapsLink: string = resepsiEvent?.locationUrl ?? '#';

  type TimeLeft = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };

  let timeLeft = {
    akad: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    resepsi: { days: 0, hours: 0, minutes: 0, seconds: 0 }
  };

  function calculateTimeLeft(targetDateStr: string): TimeLeft {
    if (!targetDateStr) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const diff = new Date(targetDateStr).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };
  }

  const interval = setInterval(() => {
    timeLeft = {
      akad: calculateTimeLeft(akadDate),
      resepsi: calculateTimeLeft(resepsiDate)
    };
  }, 1000);

  onDestroy(() => clearInterval(interval));

  // 👇 SCROLL TRIGGER
  let visible = false;
  let sectionEl: HTMLElement;

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionEl) observer.observe(sectionEl);
  });

  const akadInfo =
    typeof formatIndonesianDate(akadDate) === 'string' ? null : formatIndonesianDate(akadDate);
  const resepsiInfo =
    typeof formatIndonesianDate(resepsiDate) === 'string'
      ? null
      : formatIndonesianDate(resepsiDate);
</script>

<section
  bind:this={sectionEl}
  class="relative flex min-h-svh w-full items-center justify-center overflow-hidden py-30"
>
  <img src="/assets/root.svg" class="pointer-events-none absolute top-0 left-0 w-full" alt="" />
  <img
    src="/assets/harbor.svg"
    class="pointer-events-none absolute -right-3 -bottom-35 scale-170"
    alt=""
  />

  <div
    class="
			relative mx-auto w-10/12 overflow-hidden rounded-full border bg-white pb-20 text-center font-jomolhari
			transition-all duration-1500
			ease-[cubic-bezier(0.16,1,0.3,1)]
		"
    class:opacity-0={!visible}
    class:translate-y-16={!visible}
  >
    <img
      src="/assets/jellyfish.svg"
      alt="Wave"
      class="jelly pointer-events-none absolute top-10 -right-10 scale-100"
    />

    <img
      src="/assets/jellyfish.svg"
      alt="Wave"
      class="jelly pointer-events-none absolute top-80 -left-15 scale-100"
    />

    <img
      src="/assets/jellyfish.svg"
      alt="Wave"
      class="jelly jelly-delay-1 pointer-events-none absolute -right-10 bottom-0 scale-100"
    />
    <!-- AKAD -->
    <div
      class="relative z-20 transition-all delay-200 duration-1200"
      class:opacity-0={!visible}
      class:translate-y-10={!visible}
    >
      <h1 class="mt-20 font-script text-5xl">Akad Nikah</h1>
      <p class="mt-4 text-xl font-bold uppercase">
        {akadInfo?.dayName} <br />
        {akadInfo?.day}
        {akadInfo?.monthName}
        {akadInfo?.year}
      </p>
      <p class="mt-2 text-xl">{akadInfo?.hours}:{akadInfo?.minutes} - Selesai</p>

      <div class="my-6 flex justify-center gap-3">
        {#each ['days', 'hours', 'minutes', 'seconds'] as unit}
          <div class="flex flex-col items-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f9f9f6]">
              <span class="font-semibold">
                {timeLeft.akad[unit as keyof TimeLeft]}
              </span>
            </div>
            <span class="mt-1 text-[11px] text-gray-500 capitalize">{unit}</span>
          </div>
        {/each}
      </div>

      <p class="mb-4 text-sm">{akadLocation}</p>
      <a
        href={akadGoogleMapsLink}
        class="inline-flex rounded-full border px-5 py-2 text-sm transition hover:bg-gray-100"
      >
        Lihat Lokasi
      </a>
    </div>

    <!-- RESEPSI -->
    <div
      class=" relative z-20 transition-all delay-600 duration-1200"
      class:opacity-0={!visible}
      class:translate-y-10={!visible}
    >
      <h1 class="mt-16 font-script text-5xl">Resepsi</h1>
      <p class="mt-4 text-xl font-bold uppercase">
        {resepsiInfo?.dayName} <br />
        {resepsiInfo?.day}
        {resepsiInfo?.monthName}
        {resepsiInfo?.year}
      </p>
      <p class="mt-2 text-xl">{resepsiInfo?.hours}:{resepsiInfo?.minutes} - Selesai</p>

      <div class=" my-6 flex justify-center gap-3">
        {#each ['days', 'hours', 'minutes', 'seconds'] as unit}
          <div class="flex flex-col items-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f9f9f6]">
              <span class="font-semibold">
                {timeLeft.resepsi[unit as keyof TimeLeft]}
              </span>
            </div>
            <span class="mt-1 text-[11px] text-gray-500 capitalize">{unit}</span>
          </div>
        {/each}
      </div>

      <p class="mb-4 text-sm">{resepsiLocation}</p>
      <a
        href={resepsiGoogleMapsLink}
        class="inline-flex rounded-full border px-5 py-2 text-sm transition hover:bg-gray-100"
      >
        Lihat Lokasi
      </a>
    </div>
  </div>
</section>
