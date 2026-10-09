import { PUBLIC_API_URL } from '$env/static/public';

const API_BASE = PUBLIC_API_URL;

export type RsvpPresence = 'hadir' | 'mungkin' | 'tidak';

export interface Rsvp {
  id: string;
  name: string;
  presence: RsvpPresence;
  message: string | null;
  createdAt: string;
}

export async function fetchRsvps(slug: string): Promise<Rsvp[]> {
  const res = await fetch(`${API_BASE}/rsvps/${slug}`);
  if (!res.ok) return [];
  return res.json();
}

export async function submitRsvp(
  slug: string,
  data: { name: string; presence: RsvpPresence; message?: string }
): Promise<Rsvp> {
  const res = await fetch(`${API_BASE}/rsvps/${slug}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Gagal mengirim konfirmasi');
  }
  return res.json();
}

export function formatRsvpTime(isoString: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short'
  }).format(new Date(isoString));
}
