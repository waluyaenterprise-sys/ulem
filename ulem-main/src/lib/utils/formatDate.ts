const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

export function formatIndonesianDate(dateStr: string, startTime?: string, endTime?: string): {
  dayName: string;
  day: number;
  monthName: string;
  year: number;
  hours: string;
  minutes: string;
  timeRange: string;
  formatted: string;
} {
  const date = new Date(dateStr);
  const wib = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  const dayName = DAYS[wib.getUTCDay()];
  const day = wib.getUTCDate();
  const monthName = MONTHS[wib.getUTCMonth()];
  const year = wib.getUTCFullYear();

  let hours = '00';
  let minutes = '00';
  let timeRange = '';

  if (startTime) {
    const [h, m] = startTime.split(':');
    hours = h || '00';
    minutes = m || '00';
    timeRange = `${hours}:${minutes} WIB`;
    if (endTime) {
      const [eh, em] = endTime.split(':');
      timeRange = `${hours}:${minutes} - ${eh || '00'}:${em || '00'} WIB`;
    }
  } else {
    hours = String(wib.getUTCHours()).padStart(2, '0');
    minutes = String(wib.getUTCMinutes()).padStart(2, '0');
    timeRange = `${hours}:${minutes} WIB`;
  }

  return {
    dayName,
    day,
    monthName,
    year,
    hours,
    minutes,
    timeRange,
    formatted: `${dayName}, ${day} ${monthName} ${year} pukul ${timeRange}`
  };
}
