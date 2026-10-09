// src/routes/wedding/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$env/static/public';

const API_BASE = PUBLIC_API_URL;

async function fetchInvitationWithTimeout(url: string): Promise<Response | null> {
  if (!API_BASE) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// ── Demo data ─────────────────────────────────────────────────────────────
const DEMO_BASE = {
  groom: {
    name: 'John Doe',
    father: 'Mr. Doe',
    mother: 'Mrs. Doe',
    notes: 'Putra ke-1 dari 4 bersaudara',
    socialMedia: {
      instagram: 'https://instagram.com/john_doe',
      facebook: 'https://facebook.com/john.doe'
    },
    imageUrls: ['/images/default/groom.png']
  },
  bride: {
    name: 'Jane Smith',
    father: 'Mr. Smith',
    mother: 'Mrs. Smith',
    notes: 'Putri ke-1 dari satu bersaudara',
    socialMedia: {
      instagram: 'https://instagram.com/jane_smith',
      facebook: 'https://facebook.com/jane.smith'
    },
    imageUrls: ['/images/default/bride.jpg']
  },
  cover: { imageUrls: ['/images/default/couple-11.jpeg'] },
  quote: {
    text: '',
    source: '',
    imageUrls: ['/images/default/couple-1.jpeg', '/images/default/couple-16.jpeg']
  },
  gallery: {
    imageUrls: Array.from({ length: 11 }, (_, i) => `/images/default/couple-${i + 1}.jpeg`)
  },
  events: [
    {
      type: 'akad',
      title: 'Akad Nikah',
      date: '2026-10-18T00:00:00',
      startTime: '08:00',
      endTime: '10:00',
      location: 'Kediaman Mempelai Wanita',
      locationUrl: 'https://goo.gl/maps/akad-location',
      imageUrls: ['/images/default/couple-2.jpeg']
    },
    {
      type: 'reception',
      title: 'Resepsi',
      date: '2026-10-18T00:00:00',
      startTime: '13:00',
      endTime: '17:00',
      location: 'Gedung Serbaguna Harmoni',
      locationUrl: 'https://goo.gl/maps/resepsi-location',
      imageUrls: ['/images/default/couple-3.jpeg']
    }
  ],
  gifts: [
    {
      type: 'bank',
      name: 'BCA',
      accountNumber: '1234567890',
      accountHolder: 'John Doe',
      imageUrls: []
    },
    {
      type: 'physical',
      description: 'Kami menerima kado fisik di Jl. Bahagia No. 123, Jakarta.',
      imageUrls: []
    }
  ],
  loveStories: [
    {
      title: 'First Meeting',
      date: '2020-01-15',
      description:
        'Takdir mempertemukan kami dalam sebuah momen sederhana. Dari perkenalan yang hangat, tumbuh rasa nyaman dan saling mengenal, hingga kami percaya bahwa pertemuan ini adalah awal perjalanan bersama.',
      imageUrl: '/images/default/couple-4.jpeg'
    },
    {
      title: 'First Date',
      date: '2020-02-14',
      description:
        'Kami menjalani hari demi hari dengan penuh cerita, tawa, dan pelajaran. Setiap proses menguatkan keyakinan bahwa cinta terbaik adalah saling mendukung, memahami, dan bertumbuh bersama.',
      imageUrl: '/images/default/couple-5.jpeg'
    },
    {
      title: 'Engagement',
      date: '2020-02-14',
      description:
        'Dengan restu kedua keluarga, kami mengikat komitmen melalui lamaran. Momen ini menjadi langkah pasti menuju masa depan yang kami impikan, penuh cinta, harapan, dan kebersamaan.',
      imageUrl: '/images/default/couple-5.jpeg'
    }
  ],
  loveStoryVideos: [],
  closing: { message: 'Thank you for being part of our special day.', imageUrls: [] },
  songUrl:
    'https://tyrueyturi.my.id/invitations/song/Banda%20Neira%20-%20Sampai%20Jadi%20Debu%20cut.mp3'
};

const DEMO_THEMES = [
  'lumiere',
  'minimalist',
  'elegant',
  'velvet',
  'aurum',
  'voyage',
  'hana',
  'carte',
  'chronicle',
  'reel',
  'scroll',
  'lens',
  'frame',
  'deck',
  'garden',
  'rustic',
  'creamy',
  'florist',
  'floris',
  'sunda',
  'meadow',
  'floral',
  'earth',
  'fire',
  'ocean',
  'sky'
] as const;
type DemoTheme = (typeof DEMO_THEMES)[number];

const DEMO_SLUGS: Record<string, DemoTheme> = Object.fromEntries(
  DEMO_THEMES.map((t) => [`demo-${t}`, t])
);

// ── Load ──────────────────────────────────────────────────────────────────
export async function load({ params, url, fetch }: any) {
  const { slug } = params;
  const guestName = url.searchParams.get('to') || 'GUEST';

  // Return demo data without hitting the API
  if (slug in DEMO_SLUGS) {
    const theme = DEMO_SLUGS[slug];
    return {
      templateId: theme,
      siteOrigin: url.origin,
      isPublished: true,
      eventData: { ...DEMO_BASE, slug, theme, guestName }
    };
  }

  const res = await fetchInvitationWithTimeout(`${API_BASE}/invitations/${slug}`);
  if (!res) {
    throw error(404, 'Undangan tidak ditemukan');
  }

  if (res.status === 404) throw error(404, 'Undangan tidak ditemukan');
  if (!res.ok) throw error(500, 'Gagal memuat undangan');

  const invitation = await res.json();

  return {
    templateId: invitation.template.slug,
    siteOrigin: url.origin,
    isPublished: invitation.isPublished,
    eventData: {
      slug: invitation.slug,
      theme: invitation.template.slug,
      songUrl: invitation.songUrl,
      groom: invitation.groom,
      bride: invitation.bride,
      cover: invitation.cover,
      quote: invitation.quote,
      gallery: invitation.gallery,
      events: invitation.events,
      gifts: invitation.gifts,
      loveStories: invitation.loveStories,
      loveStoryVideos: invitation.loveStoryVideos,
      closing: invitation.closing,
      guestName
    }
  };
}
