<!-- src/lib/templates/elegant/sections/Dates.svelte -->
<script lang="ts">
  import { formatIndonesianDate } from '$lib/utils/formatDate';
  import { onDestroy } from 'svelte';

  // ✅ Terima dari luar
  export let invitation;

  // ambil array
  const events = invitation?.events ?? [];

  // cari event berdasarkan type
  const akadEvent = events.find((e: any) => e.type === 'akad');
  const receptionEvent = events.find((e: any) => e.type === 'reception');

  // derived data
  const akadDate = akadEvent?.date ?? '';
  const resepsiDate = receptionEvent?.date ?? '';

  const akadLocation = akadEvent?.location ?? 'Lokasi tidak tersedia';
  const resepsiLocation = receptionEvent?.location ?? 'Lokasi tidak tersedia';

  const akadGoogleMapsLink = akadEvent?.locationUrl ?? '#';
  const resepsiGoogleMapsLink = receptionEvent?.locationUrl ?? '#';

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

    const targetDate = new Date(targetDateStr);
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  // Update setiap detik
  const interval = setInterval(() => {
    timeLeft = {
      akad: calculateTimeLeft(akadDate),
      resepsi: calculateTimeLeft(resepsiDate)
    };
  }, 1000);

  onDestroy(() => {
    clearInterval(interval);
  });

  const akadInfo =
    typeof formatIndonesianDate(akadDate) === 'string' ? null : formatIndonesianDate(akadDate);
  const resepsiInfo =
    typeof formatIndonesianDate(resepsiDate) === 'string'
      ? null
      : formatIndonesianDate(resepsiDate);
</script>

<section class="bg-[#f0f1ec] py-20">
  <div class="mx-auto max-w-lg px-5 text-center">
    <h2 class="mb-16 font-script text-4xl">Wedding Day</h2>

    <!-- AKAD -->
    <div class="rounded-2xl bg-white p-6 shadow-sm">
      <h3 class="mb-1 font-heading text-xl">Akad Nikah</h3>
      <p class="text-sm text-gray-600">
        {akadInfo?.dayName}, {akadInfo?.day}
        {akadInfo?.monthName}
        {akadInfo?.year}
      </p>
      <p class="mb-4 font-heading">{akadInfo?.hours}:{akadInfo?.minutes} - Selesai</p>
      <div class="mb-6 flex justify-center gap-3">
        {#each ['days', 'hours', 'minutes', 'seconds'] as unit}
          <div class="flex flex-col items-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f9f9f6]">
              <span class="text-base font-semibold tracking-wide">
                {timeLeft.akad[unit as keyof TimeLeft] ?? '--'}
              </span>
            </div>
            <span class="mt-1 text-[11px] text-gray-500 capitalize">{unit}</span>
          </div>
        {/each}
      </div>

      <div class="rounded-xl bg-[#f9f9f6] p-4">
        <p class="mb-4 text-sm text-gray-700">{akadLocation}</p>
        <a
          href={akadGoogleMapsLink}
          class="inline-flex rounded-full border border-gray-300 px-5 py-2 text-sm transition hover:bg-gray-100"
        >
          Lihat Lokasi
        </a>
      </div>
    </div>

    <!-- DIVIDER -->
    <div class="my-16 flex items-center justify-center">
      <span class="h-px w-16 bg-gray-300"></span>
      <span class="mx-4 font-script text-xl opacity-50">&</span>
      <span class="h-px w-16 bg-gray-300"></span>
    </div>

    <!-- RESEPSI -->
    <div class="rounded-2xl bg-white p-6 shadow-sm">
      <h3 class="mb-1 font-heading text-xl">Resepsi Pernikahan</h3>
      <p class=" text-sm text-gray-600">
        {resepsiInfo?.dayName}, {resepsiInfo?.day}
        {resepsiInfo?.monthName}
        {resepsiInfo?.year}
      </p>
      <p class="mb-4 font-heading">{resepsiInfo?.hours}:{resepsiInfo?.minutes} - Selesai</p>

      <div class="mb-6 flex justify-center gap-3">
        {#each ['days', 'hours', 'minutes', 'seconds'] as unit}
          <div class="flex flex-col items-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f9f9f6]">
              <span class="text-base font-semibold tracking-wide">
                {timeLeft.resepsi[unit as keyof TimeLeft] ?? '--'}
              </span>
            </div>
            <span class="mt-1 text-[11px] text-gray-500 capitalize">{unit}</span>
          </div>
        {/each}
      </div>

      <div class="rounded-xl bg-[#f9f9f6] p-4">
        <p class="mb-4 text-sm text-gray-700">{resepsiLocation}</p>
        <a
          href={resepsiGoogleMapsLink}
          class="inline-flex rounded-full border border-gray-300 px-5 py-2 text-sm transition hover:bg-gray-100"
        >
          Lihat Lokasi
        </a>
      </div>
    </div>
  </div>
</section>
