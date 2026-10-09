<script lang="ts">
  import { onMount } from 'svelte';
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';
  import { formatIndonesianDate } from '$lib/utils/formatDate';
  import { fetchRsvps, formatRsvpTime, submitRsvp, type Rsvp } from '$lib/rsvp';
  import Credit from '$lib/Credit.svelte';

  export let invitation: any;

  // Derived data
  const bride = invitation.bride ?? {};
  const groom = invitation.groom ?? {};
  const brideFullName = bride.name || 'BRIDE';
  const groomFullName = groom.name || 'GROOM';
  const brideFirstName = brideFullName.split(' ')[0];
  const groomFirstName = groomFullName.split(' ')[0];
  const groomNameStyle = getAdaptiveNameStyle(groomFirstName, {
    maxRem: 2.0,
    minRem: 1.0,
    endAt: 18
  });
  const brideNameStyle = getAdaptiveNameStyle(brideFirstName, {
    maxRem: 2.0,
    minRem: 1.0,
    endAt: 18
  });
  const brideProfileNameStyle = getAdaptiveNameStyle(brideFullName, {
    maxRem: 1.875,
    minRem: 1.0,
    startAt: 16,
    endAt: 32
  });
  const groomProfileNameStyle = getAdaptiveNameStyle(groomFullName, {
    maxRem: 1.875,
    minRem: 1.0,
    startAt: 16,
    endAt: 32
  });
  const galleryImages: string[] = invitation.gallery?.imageUrls ?? [];
  const creamyGalleryImages = galleryImages.slice(0, 20);
  const creamyGallerySliderImages = creamyGalleryImages.slice(3, -1);
  const creamyGalleryLandscapeImage =
    creamyGalleryImages.length > 3 ? creamyGalleryImages[creamyGalleryImages.length - 1] : null;
  const heroPhoto: string | null = invitation.cover?.imageUrls?.[0] ?? galleryImages[0] ?? null;
  const quotePhoto: string = invitation.quote?.imageUrls?.[0] ?? heroPhoto ?? '/images/default/couple-11.jpeg';
  const closingPhoto: string | null = invitation.closing?.imageUrls?.[0] ?? heroPhoto;
  const closingMessage: string = invitation.closing?.message || 'Suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami. Kami yang berbahagia.';

  function igHandle(person: any): string | null {
    const url: string = person?.socialMedia?.instagram ?? '';
    if (!url) return null;
    const handle = url.split('/').filter(Boolean).pop() ?? '';
    return handle ? `@${handle.replace(/^@/, '')}` : null;
  }
  const brideIg = igHandle(bride);
  const groomIg = igHandle(groom);

  const washColors = [
    { bg: 'bg-[#c97b8b]/10', border: 'border-[#c97b8b]/20', shadow: 'shadow-[#c97b8b]/10' },
    { bg: 'bg-[#1e3a5f]/10', border: 'border-[#1e3a5f]/20', shadow: 'shadow-[#1e3a5f]/10' },
    { bg: 'bg-[#f5f0e8]', border: 'border-[#e8e0d5]', shadow: 'shadow-[#6b1f1f]/5' }
  ];
  const cardRotations = [-2, 1.5, -1, 2, -1.5, 1];

  const events = invitation?.events ?? [];
  const akadEvent = events.find((e: any) => e.type === 'akad');
  const receptionEvent = events.find((e: any) => e.type === 'reception');
  const loveStories = invitation?.loveStories ?? [];
  const gifts = invitation?.gifts ?? [];
  const bankAccounts = gifts.filter((g: any) => g.type === 'bank' || g.type === 'eWallet');
  const physicalGifts = gifts.filter((g: any) => g.type === 'physical');

  function formatStoryDate(date: string) {
    const calendarDate = date.slice(0, 10);
    return formatIndonesianDate(`${calendarDate}T00:00:00.000Z`);
  }

  const verseFullText = invitation?.quote?.text ||
    'Di antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa cinta dan kasih sayang.';
  const quoteSource = invitation?.quote?.source || 'QS. Ar-Rum: 21';

  // Scroll-driven story twine
  let scrollY = 0;
  let ticking = false;
  let storyEl: HTMLElement;
  let storyContainer: HTMLElement;
  let storyHeight = 1000;
  let storyProgress = 0;
  let storyLineLength = 1000;
  let storyPathD = '';

  onMount(() => {
    function update() {
      scrollY = window.scrollY || window.pageYOffset;
      if (storyEl && storyContainer) {
        storyHeight = storyContainer.offsetHeight;
        const sectionTop = storyEl.getBoundingClientRect().top + scrollY;
        const startTrigger = window.innerHeight * 0.35;
        const endTrigger = storyHeight;
        const range = Math.max(1, endTrigger - startTrigger);
        storyProgress = Math.max(0, Math.min(1, (scrollY - sectionTop + startTrigger) / range));
      }
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  });

  function cubicLen(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): number {
    let len = 0;
    let lx = x0,
      ly = y0;
    for (let t = 1; t <= 24; t++) {
      const u = t / 24,
        v = 1 - u;
      const cx = v * v * v * x0 + 3 * v * v * u * x1 + 3 * v * u * u * x2 + u * u * u * x3;
      const cy = v * v * v * y0 + 3 * v * v * u * y1 + 3 * v * u * u * y2 + u * u * u * y3;
      len += Math.hypot(cx - lx, cy - ly);
      lx = cx;
      ly = cy;
    }
    return len;
  }

  function buildVinePath(n: number, h: number, containerW = 430) {
    if (n === 0 || h <= 0) return { d: '', len: 1000 };
    const segH = h / n;
    const photoOff = Math.round(containerW * 0.22);
    const wanderOff = Math.round(containerW * 0.06);
    const points: { x: number; y: number }[] = [];
    let px = 0,
      py = 0;

    for (let i = 0; i < n; i++) {
      const isLeft = i % 2 === 0;
      const tx = photoOff * (isLeft ? -1 : 1);
      const ty = i * segH + segH / 2;
      const segLen = Math.hypot(tx - px, ty - py) || 1;
      const nx = -(ty - py) / segLen;
      const ny = (tx - px) / segLen;
      for (let s = 1; s <= 30; s++) {
        const t = s / 30;
        const wander = Math.sin(t * Math.PI * 1.2 + i * 0.8) * wanderOff;
        points.push({ x: px + (tx - px) * t + nx * wander, y: py + (ty - py) * t + ny * wander });
      }
      px = tx;
      py = ty;
    }

    const m = points.length;
    if (m < 2) return { d: '', len: 1000 };
    let d = `M ${points[0].x},${points[0].y}`;
    let total = 0;
    for (let k = 0; k < m - 1; k++) {
      const prev = points[Math.max(0, k - 1)];
      const curr = points[k];
      const next = points[k + 1];
      const next2 = points[Math.min(m - 1, k + 2)];
      const cp1x = curr.x + (next.x - prev.x) / 6;
      const cp1y = curr.y + (next.y - prev.y) / 6;
      const cp2x = next.x - (next2.x - curr.x) / 6;
      const cp2y = next.y - (next2.y - curr.y) / 6;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
      total += cubicLen(curr.x, curr.y, cp1x, cp1y, cp2x, cp2y, next.x, next.y);
    }
    return { d, len: total };
  }

  $: ({ d: storyPathD, len: storyLineLength } = buildVinePath(
    loveStories.length,
    storyHeight,
    storyContainer?.clientWidth ?? 430
  ));

  // Reveal action
  function reveal(node: HTMLElement, delay: number = 0) {
    const existingTransform = node.style.transform || '';
    node.style.opacity = '0';
    node.style.transform = existingTransform
      ? `${existingTransform} translateY(32px)`
      : 'translateY(32px)';
    node.style.transition = `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = existingTransform
            ? `${existingTransform} translateY(0)`
            : 'translateY(0)';
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );
    observer.observe(node);

    return {
      destroy() {
        observer.disconnect();
      }
    };
  }

  // Countdown for events
  type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

  let akadTimeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  let resepsiTimeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  function calcTimeLeft(dateStr: string): TimeLeft {
    if (!dateStr) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const diff = new Date(dateStr).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000)
    };
  }

  let countdownTimer: ReturnType<typeof setInterval>;
  onMount(() => {
    countdownTimer = setInterval(() => {
      akadTimeLeft = calcTimeLeft(akadEvent?.date ?? '');
      resepsiTimeLeft = calcTimeLeft(receptionEvent?.date ?? '');
    }, 1000);
    return () => clearInterval(countdownTimer);
  });

  // Event dates are stored as the calendar date, while the editable event
  // hours live in startTime/endTime. Keep both values in the rendered label.
  const akadDate = akadEvent?.date
    ? formatIndonesianDate(akadEvent.date, akadEvent.startTime, akadEvent.endTime)
    : null;
  const resepsiDate = receptionEvent?.date
    ? formatIndonesianDate(receptionEvent.date, receptionEvent.startTime, receptionEvent.endTime)
    : null;

  // RSVP state
  let rsvpName = '';
  let rsvpPresence: 'hadir' | 'tidak' | null = null;
  let rsvpMessage = '';
  let rsvpSubmitted = false;
  let rsvpSubmitting = false;
  let rsvpError = '';

  let wishes: Rsvp[] = [];
  let wishesPage = 1;
  const wishesLimit = 8;
  $: pagedWishes = wishes.slice(0, wishesPage * wishesLimit);
  $: wishesHasMore = pagedWishes.length < wishes.length;

  onMount(async () => {
    if (invitation?.slug) {
      wishes = await fetchRsvps(invitation.slug);
    }
  });

  async function handleSubmitRsvp() {
    if (!rsvpName.trim()) {
      rsvpError = 'Nama tidak boleh kosong.';
      return;
    }
    if (!rsvpPresence) {
      rsvpError = 'Pilih konfirmasi kehadiran.';
      return;
    }
    rsvpError = '';
    rsvpSubmitting = true;
    try {
      await submitRsvp(invitation.slug, {
        name: rsvpName.trim(),
        presence: rsvpPresence,
        message: rsvpMessage.trim() || undefined
      });
      rsvpName = '';
      rsvpPresence = null;
      rsvpMessage = '';
      rsvpSubmitted = true;
      wishes = await fetchRsvps(invitation.slug);
      setTimeout(() => (rsvpSubmitted = false), 4000);
    } catch (e: any) {
      rsvpError = e.message ?? 'Gagal mengirim konfirmasi.';
    } finally {
      rsvpSubmitting = false;
    }
  }

  // Copy to clipboard
  function copyToClipboard(text: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }
  function fallbackCopy(text: string) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
</script>

<main class="rustic-main relative overflow-x-hidden text-[#1a1a1a]">
  <!-- SECTION: QUOTE — Full photo with dark overlay -->
  <section class="quote-floral-style relative min-h-svh w-full overflow-hidden">
    <img
      src="/images/floral/floral-side.png"
      alt=""
      class="quote-side quote-side-left pointer-events-none absolute z-[3]"
    />
    <img
      src="/images/floral/floral-side.png"
      alt=""
      class="quote-side quote-side-right pointer-events-none absolute z-[3] scale-x-[-1]"
    />

    <!-- z-10: Verse text enters as a whole -->
    <div class="quote-inner relative z-10 flex flex-col items-center px-6">
      <div use:reveal={150} class="mx-auto max-w-sm text-center font-love">
        <p class="quote-welcome mb-3 text-xs tracking-[0.28em] uppercase">
          A little note of love
        </p>
        <p class="quote-mark font-script text-5xl leading-none">“</p>
        <p class="text-sm leading-relaxed sm:text-base">
          {verseFullText}
        </p>
        <p class="mt-4 font-love text-xs italic">{quoteSource}</p>
      </div>
    </div>

    <!-- z-20: 3 Butterflies near text -->
    <img
      src="/images/watercolor/bf-1.png"
      alt=""
      class="float-gentle pointer-events-none absolute top-[14%] left-[18%] z-20 w-6 object-contain sm:w-8"
      style="--float-dur:4s; --float-del:0s;"
    />
    <img
      src="/images/watercolor/bf-2.png"
      alt=""
      class="float-gentle pointer-events-none absolute top-[18%] right-[22%] z-20 w-5 scale-x-[-1] object-contain sm:w-7"
      style="--float-dur:5s; --float-del:1.2s;"
    />
    <img
      src="/images/watercolor/bf-3.png"
      alt=""
      class="float-gentle pointer-events-none absolute top-[10%] left-[48%] z-20 w-7 object-contain sm:w-9"
      style="--float-dur:4.5s; --float-del:0.6s;"
    />

    <!-- z-45: 4 Butterflies near flowers -->
    <img
      src="/images/watercolor/bf-1.png"
      alt=""
      class="float-gentle pointer-events-none absolute bottom-[18%] left-[12%] z-45 w-6 scale-x-[-1] object-contain sm:w-8"
      style="--float-dur:5s; --float-del:0.3s;"
    />
    <img
      src="/images/watercolor/bf-2.png"
      alt=""
      class="float-gentle pointer-events-none absolute right-[15%] bottom-[22%] z-45 w-5 object-contain sm:w-7"
      style="--float-dur:4s; --float-del:1.5s;"
    />
    <img
      src="/images/watercolor/bf-3.png"
      alt=""
      class="float-gentle pointer-events-none absolute bottom-[15%] left-[38%] z-45 w-6 scale-x-[-1] object-contain sm:w-8"
      style="--float-dur:5.5s; --float-del:0.9s;"
    />
    <img
      src="/images/watercolor/bf-1.png"
      alt=""
      class="float-gentle pointer-events-none absolute right-[38%] bottom-[20%] z-45 w-5 object-contain sm:w-7"
      style="--float-dur:4.2s; --float-del:1.8s;"
    />

    <!-- Couple photo (cover) disembunyikan sementara; simpan untuk dipakai kembali bila diperlukan.
    {#if heroPhoto}
      <div
        use:reveal={300}
        class="absolute top-[42%] left-1/2 z-25 w-40 -translate-x-1/2 rotate-[-2deg] sm:top-[42%] sm:w-44"
      >
        <div class="wood-photo-frame">
          <div class="relative overflow-hidden rounded-[3px]">
            <img src={heroPhoto} alt="" class="aspect-[4/5] w-full object-cover" />
          </div>
        </div>
      </div>
    {/if}
    -->

    <!-- z-30: Deep background flowers (smallest, far behind) -->
    <img
      use:reveal={0}
      src="/images/watercolor/flo-3.png"
      alt=""
      class="pointer-events-none absolute -bottom-4 left-[4%] z-30 h-20 object-contain sm:h-28"
    />
    <img
      use:reveal={50}
      src="/images/watercolor/flo-6.png"
      alt=""
      class="pointer-events-none absolute -bottom-4 left-[22%] z-30 h-24 object-contain sm:h-32"
    />
    <img
      use:reveal={100}
      src="/images/watercolor/flo-2.png"
      alt=""
      class="pointer-events-none absolute -bottom-4 left-[40%] z-30 h-20 object-contain sm:h-28"
    />
    <img
      use:reveal={150}
      src="/images/watercolor/flo-5.png"
      alt=""
      class="pointer-events-none absolute -bottom-4 left-[56%] z-30 h-24 object-contain sm:h-32"
    />
    <img
      use:reveal={200}
      src="/images/watercolor/flo-7.png"
      alt=""
      class="pointer-events-none absolute -bottom-4 left-[72%] z-30 h-20 object-contain sm:h-28"
    />
    <img
      use:reveal={250}
      src="/images/watercolor/flo-4.png"
      alt=""
      class="pointer-events-none absolute -bottom-4 left-[88%] z-30 h-24 object-contain sm:h-32"
    />

    <!-- z-35: Mid-layer flowers (medium) -->
    <img
      use:reveal={300}
      src="/images/watercolor/flo-5.png"
      alt=""
      class="pointer-events-none absolute -bottom-2 left-[8%] z-35 h-28 object-contain sm:h-36"
    />
    <img
      use:reveal={350}
      src="/images/watercolor/flo-1.png"
      alt=""
      class="pointer-events-none absolute -bottom-2 left-[16%] z-35 h-24 object-contain sm:h-32"
    />
    <img
      use:reveal={400}
      src="/images/watercolor/flo-7.png"
      alt=""
      class="pointer-events-none absolute -bottom-2 left-[28%] z-35 h-28 scale-x-[-1] object-contain sm:h-36"
    />
    <img
      use:reveal={450}
      src="/images/watercolor/flo-3.png"
      alt=""
      class="pointer-events-none absolute -bottom-2 left-[36%] z-35 h-24 object-contain sm:h-32"
    />
    <img
      use:reveal={500}
      src="/images/watercolor/flo-2.png"
      alt=""
      class="pointer-events-none absolute -bottom-2 left-[46%] z-35 h-28 object-contain sm:h-36"
    />
    <img
      use:reveal={550}
      src="/images/watercolor/flo-6.png"
      alt=""
      class="pointer-events-none absolute -bottom-2 left-[52%] z-35 h-24 scale-x-[-1] object-contain sm:h-32"
    />
    <img
      use:reveal={600}
      src="/images/watercolor/flo-4.png"
      alt=""
      class="pointer-events-none absolute -bottom-2 left-[62%] z-35 h-28 object-contain sm:h-36"
    />
    <img
      use:reveal={650}
      src="/images/watercolor/flo-1.png"
      alt=""
      class="pointer-events-none absolute -bottom-2 left-[70%] z-35 h-24 object-contain sm:h-32"
    />
    <img
      use:reveal={700}
      src="/images/watercolor/flo-5.png"
      alt=""
      class="pointer-events-none absolute -bottom-2 left-[80%] z-35 h-28 scale-x-[-1] object-contain sm:h-36"
    />
    <img
      use:reveal={750}
      src="/images/watercolor/flo-7.png"
      alt=""
      class="pointer-events-none absolute -bottom-2 left-[92%] z-35 h-24 object-contain sm:h-32"
    />

    <!-- z-40: Foreground flowers (biggest, front) -->
    <img
      use:reveal={800}
      src="/images/watercolor/flo-1.png"
      alt=""
      class="pointer-events-none absolute bottom-0 left-[1%] z-40 h-32 object-contain sm:h-48"
    />
    <img
      use:reveal={850}
      src="/images/watercolor/flo-2.png"
      alt=""
      class="pointer-events-none absolute bottom-0 left-[7%] z-40 h-24 object-contain sm:h-32"
    />
    <img
      use:reveal={900}
      src="/images/watercolor/flo-3.png"
      alt=""
      class="pointer-events-none absolute bottom-0 left-[12%] z-40 h-28 object-contain sm:h-40"
    />
    <img
      use:reveal={950}
      src="/images/watercolor/flo-4.png"
      alt=""
      class="pointer-events-none absolute bottom-0 left-[18%] z-40 h-24 scale-x-[-1] object-contain sm:h-32"
    />
    <img
      use:reveal={1000}
      src="/images/watercolor/flo-5.png"
      alt=""
      class="pointer-events-none absolute bottom-0 left-[24%] z-40 h-32 object-contain sm:h-48"
    />
    <img
      use:reveal={1050}
      src="/images/watercolor/flo-6.png"
      alt=""
      class="pointer-events-none absolute bottom-0 left-[30%] z-40 h-28 scale-x-[-1] object-contain sm:h-40"
    />
    <img
      use:reveal={1100}
      src="/images/watercolor/flo-7.png"
      alt=""
      class="pointer-events-none absolute bottom-0 left-[36%] z-40 h-32 object-contain sm:h-48"
    />
    <img
      use:reveal={1150}
      src="/images/watercolor/flo-1.png"
      alt=""
      class="pointer-events-none absolute bottom-0 left-[42%] z-40 h-24 object-contain sm:h-32"
    />
    <img
      use:reveal={1200}
      src="/images/watercolor/flo-2.png"
      alt=""
      class="pointer-events-none absolute bottom-0 left-[48%] z-40 h-28 object-contain sm:h-40"
    />
    <img
      use:reveal={1250}
      src="/images/watercolor/flo-3.png"
      alt=""
      class="pointer-events-none absolute bottom-0 left-[54%] z-40 h-24 object-contain sm:h-32"
    />
    <img
      use:reveal={1300}
      src="/images/watercolor/flo-4.png"
      alt=""
      class="pointer-events-none absolute bottom-0 left-[60%] z-40 h-32 scale-x-[-1] object-contain sm:h-48"
    />
    <img
      use:reveal={1350}
      src="/images/watercolor/flo-5.png"
      alt=""
      class="pointer-events-none absolute bottom-0 left-[66%] z-40 h-28 object-contain sm:h-40"
    />
    <img
      use:reveal={1400}
      src="/images/watercolor/flo-6.png"
      alt=""
      class="pointer-events-none absolute bottom-0 left-[72%] z-40 h-24 object-contain sm:h-32"
    />
    <img
      use:reveal={1450}
      src="/images/watercolor/flo-7.png"
      alt=""
      class="pointer-events-none absolute bottom-0 left-[78%] z-40 h-32 object-contain sm:h-48"
    />
    <img
      use:reveal={1500}
      src="/images/watercolor/flo-1.png"
      alt=""
      class="pointer-events-none absolute bottom-0 left-[84%] z-40 h-24 object-contain sm:h-32"
    />
    <img
      use:reveal={1550}
      src="/images/watercolor/flo-3.png"
      alt=""
      class="pointer-events-none absolute bottom-0 left-[90%] z-40 h-28 object-contain sm:h-40"
    />
  </section>
  <!-- SECTION: COUPLE — Storybook Portrait -->
  <div class="relative pt-24 pb-10 text-center" use:reveal={0}>
    <img
      src="/images/watercolor/cherry.png"
      alt=""
      class="pointer-events-none absolute top-[8%] left-[0%] z-0 h-32 rotate-[-8deg] object-contain sm:h-40"
    />
    <img
      src="/images/watercolor/white.png"
      alt=""
      class="pointer-events-none absolute top-[8%] right-[0%] z-0 h-32 scale-x-[-1] rotate-[8deg] object-contain sm:h-40"
    />
    <p class="font-love text-[10px] tracking-[0.3em] text-[#8a8a8a] uppercase">The Wedding of</p>
    <h2 class="mt-2 font-script text-5xl text-[#c97b8b] sm:text-6xl" style={brideNameStyle}>
      {brideFirstName}
    </h2>
    <h2 class="font-script text-5xl text-[#1a1a1a] sm:text-6xl" style={groomNameStyle}>
      {groomFirstName}
    </h2>
    {#if akadDate}
      <p class="mt-4 font-love text-sm text-[#8a8a8a]">
        {akadDate.dayName}, {akadDate.day}
        {akadDate.monthName}
        {akadDate.year}
      </p>
    {/if}
  </div>

  <!-- BRIDE — Sticker photo kiri, info kanan -->
  <section class="relative overflow-hidden py-16" use:reveal={0}>
    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(201,123,139,0.10),transparent_70%)]"
    ></div>
    <div class="relative mx-auto max-w-md px-6 sm:flex sm:items-center sm:gap-8">
      <!-- Sticker photo -->
      <div class="relative mx-auto w-3/4 sm:mx-0 sm:w-1/2">
        <div class="sticker rotate-[-2deg]">
          <img
            src={bride.imageUrls?.[0] ?? '/images/default/bride.jpg'}
            alt={brideFirstName}
            class="h-72 w-full rounded-2xl object-cover sm:h-80"
          />
        </div>
        <!-- Flowers around -->
        <img
          use:reveal={200}
          src="/images/watercolor/cherry.png"
          alt=""
          class="pointer-events-none absolute -top-6 -left-6 z-10 w-24 rotate-[12deg] object-contain sm:w-32"
        />
        <img
          use:reveal={300}
          src="/images/watercolor/white.png"
          alt=""
          class="pointer-events-none absolute -right-4 -bottom-4 z-10 w-20 rotate-[-20deg] object-contain sm:w-24"
        />
      </div>

      <!-- Info -->
      <div class="mt-8 text-center sm:mt-0 sm:w-1/2 sm:text-left">
        <p class="font-script text-3xl text-[#c97b8b]" style={brideProfileNameStyle}>
          {brideFullName}
        </p>
        {#if brideIg}
          <p
            class="mt-1 flex items-center justify-center gap-1 font-love text-xs text-[#8a8a8a] sm:justify-start"
          >
            <svg
              class="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              ><rect x="2" y="2" width="20" height="20" rx="5" /><path
                d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"
              /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg
            >
            {brideIg}
          </p>
        {/if}
        <p class="mt-3 font-love text-sm leading-relaxed text-[#4a4a4a]">
          Putri dari Bapak {bride.father ?? '-'} &amp; Ibu {bride.mother ?? '-'}
        </p>
        {#if bride.notes}
          <p class="mt-1 font-love text-xs tracking-wide text-[#8a8a8a]">{bride.notes}</p>
        {/if}
      </div>
    </div>
  </section>
  <!-- Flower divider -->
  <div class="relative flex items-end justify-center gap-2 py-4 sm:gap-3 sm:py-6">
    <img
      use:reveal={0}
      src="/images/watercolor/cherry.png"
      alt=""
      class="h-20 rotate-[-6deg] object-contain sm:h-28"
    />
    <img
      use:reveal={100}
      src="/images/watercolor/white.png"
      alt=""
      class="h-16 rotate-[3deg] object-contain sm:h-20"
    />
    <img
      use:reveal={200}
      src="/images/watercolor/navy.png"
      alt=""
      class="z-10 h-28 object-contain sm:h-36"
    />
    <img
      use:reveal={300}
      src="/images/watercolor/cherry.png"
      alt=""
      class="h-18 scale-x-[-1] rotate-[6deg] object-contain sm:h-22"
    />
    <img
      use:reveal={400}
      src="/images/watercolor/white.png"
      alt=""
      class="h-16 scale-x-[-1] rotate-[-3deg] object-contain sm:h-20"
    />
  </div>

  <!-- GROOM — Info kiri, sticker photo kanan -->
  <section class="relative overflow-hidden py-16" use:reveal={0}>
    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(30,58,95,0.08),transparent_70%)]"
    ></div>
    <div
      class="relative mx-auto max-w-md px-6 sm:flex sm:flex-row-reverse sm:items-center sm:gap-8"
    >
      <!-- Sticker photo -->
      <div class="relative mx-auto w-3/4 sm:mx-0 sm:w-1/2">
        <div class="sticker rotate-[2deg]">
          <img
            src={groom.imageUrls?.[0] ?? '/images/default/groom.png'}
            alt={groomFirstName}
            class="h-72 w-full rounded-2xl object-cover sm:h-80"
          />
        </div>
        <img
          use:reveal={200}
          src="/images/watercolor/navy.png"
          alt=""
          class="pointer-events-none absolute -top-6 -right-6 z-10 w-20 rotate-[-12deg] object-contain sm:w-28"
        />
        <img
          use:reveal={300}
          src="/images/watercolor/white.png"
          alt=""
          class="pointer-events-none absolute -bottom-4 -left-4 z-10 w-20 rotate-[20deg] object-contain sm:w-24"
        />
      </div>

      <!-- Info -->
      <div class="mt-8 text-center sm:mt-0 sm:w-1/2 sm:text-right">
        <p class="font-script text-3xl text-[#1e3a5f]" style={groomProfileNameStyle}>
          {groomFullName}
        </p>
        {#if groomIg}
          <p
            class="mt-1 flex items-center justify-center gap-1 font-love text-xs text-[#8a8a8a] sm:justify-end"
          >
            <svg
              class="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              ><rect x="2" y="2" width="20" height="20" rx="5" /><path
                d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"
              /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg
            >
            {groomIg}
          </p>
        {/if}
        <p class="mt-3 font-love text-sm leading-relaxed text-[#4a4a4a]">
          Putra dari Bapak {groom.father ?? '-'} &amp; Ibu {groom.mother ?? '-'}
        </p>
        {#if groom.notes}
          <p class="mt-1 font-love text-xs tracking-wide text-[#8a8a8a]">{groom.notes}</p>
        {/if}
      </div>
    </div>
  </section>
  <!-- SECTION: EVENTS — Hanging Wood Signs -->
  <section class="relative overflow-hidden py-20">
    <div class="linen-dark absolute inset-0"></div>
    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,123,139,0.10),transparent_60%)]"
    ></div>

    <img
      use:reveal={0}
      src="/images/watercolor/cherry.png"
      alt=""
      class="pointer-events-none absolute top-[8%] left-[2%] z-0 w-20 rotate-[-15deg] object-contain sm:w-28"
    />
    <img
      use:reveal={100}
      src="/images/watercolor/white.png"
      alt=""
      class="pointer-events-none absolute top-[12%] right-[3%] z-0 w-16 scale-x-[-1] rotate-[20deg] object-contain sm:w-22"
    />
    <img
      use:reveal={200}
      src="/images/watercolor/navy.png"
      alt=""
      class="pointer-events-none absolute bottom-[15%] left-[5%] z-0 w-18 rotate-[10deg] object-contain sm:w-24"
    />
    <img
      use:reveal={300}
      src="/images/watercolor/cherry.png"
      alt=""
      class="pointer-events-none absolute right-[2%] bottom-[10%] z-0 w-22 scale-x-[-1] rotate-[-8deg] object-contain sm:w-30"
    />

    <div class="relative z-10">
      <div use:reveal class="mb-14 text-center">
        <h2 class="font-script text-4xl text-[#1a1a1a] sm:text-5xl">Wedding Day</h2>
        <div class="mx-auto mt-3 h-px w-20 bg-[#6b1f1f]/40"></div>
      </div>

      <div class="mx-auto max-w-md space-y-14 px-5">
        <!-- Akad — papan kayu tergantung tali -->
        {#if akadEvent}
          <div use:reveal={0} class="relative pt-8">
            <div class="absolute top-0 left-10 h-9 border-l-2 border-dashed border-[#8b6f4e]"></div>
            <div
              class="absolute top-0 right-10 h-9 border-l-2 border-dashed border-[#8b6f4e]"
            ></div>

            <div class="wood-sign wood-light">
              <div class="relative">
                <div class="mb-4 flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#fdfbf7]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-[#6b1f1f]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <h3 class="font-script text-2xl text-white drop-shadow-sm">Akad Nikah</h3>
                </div>
                {#if akadDate}
                  <p class="font-love text-lg text-[#fdf9ef]">
                    {akadDate.dayName}, {akadDate.day}
                    {akadDate.monthName}
                    {akadDate.year}
                  </p>
                  <p class="mt-1 font-love text-sm text-[#f3d9df]">
                    {akadDate.timeRange}
                  </p>
                {/if}

                <!-- Countdown -->
                <div class="mt-6 flex justify-center gap-3">
                  {#each ['days', 'hours', 'minutes', 'seconds'] as unit}
                    <div class="flex flex-col items-center">
                      <span
                        class="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/15 text-sm font-semibold text-white shadow-inner sm:h-14 sm:w-14"
                      >
                        {akadTimeLeft[unit as keyof TimeLeft] ?? '--'}
                      </span>
                      <span class="mt-1.5 font-love text-[10px] text-[#f3ead9]/80 capitalize"
                        >{unit}</span
                      >
                    </div>
                  {/each}
                </div>

                <!-- Location -->
                <div class="mt-6 rounded-xl bg-white/10 p-4">
                  <div class="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="mt-0.5 h-4 w-4 shrink-0 text-[#f3d9df]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p class="font-love text-sm leading-relaxed text-[#fdf9ef]">
                      {akadEvent.location ?? 'Lokasi tidak tersedia'}
                    </p>
                  </div>
                  {#if akadEvent.locationUrl}
                    <a
                      href={akadEvent.locationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#c97b8b] px-5 py-2.5 text-xs text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition hover:bg-[#b56a7a]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Lihat Lokasi
                    </a>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        {/if}
        <!-- Resepsi — papan kayu gelap -->
        {#if receptionEvent}
          <div use:reveal={200} class="relative pt-8">
            <div class="absolute top-0 left-10 h-9 border-l-2 border-dashed border-[#8b6f4e]"></div>
            <div
              class="absolute top-0 right-10 h-9 border-l-2 border-dashed border-[#8b6f4e]"
            ></div>

            <div class="wood-sign wood-dark">
              <div class="relative">
                <div class="mb-4 flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#fdfbf7]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-[#6b1f1f]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h3 class="font-script text-2xl text-white drop-shadow-sm">Resepsi Pernikahan</h3>
                </div>

                {#if resepsiDate}
                  <p class="font-love text-lg text-[#fdf9ef]">
                    {resepsiDate.dayName}, {resepsiDate.day}
                    {resepsiDate.monthName}
                    {resepsiDate.year}
                  </p>
                  <p class="mt-1 font-love text-sm text-[#d5dfec]">
                    {resepsiDate.timeRange}
                  </p>
                {/if}

                <div class="mt-6 flex justify-center gap-3">
                  {#each ['days', 'hours', 'minutes', 'seconds'] as unit}
                    <div class="flex flex-col items-center">
                      <span
                        class="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/15 text-sm font-semibold text-white shadow-inner sm:h-14 sm:w-14"
                      >
                        {resepsiTimeLeft[unit as keyof TimeLeft] ?? '--'}
                      </span>
                      <span class="mt-1.5 font-love text-[10px] text-[#f3ead9]/80 capitalize"
                        >{unit}</span
                      >
                    </div>
                  {/each}
                </div>

                <div class="mt-6 rounded-xl bg-white/10 p-4">
                  <div class="flex items-start gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="mt-0.5 h-4 w-4 shrink-0 text-[#d5dfec]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p class="font-love text-sm leading-relaxed text-[#fdf9ef]">
                      {receptionEvent.location ?? 'Lokasi tidak tersedia'}
                    </p>
                  </div>
                  {#if receptionEvent.locationUrl}
                    <a
                      href={receptionEvent.locationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#1e3a5f] px-5 py-2.5 text-xs text-white shadow-[0_4px_14px_rgba(0,0,0,0.3)] transition hover:bg-[#152d4a]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Lihat Lokasi
                    </a>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </section>
  {#snippet gallerySection()}
    <!-- SECTION: GALLERY — Scattered Watercolor Cards -->
  <section class="relative overflow-hidden bg-[#72000b] py-16">
    <div class="absolute inset-0 bg-[#72000b]"></div>
    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_20%,rgba(201,123,139,0.12),transparent_55%)]"
    ></div>
    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_80%,rgba(30,58,95,0.10),transparent_55%)]"
    ></div>

    <img
      use:reveal={0}
      src="/images/watercolor/loose1.png"
      alt=""
      class="pointer-events-none absolute top-[5%] left-[-5%] z-0 w-28 rotate-[15deg] object-contain sm:w-36"
    />
    <img
      use:reveal={100}
      src="/images/watercolor/loose2.png"
      alt=""
      class="pointer-events-none absolute top-[10%] right-[-3%] z-0 w-20 scale-x-[-1] rotate-[-20deg] object-contain sm:w-24"
    />
    <img
      use:reveal={200}
      src="/images/watercolor/loose3.png"
      alt=""
      class="pointer-events-none absolute bottom-[8%] left-[2%] z-0 w-18 rotate-[-10deg] object-contain sm:w-22"
    />
    <img
      use:reveal={300}
      src="/images/watercolor/loose4.png"
      alt=""
      class="pointer-events-none absolute right-[-4%] bottom-[5%] z-0 w-24 scale-x-[-1] rotate-[12deg] object-contain sm:w-28"
    />

    <div class="relative z-10">
      <div use:reveal class="mb-10 text-center">
        <h2 class="font-script text-4xl text-white sm:text-5xl">Our Gallery</h2>
        <div class="mx-auto mt-3 h-px w-20 bg-white/40"></div>
      </div>

      <div class="mx-auto max-w-md px-5">
        <!-- Dua foto square bertumpuk di kiri dan portrait normal di kanan -->
        {#if creamyGalleryImages.length >= 3}
          <div use:reveal class="grid aspect-[5/4] grid-cols-[2fr_3fr] gap-1.5">
            <div class="grid grid-rows-2 gap-1.5">
              {#each creamyGalleryImages.slice(0, 2) as photo, i}
                <div class="aspect-square overflow-hidden rounded-xl bg-[#380005]">
                  <img
                    src={photo}
                    alt={`Foto kenangan ${i + 1}`}
                    class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              {/each}
            </div>
            <div class="overflow-hidden rounded-xl bg-[#380005]">
              <img
                src={creamyGalleryImages[2]}
                alt="Foto kenangan 3"
                class="aspect-[3/4] h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        {/if}

        <!-- Deretan portrait yang dapat digeser -->
        {#if creamyGallerySliderImages.length > 0}
          <div class="creamy-gallery-slider mt-2 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2">
            {#each creamyGallerySliderImages as photo, i}
              <div class="w-[38%] shrink-0 snap-start overflow-hidden rounded-xl bg-[#380005]">
                <img
                  src={photo}
                  alt={`Foto kenangan ${i + 4}`}
                  class="aspect-[3/4] h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
            {/each}
          </div>
        {/if}

        <!-- Satu foto landscape penuh -->
        {#if creamyGalleryLandscapeImage}
          <div use:reveal={200} class="mt-2 overflow-hidden rounded-xl bg-[#380005]">
            <img
              src={creamyGalleryLandscapeImage}
              alt={`Foto kenangan ${creamyGalleryImages.length}`}
              class="aspect-[16/9] h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
          </div>
        {/if}
      </div>
    </div>
  </section>
  {/snippet}
  <!-- SECTION: LOVE STORY — Twine Timeline -->
  {#if loveStories.length > 0}
    <section bind:this={storyEl} class="relative overflow-hidden py-20">
      <div class="linen absolute inset-0"></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(201,123,139,0.12),transparent_60%)]"
      ></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(30,58,95,0.08),transparent_60%)]"
      ></div>

      <img
        use:reveal={0}
        src="/images/watercolor/loose1.png"
        alt=""
        class="pointer-events-none absolute top-[5%] left-[2%] z-0 w-20 rotate-[12deg] object-contain sm:w-28"
      />
      <img
        use:reveal={100}
        src="/images/watercolor/loose3.png"
        alt=""
        class="pointer-events-none absolute right-[3%] bottom-[10%] z-0 w-18 rotate-[-15deg] object-contain sm:w-24"
      />
      <img
        use:reveal={200}
        src="/images/watercolor/loose2.png"
        alt=""
        class="pointer-events-none absolute top-[40%] right-[-2%] z-0 w-16 scale-x-[-1] rotate-[20deg] object-contain sm:w-20"
      />

      <div class="relative z-10">
        <div use:reveal class="mb-14 text-center">
          <h2 class="font-script text-4xl text-[#6b1f1f] sm:text-5xl">Our Story</h2>
          <div class="mx-auto mt-3 h-px w-20 bg-[#6b1f1f]/40"></div>
        </div>

        <div
          bind:this={storyContainer}
          class="relative mx-auto max-w-md px-6 {loveStories.length > 4 ? 'pb-4' : ''}"
        >
          <!-- Tali twine yang terulur mengikuti scroll -->
          <svg
            class="pointer-events-none absolute top-0 left-1/2 z-0 hidden h-full w-px -translate-x-1/2 overflow-visible"
          >
            <path
              d={storyPathD}
              fill="none"
              stroke="#8b6f4e"
              stroke-opacity="0.55"
              stroke-width="2"
              stroke-linecap="round"
              stroke-dasharray={storyLineLength}
              stroke-dashoffset={storyLineLength * (1 - storyProgress)}
              style="transition: none;"
            />
          </svg>
          {#each loveStories as story, i}
            {@const isLeft = i % 2 === 0}
            {@const dotActive = true}
            {@const storyDate = story.date ? formatStoryDate(story.date) : null}
            <div
              class="relative mb-14 transition-all duration-700 ease-out last:mb-0 {dotActive
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'}"
            >
              <!-- Node bunga dengan ring maroon -->
              <div class="absolute top-1/2 left-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2">
                <div
                  class="transition-all duration-500 {dotActive
                    ? 'scale-100 rotate-0 opacity-100'
                    : 'scale-0 rotate-[-180deg] opacity-0'}"
                >
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <circle
                      cx="15"
                      cy="15"
                      r="14"
                      fill="none"
                      stroke="#6b1f1f"
                      stroke-width="1"
                      opacity="0.5"
                    />
                    <circle cx="15" cy="15" r="4" fill={isLeft ? '#c97b8b' : '#1e3a5f'} />
                    <ellipse
                      cx="15"
                      cy="7"
                      rx="4"
                      ry="7"
                      fill={isLeft ? '#c97b8b' : '#1e3a5f'}
                      transform="rotate(0 15 15)"
                      opacity="0.9"
                    />
                    <ellipse
                      cx="15"
                      cy="7"
                      rx="4"
                      ry="7"
                      fill={isLeft ? '#c97b8b' : '#1e3a5f'}
                      transform="rotate(72 15 15)"
                      opacity="0.9"
                    />
                    <ellipse
                      cx="15"
                      cy="7"
                      rx="4"
                      ry="7"
                      fill={isLeft ? '#c97b8b' : '#1e3a5f'}
                      transform="rotate(144 15 15)"
                      opacity="0.9"
                    />
                    <ellipse
                      cx="15"
                      cy="7"
                      rx="4"
                      ry="7"
                      fill={isLeft ? '#c97b8b' : '#1e3a5f'}
                      transform="rotate(216 15 15)"
                      opacity="0.9"
                    />
                    <ellipse
                      cx="15"
                      cy="7"
                      rx="4"
                      ry="7"
                      fill={isLeft ? '#c97b8b' : '#1e3a5f'}
                      transform="rotate(288 15 15)"
                      opacity="0.9"
                    />
                    <circle cx="15" cy="15" r="2" fill="#faf7f2" />
                  </svg>
                </div>
              </div>
              <div class="flex w-full items-center gap-3">
                {#if isLeft}
                  <div class="flex w-2/5 shrink-0 justify-center">
                    {#if story.imageUrl}
                      <div class="polaroid mini w-full max-w-[130px] rotate-1">
                        <img
                          src={story.imageUrl}
                          alt={story.title}
                          class="aspect-[3/4] h-auto w-full rounded-[2px] object-cover"
                          loading="lazy"
                        />
                      </div>
                    {/if}
                  </div>
                  <div class="min-w-0 flex-1 text-left">
                    {#if story.title}
                      <p class="font-script text-2xl text-[#6b1f1f]">{story.title}</p>
                    {/if}
                    {#if storyDate}
                      <p class="mt-1 font-love text-[11px] tracking-wider text-[#4a6885]">
                        {storyDate.monthName} {storyDate.year}
                      </p>
                    {/if}
                    <p class="mt-1 font-love text-xs leading-relaxed text-[#2c3e5a]">
                      {story.description}
                    </p>
                  </div>
                {:else}
                  <div class="min-w-0 flex-1 text-right">
                    {#if story.title}
                      <p class="font-script text-2xl text-[#6b1f1f]">{story.title}</p>
                    {/if}
                    {#if storyDate}
                      <p class="mt-1 font-love text-[11px] tracking-wider text-[#4a6885]">
                        {storyDate.monthName} {storyDate.year}
                      </p>
                    {/if}
                    <p class="mt-1 font-love text-xs leading-relaxed text-[#2c3e5a]">
                      {story.description}
                    </p>
                  </div>
                  <div class="flex w-2/5 shrink-0 justify-center">
                    {#if story.imageUrl}
                      <div class="polaroid mini w-full max-w-[130px] -rotate-1">
                        <img
                          src={story.imageUrl}
                          alt={story.title}
                          class="aspect-[3/4] h-auto w-full rounded-[2px] object-cover"
                          loading="lazy"
                        />
                      </div>
                    {/if}
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {/if}
  {@render gallerySection()}
  <!-- SECTION: GIFT — Kraft Postcard Stack -->
  {#if gifts.length > 0}
    <section class="relative overflow-hidden py-20">
      <div class="linen absolute inset-0"></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,123,139,0.10),transparent_60%)]"
      ></div>

      <img
        use:reveal={0}
        src="/images/watercolor/loose1.png"
        alt=""
        class="pointer-events-none absolute top-[8%] right-[3%] z-0 w-18 rotate-[-10deg] object-contain sm:w-24"
      />
      <img
        use:reveal={100}
        src="/images/watercolor/loose3.png"
        alt=""
        class="pointer-events-none absolute bottom-[10%] left-[2%] z-0 w-16 rotate-[15deg] object-contain sm:w-20"
      />

      <div class="relative z-10">
        <div use:reveal class="mb-14 text-center">
          <h2 class="font-script text-4xl text-[#1a1a1a] sm:text-5xl">Wedding Gift</h2>
          <div class="mx-auto mt-3 h-px w-20 bg-[#6b1f1f]/40"></div>
        </div>

        <div class="mx-auto max-w-md px-5">
          <div use:reveal class="mb-10 text-center">
            <p class="font-love text-sm leading-relaxed text-[#4a4a4a]">
              Doa restu Anda merupakan karunia yang paling berarti.<br />
              Namun apabila berkenan memberikan tanda kasih,<br />
              dapat melalui:
            </p>
          </div>

          <div class="space-y-6">
            {#each bankAccounts as acc, i}
              {@const rotation = [1.5, -1, 2, -1.5, 0.5][i % 5]}
              <div use:reveal={i * 100} class="kraft-card" style="transform: rotate({rotation}deg)">
                <div class="kraft-stitch"></div>

                <!-- Postmark -->
                <div
                  class="absolute top-3 left-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-[#6b1f1f]/30"
                >
                  <span class="font-script text-[10px] text-[#6b1f1f]/50">gift</span>
                </div>

                <div class="relative p-5">
                  <div class="mt-8">
                    <p
                      class="mb-3 text-center font-love text-xs tracking-wider text-[#8a8a8a] uppercase"
                    >
                      Transfer to
                    </p>
                    <div class="text-center">
                      <p class="font-love text-lg text-[#1a1a1a]">{acc.name}</p>
                      <div class="my-2 flex items-center justify-center gap-2">
                        <span class="font-mono text-2xl tracking-wider text-[#1a1a1a]"
                          >{acc.accountNumber}</span
                        >
                      </div>
                      <p class="text-sm text-[#8a8a8a]">a.n. {acc.accountHolder}</p>
                    </div>

                    <!-- Wax seal copy button -->
                    <div class="mt-4 flex justify-center">
                      <button
                        class="wax-seal"
                        on:click={() => copyToClipboard(acc.accountNumber ?? '')}
                      >
                        <span class="flex items-center gap-1.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Salin
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
          {#if bankAccounts.length > 0 && physicalGifts.length > 0}
            <div class="my-8 flex items-center justify-center gap-4">
              <div class="h-px w-12 border-t-2 border-dashed border-[#8b6f4e]/40"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-[#6b1f1f]/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <div class="h-px w-12 border-t-2 border-dashed border-[#8b6f4e]/40"></div>
            </div>
          {/if}

          {#each physicalGifts as pg, i}
            <div use:reveal={i * 100} class="mt-6">
              <div class="address-label">
                <div
                  class="flex items-center gap-2 border-b-2 border-dashed border-[#6b1f1f]/20 pb-3"
                >
                  <div class="rounded-full bg-[#6b1f1f]/10 p-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-[#6b1f1f]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="1.5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <p class="text-xs font-medium tracking-wider text-[#6b1f1f] uppercase">
                    {pg.name ?? 'Kirim ke Alamat'}
                  </p>
                </div>
                <p
                  class="mt-3 text-center text-sm leading-relaxed text-[#4a4a4a]"
                  style="white-space:pre-line"
                >
                  {pg.description}
                </p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {/if}
  <!-- SECTION: RSVP & WISHES — Rustic Notebook -->
  <section class="relative overflow-hidden py-20">
    <div class="linen absolute inset-0"></div>
    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,123,139,0.10),transparent_60%)]"
    ></div>

    <img
      use:reveal={0}
      src="/images/watercolor/loose2.png"
      alt=""
      class="pointer-events-none absolute top-[5%] left-[3%] z-0 w-16 rotate-[20deg] object-contain sm:w-20"
    />
    <img
      use:reveal={100}
      src="/images/watercolor/loose4.png"
      alt=""
      class="pointer-events-none absolute right-[2%] bottom-[8%] z-0 w-18 scale-x-[-1] rotate-[-10deg] object-contain sm:w-22"
    />

    <div class="relative z-10">
      <div class="mx-auto max-w-md space-y-16 px-5">
        <!-- RSVP Form -->
        <div use:reveal>
          <div class="mb-10 text-center">
            <h2 class="font-script text-4xl text-[#1a1a1a] sm:text-5xl">Reservasi Kehadiran</h2>
            <div class="mx-auto mt-3 h-px w-20 bg-[#6b1f1f]/40"></div>
          </div>

          <div class="botanical-notebook">
            <div class="spiral-binding"></div>
            <div class="notebook-paper">
              <div class="mb-6 text-center">
                <p class="font-love text-sm text-[#8a8a8a]">Mohon konfirmasi kehadiran Anda</p>
              </div>

              <div class="space-y-1">
                <div class="notebook-field">
                  <div class="botanical-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <label for="rustic-rsvp-name" class="notebook-label">Nama Lengkap</label>
                    <input
                      id="rustic-rsvp-name"
                      type="text"
                      bind:value={rsvpName}
                      placeholder="Tulis nama Anda..."
                      class="notebook-input"
                    />
                  </div>
                </div>
                <div class="notebook-field">
                  <div class="botanical-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="notebook-label">Konfirmasi Kehadiran</p>
                    <div class="flex gap-3 pt-1">
                      <button
                        type="button"
                        on:click={() => (rsvpPresence = 'hadir')}
                        class="notebook-checkbox {rsvpPresence === 'hadir'
                          ? 'notebook-checkbox-checked'
                          : ''}"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Hadir
                      </button>
                      <button
                        type="button"
                        on:click={() => (rsvpPresence = 'tidak')}
                        class="notebook-checkbox {rsvpPresence === 'tidak'
                          ? 'notebook-checkbox-checked-navy'
                          : ''}"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Tidak Hadir
                      </button>
                    </div>
                  </div>
                </div>

                <div class="notebook-field">
                  <div class="botanical-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <label for="rustic-rsvp-msg" class="notebook-label">Ucapan &amp; Doa</label>
                    <textarea
                      id="rustic-rsvp-msg"
                      bind:value={rsvpMessage}
                      rows="3"
                      placeholder="Tulis doa terbaik Anda..."
                      class="notebook-textarea"
                    ></textarea>
                  </div>
                </div>
              </div>
              {#if rsvpError}<p class="mt-3 text-xs text-red-400">{rsvpError}</p>{/if}
              {#if rsvpSubmitted}<p class="mt-3 text-xs text-[#c97b8b]">
                  Terima kasih, konfirmasi terkirim!
                </p>{/if}

              <div class="mt-8 flex justify-center">
                <button
                  type="button"
                  on:click={handleSubmitRsvp}
                  disabled={rsvpSubmitting}
                  class="botanical-btn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  {rsvpSubmitting ? 'Mengirim...' : 'Kirim'}
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Wishes — Sticky Notes dengan pin kayu -->
        <div use:reveal>
          <div class="mb-10 text-center">
            <h2 class="font-script text-3xl text-[#1a1a1a] sm:text-4xl">Ucapan &amp; Doa</h2>
            <div class="mx-auto mt-3 h-px w-20 bg-[#6b1f1f]/40"></div>
          </div>

          <p class="mb-6 text-center font-love text-xs text-[#8a8a8a]">
            Doa dan harapan terbaik dari keluarga dan sahabat
          </p>

          <div class="space-y-4">
            {#each pagedWishes as r, i (r.id)}
              {@const rotations = [-1, 0.5, -0.5, 1, -0.8, 0.3]}
              {@const bgColors = ['bg-[#fef9e7]', 'bg-[#faf7f2]', 'bg-[#fdf2f4]']}
              {@const pinColors = ['bg-[#8b6f4e]', 'bg-[#6b1f1f]', 'bg-[#1e3a5f]']}
              <div
                class="sticky-note {bgColors[i % bgColors.length]}"
                style="transform: rotate({rotations[i % rotations.length]}deg)"
              >
                <!-- Pin bulat kayu/maroon/navy -->
                <div class="absolute -top-1.5 left-1/2 -translate-x-1/2">
                  <span
                    class="block h-3.5 w-3.5 rounded-full {pinColors[
                      i % pinColors.length
                    ]} shadow-[0_1px_3px_rgba(0,0,0,0.35)] ring-1 ring-black/10"
                  ></span>
                </div>
                <div class="relative pt-1">
                  <div class="flex items-start gap-3">
                    <div
                      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e3a5f]/8"
                    >
                      <span class="font-script text-sm text-[#1e3a5f]">{r.name.charAt(0)}</span>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-[#1a1a1a]">{r.name}</p>
                      {#if r.message}
                        <p class="mt-1 max-h-28 overflow-y-auto pr-1 text-sm leading-relaxed text-[#4a4a4a]">
                          {r.message}
                        </p>
                      {/if}
                      <p class="mt-2 text-[10px] text-[#8a8a8a]">{formatRsvpTime(r.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>

          {#if wishes.length === 0}
            <p class="text-center text-sm text-[#8a8a8a]">Belum ada ucapan.</p>
          {:else if wishesHasMore}
            <button class="botanical-btn mx-auto mt-6 block" on:click={() => (wishesPage += 1)}>
              Tampilkan lebih banyak
            </button>
          {/if}
        </div>
      </div>
    </div>
  </section>
  <!-- SECTION: CLOSING — Full photo with quote -->
  <section class="relative isolate min-h-svh overflow-hidden bg-[#1a1a1a]">
    {#if closingPhoto}
      <img
        src={closingPhoto}
        alt={`Foto ${brideFirstName} dan ${groomFirstName}`}
        class="absolute inset-0 h-full w-full object-cover"
      />
    {:else}
      <div class="linen absolute inset-0"></div>
    {/if}
    <div class="absolute inset-0 bg-black/40"></div>
    <div class="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50"></div>

    <div use:reveal class="relative z-10 flex min-h-svh flex-col justify-end px-6 pt-24 pb-12 text-center text-white sm:px-10 sm:pb-16">
      <div class="mx-auto max-w-md">
        <p class="font-love text-base leading-relaxed drop-shadow-md sm:text-lg">
          {closingMessage}
        </p>
        <p
          class="mt-7 leading-none drop-shadow-lg"
          style="font-family: 'Great Vibes', cursive; font-size: clamp(2rem, 9vw, 2.75rem);"
        >
          {brideFirstName} <span class="mx-1 text-xl">&amp;</span> {groomFirstName}
        </p>
      </div>
      <div class="mt-10 opacity-90"><Credit /></div>
    </div>
  </section>
</main>

<style>
  .rustic-main {
    font-family:
      'Segoe UI',
      system-ui,
      -apple-system,
      sans-serif;
    background-color: #faf7f2;
    background-image:
      url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"),
      repeating-linear-gradient(0deg, rgba(139, 111, 78, 0.03) 0 1px, transparent 1px 3px),
      repeating-linear-gradient(90deg, rgba(139, 111, 78, 0.03) 0 1px, transparent 1px 3px);
  }

  .quote-photo-background {
    background-position: center;
    background-size: cover;
    filter: saturate(0.9);
  }
  .quote-photo-overlay {
    background: rgba(0, 0, 0, 0.52);
  }
  .quote-floral-style > img:not(.quote-side) {
    display: none;
  }
  .quote-floral-style {
    display: flex;
    min-height: 100svh;
    align-items: center;
    justify-content: center;
    padding: 5rem 1.4rem;
    background: #fffef9;
  }
  .quote-floral-style .quote-photo-background,
  .quote-floral-style .quote-photo-overlay {
    display: none;
  }
  .quote-inner {
    width: 100%;
  }
  .quote-welcome {
    color: #a48671;
    font-weight: 600;
    letter-spacing: 0.22em;
  }
  .quote-mark {
    color: #706d41;
  }
  .quote-inner blockquote,
  .quote-inner > div > p:not(.quote-welcome):not(.quote-mark) {
    color: #55544a;
  }
  .quote-inner cite,
  .quote-inner > div > p:last-child {
    color: #706d41;
  }
  .quote-side {
    top: 0;
    width: 42%;
    height: 100%;
    object-fit: cover;
    opacity: 0.88;
  }
  .quote-side-left {
    left: -42px;
  }
  .quote-side-right {
    right: -42px;
  }

  /* Linen section backgrounds */
  .linen {
    background-color: #faf7f2;
    background-image:
      repeating-linear-gradient(0deg, rgba(139, 111, 78, 0.035) 0 1px, transparent 1px 4px),
      repeating-linear-gradient(90deg, rgba(139, 111, 78, 0.035) 0 1px, transparent 1px 4px);
  }
  .linen-dark {
    background-color: #f0e9dc;
    background-image:
      repeating-linear-gradient(0deg, rgba(139, 111, 78, 0.05) 0 1px, transparent 1px 4px),
      repeating-linear-gradient(90deg, rgba(139, 111, 78, 0.05) 0 1px, transparent 1px 4px);
  }

  .float-gentle {
    animation: gentleFloat var(--float-dur, 4s) ease-in-out infinite;
    animation-delay: var(--float-del, 0s);
  }
  @keyframes gentleFloat {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-16px);
    }
  }

  /* Sticker photo frame — organic die-cut look */
  .sticker {
    position: relative;
    padding: 10px;
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    background: #fdfbf7;
    border: 1px solid #e5e0d8;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.06),
      0 8px 24px rgba(0, 0, 0, 0.12);
  }
  /* Pigura kayu untuk foto couple */
  .wood-photo-frame {
    position: relative;
    padding: 10px;
    border-radius: 6px;
    background-color: #a08060;
    background-image:
      url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.10'/%3E%3C/svg%3E"),
      repeating-linear-gradient(to right, rgba(255, 255, 255, 0.03) 0 2px, transparent 2px 7px),
      linear-gradient(115deg, rgba(255, 255, 255, 0.1), rgba(60, 45, 30, 0.15));
    box-shadow:
      inset 0 0 0 1px rgba(60, 45, 30, 0.35),
      0 6px 18px rgba(93, 74, 53, 0.28);
  }
  /* Papan sign kayu untuk Wedding Day */
  .wood-sign {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    padding: 22px 20px;
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.12),
      0 2px 4px rgba(0, 0, 0, 0.15),
      0 12px 26px rgba(60, 45, 30, 0.25);
  }
  .wood-light {
    background-color: #a08060;
    background-image:
      url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.10'/%3E%3C/svg%3E"),
      repeating-linear-gradient(to right, rgba(255, 255, 255, 0.03) 0 2px, transparent 2px 7px),
      linear-gradient(115deg, rgba(255, 255, 255, 0.1), rgba(60, 45, 30, 0.12));
  }
  .wood-dark {
    background-color: #5d4a35;
    background-image:
      url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E"),
      repeating-linear-gradient(to right, rgba(255, 255, 255, 0.04) 0 2px, transparent 2px 7px),
      linear-gradient(115deg, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.18));
  }
  /* Polaroid + washi tape */
  .polaroid {
    position: relative;
    background: #fdfbf7;
    padding: 8px 8px 26px;
    border-radius: 2px;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.08),
      0 6px 18px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
  }
  .polaroid:hover {
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.08),
      0 10px 26px rgba(0, 0, 0, 0.14);
  }
  .polaroid.mini {
    padding: 6px 6px 14px;
  }
  .washi {
    position: absolute;
    top: -9px;
    left: 50%;
    width: 74px;
    height: 20px;
    transform: translateX(-50%) rotate(-3deg);
    border-radius: 1px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
  }
  .washi-pink {
    background: repeating-linear-gradient(
      45deg,
      rgba(201, 123, 139, 0.55) 0 6px,
      rgba(201, 123, 139, 0.35) 6px 12px
    );
  }
  .washi-navy {
    background: repeating-linear-gradient(
      45deg,
      rgba(30, 58, 95, 0.45) 0 6px,
      rgba(30, 58, 95, 0.28) 6px 12px
    );
  }
  .washi-kraft {
    background: repeating-linear-gradient(
      45deg,
      rgba(160, 128, 96, 0.5) 0 6px,
      rgba(160, 128, 96, 0.32) 6px 12px
    );
  }

  /* Kartu kraft untuk gift */
  .kraft-card {
    position: relative;
    background: #efe6d8;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
    border-radius: 4px;
    box-shadow:
      0 1px 1px rgba(0, 0, 0, 0.08),
      0 2px 4px rgba(0, 0, 0, 0.06),
      0 8px 16px rgba(0, 0, 0, 0.04);
  }
  .kraft-stitch {
    position: absolute;
    inset: 7px;
    border: 1.5px dashed rgba(139, 111, 78, 0.5);
    border-radius: 2px;
    pointer-events: none;
  }
  /* Wax seal button (maroon, aksen kecil) */
  .wax-seal {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 7px 18px;
    background: #6b1f1f;
    color: white;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.05em;
    border-radius: 999px;
    box-shadow:
      inset 0 2px 3px rgba(255, 255, 255, 0.18),
      inset 0 -2px 3px rgba(0, 0, 0, 0.25),
      0 3px 6px rgba(107, 31, 31, 0.35);
    transition: all 0.2s ease;
    cursor: pointer;
  }
  .wax-seal:hover {
    background: #571818;
    box-shadow:
      inset 0 2px 3px rgba(255, 255, 255, 0.18),
      inset 0 -2px 3px rgba(0, 0, 0, 0.25),
      0 4px 10px rgba(107, 31, 31, 0.45);
  }
  .wax-seal:active {
    transform: scale(0.95);
  }

  .address-label {
    background: #efe6d8;
    border: 2px dashed #6b1f1f;
    border-radius: 4px;
    padding: 16px;
    position: relative;
  }

  .sticky-note {
    position: relative;
    padding: 16px;
    border-radius: 2px;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.06),
      0 3px 6px rgba(0, 0, 0, 0.04);
  }

  /* Gerbang kayu untuk closing */
  .wood-gate {
    position: relative;
    border: 3px solid #8b6f4e;
    border-radius: 14px;
    background: rgba(253, 251, 247, 0.7);
    box-shadow:
      inset 0 0 0 4px rgba(250, 247, 242, 0.9),
      inset 0 0 0 5px rgba(107, 31, 31, 0.35),
      0 8px 20px rgba(93, 74, 53, 0.15);
  }
  /* Notebook RSVP (spiral maroon = aksen kecil) */
  .botanical-notebook {
    position: relative;
    background: #fdfbf7;
    border-radius: 8px;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.05),
      0 4px 8px rgba(0, 0, 0, 0.04),
      0 12px 24px rgba(0, 0, 0, 0.03);
  }

  .spiral-binding {
    position: absolute;
    left: 8px;
    top: 24px;
    bottom: 24px;
    width: 3px;
    background: repeating-linear-gradient(
      to bottom,
      #6b1f1f 0px,
      #6b1f1f 8px,
      transparent 8px,
      transparent 14px
    );
    opacity: 0.45;
  }
  .spiral-binding::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 0;
    bottom: 0;
    width: 11px;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 4px,
      #6b1f1f 4px,
      #6b1f1f 5px,
      transparent 5px,
      transparent 14px
    );
    opacity: 0.35;
  }

  .notebook-paper {
    position: relative;
    padding: 20px 20px 20px 32px;
    background: #fdfbf7;
    border-radius: 8px;
  }

  .notebook-field {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 14px 0;
    border-bottom: 1px solid #e0d5c0;
  }
  .notebook-field:last-of-type {
    border-bottom: none;
  }

  .botanical-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(201, 123, 139, 0.12);
    color: #c97b8b;
    flex-shrink: 0;
    margin-top: 4px;
  }

  .notebook-label {
    display: block;
    font-size: 11px;
    letter-spacing: 0.08em;
    color: #8a8a8a;
    margin-bottom: 2px;
    font-family: 'Segoe UI', system-ui, sans-serif;
  }
  .notebook-input {
    display: block;
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid #e0d5c0;
    padding: 2px 0;
    font-size: 14px;
    color: #1a1a1a;
    font-family: 'Segoe UI', system-ui, sans-serif;
    line-height: 1.4;
    outline: none;
    transition: border-color 0.2s ease;
  }
  .notebook-input::placeholder {
    color: #c0b8a8;
    font-style: italic;
  }
  .notebook-input:focus {
    border-bottom-color: #c97b8b;
  }

  .notebook-textarea {
    display: block;
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid #e0d5c0;
    padding: 2px 0;
    font-size: 14px;
    color: #1a1a1a;
    font-family: 'Segoe UI', system-ui, sans-serif;
    line-height: 1.6;
    outline: none;
    resize: none;
    transition: border-color 0.2s ease;
  }
  .notebook-textarea::placeholder {
    color: #c0b8a8;
    font-style: italic;
  }
  .notebook-textarea:focus {
    border-bottom-color: #c97b8b;
  }

  .notebook-checkbox {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    border: 1.5px solid #ddd2bd;
    border-radius: 20px;
    font-size: 12px;
    color: #8a8a8a;
    background: transparent;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  .notebook-checkbox:hover {
    border-color: #c97b8b;
    color: #c97b8b;
  }
  .notebook-checkbox-checked {
    border-color: #c97b8b;
    background: #c97b8b;
    color: white;
  }
  .creamy-gallery-slider {
    scrollbar-width: none;
  }
  .creamy-gallery-slider::-webkit-scrollbar {
    display: none;
  }

  .notebook-checkbox-checked-navy {
    border-color: #1e3a5f;
    background: #1e3a5f;
    color: white;
  }
  .botanical-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 28px;
    background: rgba(201, 123, 139, 0.08);
    border: 1.5px solid rgba(201, 123, 139, 0.35);
    border-radius: 24px;
    font-size: 13px;
    color: #c97b8b;
    font-weight: 500;
    letter-spacing: 0.02em;
    box-shadow: 0 2px 8px rgba(201, 123, 139, 0.08);
    transition: all 0.25s ease;
    cursor: pointer;
  }
  .botanical-btn:hover {
    background: #c97b8b;
    border-color: #c97b8b;
    color: white;
    box-shadow: 0 4px 14px rgba(201, 123, 139, 0.25);
  }
  .botanical-btn:active {
    transform: scale(0.96);
  }
  .botanical-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
