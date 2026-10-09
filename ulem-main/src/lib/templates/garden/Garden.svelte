<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';
  import { formatIndonesianDate } from '$lib/utils/formatDate';
  import { fetchRsvps, formatRsvpTime, submitRsvp, type Rsvp } from '$lib/rsvp';
  import Credit from '$lib/Credit.svelte';

  export let invitation: any;

  // ── Derived data ──────────────────────────────────────────────────────────
  const bride = invitation.bride ?? {};
  const groom = invitation.groom ?? {};
  const brideFirstName = (bride.name || 'BRIDE').split(' ')[0];
  const groomFirstName = (groom.name || 'GROOM').split(' ')[0];
  const coupleInitials = `${groomFirstName.charAt(0)} & ${brideFirstName.charAt(0)}`;
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
  const quoteImages: string[] = invitation.quote?.imageUrls ?? [];
  const galleryImages: string[] = invitation.gallery?.imageUrls ?? [];

  // ── Gallery scattered watercolor cards config ─────────────────────────────
  const washColors = [
    { bg: 'bg-[#c97b8b]/10', border: 'border-[#c97b8b]/20', shadow: 'shadow-[#c97b8b]/10' },
    { bg: 'bg-[#1e3a5f]/10', border: 'border-[#1e3a5f]/20', shadow: 'shadow-[#1e3a5f]/10' },
    { bg: 'bg-[#f5f0e8]', border: 'border-[#e8e0d5]', shadow: 'shadow-[#6b1f1f]/5' },
  ];
  const cardRotations = [-2, 1.5, -1, 2, -1.5, 1];
  const events = invitation?.events ?? [];
  const akadEvent = events.find((e: any) => e.type === 'akad');
  const receptionEvent = events.find((e: any) => e.type === 'reception');
  const loveStories = invitation?.loveStories ?? [];
  const gifts = invitation?.gifts ?? [];
  const bankAccounts = gifts.filter((g: any) => g.type === 'bank');
  const physicalGifts = gifts.filter((g: any) => g.type === 'physical');
  const closingMessage = invitation?.closing?.message ?? '';

  // ── Typing animation for verse ────────────────────────────────────────────
  const verseFullText = invitation?.quote?.text ||
    'Di antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa cinta dan kasih sayang.';
  const quoteSource = invitation?.quote?.source || 'QS. Ar-Rum: 21';
  let verseTyped = '';
  let verseCursor = true;
  let verseDone = false;

  // ── Scroll animation system ───────────────────────────────────────────────
  const firstLetterGroom = groomFirstName.charAt(0);

  // ── Scroll animation system ───────────────────────────────────────────────
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

    // Typing animation for verse
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < verseFullText.length) {
        verseTyped += verseFullText[i];
        i++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          verseCursor = false;
          verseDone = true;
        }, 2000);
      }
    }, 45);

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearInterval(typeInterval);
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

  function seedHash(i: number, s: number, n: number): number {
    const x = Math.sin((i * 127.1 + s * 311.7 + n * 269.5) * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  function buildVinePath(n: number, h: number, containerW = 430) {
    if (n === 0 || h <= 0) return { d: '', len: 1000 };
    const segH = h / n;
    const cx = 0;
    const photoOff = Math.round(containerW * 0.22);
    const wanderOff = Math.round(containerW * 0.06); // much smaller amplitude
    const points: { x: number; y: number }[] = [];
    let px = cx,
      py = 0;

    for (let i = 0; i < n; i++) {
      const isLeft = i % 2 === 0;
      const tx = cx + photoOff * (isLeft ? -1 : 1);
      const ty = i * segH + segH / 2;
      const segLen = Math.hypot(tx - px, ty - py) || 1;
      const nx = -(ty - py) / segLen;
      const ny = (tx - px) / segLen;
      const steps = 30; // fewer points for smoother curve

      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const bx = px + (tx - px) * t;
        const by = py + (ty - py) * t;
        // gentle sine wave only — no chaotic wobble
        const wander = Math.sin(t * Math.PI * 1.2 + i * 0.8) * wanderOff;
        const wx = bx + nx * wander;
        const wy = by + ny * wander;
        points.push({ x: wx, y: wy });
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

  // ── Reveal action ─────────────────────────────────────────────────────────
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

  // ── Parallax action ───────────────────────────────────────────────────────
  function parallax(node: HTMLElement | SVGElement, speed: number = 0.15) {
    function update() {
      const rect = node.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      const offset = (center - viewCenter) * speed;
      node.style.transform = `translateY(${offset}px)`;
    }

    let rafId: number;
    function loop() {
      update();
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    return {
      destroy() {
        cancelAnimationFrame(rafId);
      }
    };
  }

  // ── Countdown for events ──────────────────────────────────────────────────
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

  const akadDate = akadEvent?.date ? formatIndonesianDate(akadEvent.date) : null;
  const resepsiDate = receptionEvent?.date ? formatIndonesianDate(receptionEvent.date) : null;

  // ── RSVP state ────────────────────────────────────────────────────────────
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

  // ── Copy to clipboard ─────────────────────────────────────────────────────
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

<main class="garden-main relative overflow-x-hidden text-[#1a1a1a]">
  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION: QUOTE — Watercolor Meadow
       ════════════════════════════════════════════════════════════════════════ -->
  <section class="quote-meadow relative min-h-svh w-full overflow-hidden">
    <!-- z-0: Sky background -->
    <img
      src="/images/watercolor/sky-bg.png"
      alt=""
      class="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
    />

    <!-- z-10: Verse text with typing animation -->
    <div class="relative z-10 flex flex-col items-center px-6 pt-24 pb-[50vh]">
      <div class="mx-auto max-w-sm text-center font-love">
        <p class=" text-sm leading-relaxed text-[#1a3a5c] sm:text-base">
          {verseTyped}<span class="cursor" class:blink={verseCursor}>|</span>
        </p>
        <p class="mt-4 text-xs text-[#4a6885] italic">{quoteSource}</p>
      </div>
    </div>

    <!-- z-20: 3 Butterflies near text — gentle up/down float -->
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

    <!-- z-45: 4 Butterflies near flowers — gentle up/down float -->
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

    <!-- z-30: Meadow -->
    <img
      src="/images/watercolor/meadow.png"
      alt=""
      class="pointer-events-none absolute bottom-0 z-30 w-full object-contain"
    />

    <!-- z-35: Couple walking -->
    <img
      src="/images/watercolor/couple-walking.png"
      alt=""
      class="pointer-events-none absolute bottom-[14%] left-[46%] z-[37] w-28 object-contain sm:w-36"
    />

    <!-- z-30: Deep background flowers (smallest, far behind) — bloom in first -->
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

    <!-- z-35: Mid-layer flowers (medium) — fills gaps -->
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

    <!-- z-40: Foreground flowers (biggest, front) — 16 total -->
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

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION: BRIDE & GROOM — Botanical Portrait Duo
       ════════════════════════════════════════════════════════════════════════ -->

  <!-- HEADER: The Couple — 5 scattered flowers -->
  <div class="relative py-16 text-center sm:py-20" use:reveal={0}>
    <!-- 1. Cherry — big left (behind text, not cut) -->
    <img
      src="/images/watercolor/cherry.png"
      alt=""
      class="pointer-events-none absolute top-[20%] left-[0%] z-0 h-32 rotate-[-8deg] object-contain sm:h-40"
    />
    <!-- 2. White — big right (behind text, not cut) -->
    <img
      src="/images/watercolor/white.png"
      alt=""
      class="pointer-events-none absolute top-[20%] right-[0%] z-0 h-32 scale-x-[-1] rotate-[8deg] object-contain sm:h-40"
    />
    <!-- 3. Navy — crown above text (behind text, not too high) -->
    <img
      src="/images/watercolor/navy.png"
      alt=""
      class="pointer-events-none absolute top-[-2%] left-1/2 z-0 h-16 -translate-x-1/2 object-contain sm:h-20"
    />
    <!-- 4. Cherry — small scatter left of text (behind text) -->
    <img
      src="/images/watercolor/cherry.png"
      alt=""
      class="pointer-events-none absolute top-[8%] left-[5%] z-0 h-14 rotate-[-25deg] object-contain sm:h-16"
    />
    <!-- 5. White — small scatter right of text (behind text) -->
    <img
      src="/images/watercolor/white.png"
      alt=""
      class="pointer-events-none absolute top-[10%] right-[8%] z-0 h-12 scale-x-[-1] rotate-[20deg] object-contain sm:h-14"
    />
    <h2 class="relative z-10 font-script text-4xl text-[#1a1a1a] sm:text-5xl">The Couple</h2>
    <div class="relative z-10 mx-auto mt-3 h-px w-20 bg-[#c97b8b]/40"></div>
    <p class="relative z-10 mt-3 font-love text-sm tracking-wider text-[#8a8a8a]">{coupleInitials}</p>
    {#if akadDate}
      <p class="relative z-10 mt-1 font-love text-xs text-[#c97b8b]">
        {akadDate.day} {akadDate.monthName} {akadDate.year}
      </p>
    {/if}
  </div>

  <!-- BRIDE — Photo right, info left, pink wash (FIRST) -->
  <section class="relative overflow-hidden" use:reveal={0}>
    <!-- Watercolor wash background -->
    <div class="absolute inset-0 bg-[#f5f0e8]"></div>
    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(201,123,139,0.10),transparent_70%)]"
    ></div>

    <div class="relative flex flex-col items-start sm:flex-row-reverse sm:items-end">
      <!-- Photo (58% on desktop, full on mobile) -->
      <div class="relative w-full sm:w-[58%]">
        <div class="relative overflow-hidden">
          <img
            src={bride.imageUrls?.[0] ?? '/images/default/bride.jpg'}
            alt={brideFirstName}
            class="h-80 w-full object-cover sm:h-[26rem]"
          />
          <!-- Vignette overlay -->
          <div
            class="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.35)_0%,transparent_50%)]"
          ></div>
        </div>
        <!-- Name overlay -->
        <div class="absolute right-4 bottom-4 z-10 text-right sm:right-6 sm:bottom-6">
          <p
            class="font-script text-3xl leading-none text-white drop-shadow-lg sm:text-5xl"
            style={brideNameStyle}
          >
            {brideFirstName}
          </p>
          <p class="mt-1 font-love text-[10px] tracking-[0.2em] text-white/80 uppercase">
            The Bride
          </p>
        </div>
      </div>

      <!-- Info panel -->
      <div class="relative z-10 w-full px-6 py-8 text-right sm:w-[42%] sm:px-8 sm:pb-12">
        <p class="font-love text-lg text-[#c97b8b] sm:text-xl">
          {brideFirstName}
        </p>
        <div class="mt-2 ml-auto h-px w-12 bg-[#c97b8b]/60"></div>
        <p class="mt-3 font-love text-sm leading-relaxed text-[#4a4a4a]">
          Putri dari Bapak {bride.father ?? '-'} & Ibu {bride.mother ?? '-'}
        </p>
      </div>
    </div>

    <!-- 5 scattered flowers around bride photo -->
    <!-- 1. Cherry — top right, near name (behind name) -->
    <img
      use:reveal={200}
      src="/images/watercolor/cherry.png"
      alt=""
      class="pointer-events-none absolute top-[2%] right-[8%] z-5 w-24 scale-x-[-1] rotate-[10deg] object-contain sm:w-32"
    />
    <!-- 2. Cherry — bottom left, big grounded (inside container) -->
    <img
      use:reveal={300}
      src="/images/watercolor/cherry.png"
      alt=""
      class="pointer-events-none absolute bottom-[2%] left-[2%] z-5 w-32 rotate-[-8deg] object-contain sm:w-44"
    />
    <!-- 3. White — top left, small scatter (inside container) -->
    <img
      use:reveal={250}
      src="/images/watercolor/white.png"
      alt=""
      class="pointer-events-none absolute top-[15%] left-[5%] z-5 w-16 rotate-[35deg] object-contain sm:w-20"
    />
    <!-- 4. Navy — bottom right, accent (inside container) -->
    <img
      use:reveal={350}
      src="/images/watercolor/navy.png"
      alt=""
      class="pointer-events-none absolute right-[5%] bottom-[20%] z-5 w-14 scale-x-[-1] rotate-[-30deg] object-contain sm:w-16"
    />
    <!-- 5. Cherry — mid right edge (inside container) -->
    <img
      use:reveal={400}
      src="/images/watercolor/cherry.png"
      alt=""
      class="pointer-events-none absolute top-[60%] right-[2%] z-5 w-20 scale-x-[-1] rotate-[15deg] object-contain sm:w-24"
    />
  </section>

  <!-- Flower divider — 5 scattered flowers -->
  <div class="relative flex items-end justify-center gap-2 py-4 sm:gap-3 sm:py-6">
    <!-- 1. Cherry — left -->
    <img
      use:reveal={0}
      src="/images/watercolor/cherry.png"
      alt=""
      class="h-20 rotate-[-6deg] object-contain sm:h-28"
    />
    <!-- 2. White — left-mid -->
    <img
      use:reveal={100}
      src="/images/watercolor/white.png"
      alt=""
      class="h-16 rotate-[3deg] object-contain sm:h-20"
    />
    <!-- 3. Navy — center tallest -->
    <img
      use:reveal={200}
      src="/images/watercolor/navy.png"
      alt=""
      class="z-10 h-28 object-contain sm:h-36"
    />
    <!-- 4. Cherry — right-mid -->
    <img
      use:reveal={300}
      src="/images/watercolor/cherry.png"
      alt=""
      class="h-18 scale-x-[-1] rotate-[6deg] object-contain sm:h-22"
    />
    <!-- 5. White — right -->
    <img
      use:reveal={400}
      src="/images/watercolor/white.png"
      alt=""
      class="h-16 scale-x-[-1] rotate-[-3deg] object-contain sm:h-20"
    />
  </div>

  <!-- GROOM — Photo left, info right, navy wash (SECOND) -->
  <section class="relative overflow-hidden" use:reveal={0}>
    <!-- Watercolor wash background -->
    <div class="absolute inset-0 bg-[#f5f0e8]"></div>
    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(30,58,95,0.08),transparent_70%)]"
    ></div>

    <div class="relative flex flex-col items-end sm:flex-row sm:items-end">
      <!-- Photo (58% on desktop, full on mobile) -->
      <div class="relative w-full sm:w-[58%]">
        <div class="relative overflow-hidden">
          <img
            src={groom.imageUrls?.[0] ?? '/images/default/groom.png'}
            alt={groomFirstName}
            class="h-80 w-full object-cover sm:h-[26rem]"
          />
          <!-- Vignette overlay for name readability -->
          <div
            class="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.35)_0%,transparent_50%)]"
          ></div>
        </div>
        <!-- Name overlay -->
        <div class="absolute bottom-4 left-4 z-10 sm:bottom-6 sm:left-6">
          <p
            class="font-script text-3xl leading-none text-white drop-shadow-lg sm:text-5xl"
            style={groomNameStyle}
          >
            {groomFirstName}
          </p>
          <p class="mt-1 font-love text-[10px] tracking-[0.2em] text-white/80 uppercase">
            The Groom
          </p>
        </div>
      </div>

      <!-- Info panel -->
      <div class="relative z-10 w-full px-6 py-8 text-left sm:w-[42%] sm:px-8 sm:pb-12">
        <p class="font-love text-lg text-[#1e3a5f] sm:text-xl">
          {groomFirstName}
        </p>
        <div class="mt-2 h-px w-12 bg-[#c97b8b]/60"></div>
        <p class="mt-3 font-love text-sm leading-relaxed text-[#4a4a4a]">
          Putra dari Bapak {groom.father ?? '-'} & Ibu {groom.mother ?? '-'}
        </p>
      </div>
    </div>

    <!-- 5 scattered flowers around groom photo -->
    <!-- 1. Navy — top left, near name (behind name) -->
    <img
      use:reveal={200}
      src="/images/watercolor/navy.png"
      alt=""
      class="pointer-events-none absolute top-[2%] left-[8%] z-5 w-24 rotate-[-10deg] object-contain sm:w-32"
    />
    <!-- 2. Navy — bottom right, big grounded (inside container) -->
    <img
      use:reveal={300}
      src="/images/watercolor/navy.png"
      alt=""
      class="pointer-events-none absolute right-[2%] bottom-[2%] z-5 w-32 scale-x-[-1] rotate-[8deg] object-contain sm:w-44"
    />
    <!-- 3. White — top right, small scatter (inside container) -->
    <img
      use:reveal={250}
      src="/images/watercolor/white.png"
      alt=""
      class="pointer-events-none absolute top-[15%] right-[5%] z-5 w-16 scale-x-[-1] rotate-[-35deg] object-contain sm:w-20"
    />
    <!-- 4. Cherry — bottom left, accent (inside container) -->
    <img
      use:reveal={350}
      src="/images/watercolor/cherry.png"
      alt=""
      class="pointer-events-none absolute bottom-[20%] left-[5%] z-5 w-14 rotate-[30deg] object-contain sm:w-16"
    />
    <!-- 5. Navy — mid left edge (inside container) -->
    <img
      use:reveal={400}
      src="/images/watercolor/navy.png"
      alt=""
      class="pointer-events-none absolute top-[60%] left-[2%] z-5 w-20 rotate-[-15deg] object-contain sm:w-24"
    />
  </section>

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION: EVENTS — Garden Sign Style
       ════════════════════════════════════════════════════════════════════════ -->
  <section class="relative overflow-hidden py-20">
    <!-- Thicker parchment background -->
    <div class="absolute inset-0 bg-[#ebe4d8]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,123,139,0.10),transparent_60%)]"></div>

    <!-- Scattered flowers -->
    <img use:reveal={0} src="/images/watercolor/cherry.png" alt="" class="pointer-events-none absolute top-[8%] left-[2%] z-0 w-20 rotate-[-15deg] object-contain sm:w-28" />
    <img use:reveal={100} src="/images/watercolor/white.png" alt="" class="pointer-events-none absolute top-[12%] right-[3%] z-0 w-16 rotate-[20deg] scale-x-[-1] object-contain sm:w-22" />
    <img use:reveal={200} src="/images/watercolor/navy.png" alt="" class="pointer-events-none absolute bottom-[15%] left-[5%] z-0 w-18 rotate-[10deg] object-contain sm:w-24" />
    <img use:reveal={300} src="/images/watercolor/cherry.png" alt="" class="pointer-events-none absolute bottom-[10%] right-[2%] z-0 w-22 rotate-[-8deg] scale-x-[-1] object-contain sm:w-30" />

    <div class="relative z-10">
      <div use:reveal class="mb-14 text-center">
        <h2 class="font-script text-4xl text-[#1a1a1a] sm:text-5xl">Wedding Day</h2>
        <div class="mx-auto mt-3 h-px w-20 bg-[#c97b8b]/40"></div>
      </div>

      <div class="mx-auto max-w-md space-y-10 px-5">
        <!-- Akad — Garden sign card -->
        {#if akadEvent}
          <div use:reveal={0} class="relative">
            <!-- Leaf vine decoration top -->
            <svg class="pointer-events-none absolute -top-3 left-1/2 z-10 h-6 w-32 -translate-x-1/2 text-[#c97b8b]/40" viewBox="0 0 120 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <path d="M2 12c10-8 20 8 30 0s20-8 30 0 20 8 30 0 20-8 26 0" />
              <ellipse cx="20" cy="12" rx="4" ry="2" fill="currentColor" stroke="none" transform="rotate(-20 20 12)" />
              <ellipse cx="50" cy="12" rx="4" ry="2" fill="currentColor" stroke="none" transform="rotate(15 50 12)" />
              <ellipse cx="80" cy="12" rx="4" ry="2" fill="currentColor" stroke="none" transform="rotate(-10 80 12)" />
              <ellipse cx="105" cy="12" rx="4" ry="2" fill="currentColor" stroke="none" transform="rotate(20 105 12)" />
            </svg>

            <!-- Main card — garden sign style -->
            <div class="garden-sign border-[#c97b8b]/25 bg-[#fdfbf7]/80">
              <!-- Pink wash corner -->
              <div class="absolute top-0 right-0 h-32 w-32 bg-[radial-gradient(circle_at_top_right,rgba(201,123,139,0.12),transparent_70%)]"></div>

              <div class="relative pt-2">
                <div class="mb-4 flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#c97b8b]/10">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#c97b8b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 class="font-script text-2xl text-[#1a1a1a]">Akad Nikah</h3>
                </div>

                {#if akadDate}
                  <p class="font-love text-lg text-[#4a4a4a]">
                    {akadDate.dayName}, {akadDate.day} {akadDate.monthName} {akadDate.year}
                  </p>
                  <p class="mt-1 font-love text-sm text-[#c97b8b]">
                    {akadDate.hours}:{akadDate.minutes} WIB - Selesai
                  </p>
                {/if}

                <!-- Watercolor countdown -->
                <div class="mt-6 flex justify-center gap-3">
                  {#each ['days', 'hours', 'minutes', 'seconds'] as unit}
                    <div class="flex flex-col items-center">
                      <span class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#c97b8b]/20 to-[#c97b8b]/5 text-sm font-semibold text-[#6b1f1f] shadow-inner sm:h-14 sm:w-14">
                        {akadTimeLeft[unit as keyof TimeLeft] ?? '--'}
                      </span>
                      <span class="mt-1.5 font-love text-[10px] text-[#8a8a8a] capitalize">{unit}</span>
                    </div>
                  {/each}
                </div>

                <!-- Location -->
                <div class="mt-6 rounded-xl bg-[#faf8f5]/80 p-4">
                  <div class="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="mt-0.5 h-4 w-4 shrink-0 text-[#c97b8b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p class="font-love text-sm leading-relaxed text-[#4a4a4a]">
                      {akadEvent.location ?? 'Lokasi tidak tersedia'}
                    </p>
                  </div>
                  {#if akadEvent.locationUrl}
                    <a href={akadEvent.locationUrl} target="_blank" rel="noopener noreferrer"
                      class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#c97b8b] px-5 py-2.5 text-xs text-white shadow-[0_4px_14px_rgba(201,123,139,0.35)] transition hover:bg-[#b56a7a] hover:shadow-[0_6px_20px_rgba(201,123,139,0.45)]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Lihat Lokasi
                    </a>
                  {/if}
                </div>
              </div>
            </div>

            <!-- Leaf decoration bottom -->
            <svg class="pointer-events-none absolute -bottom-3 left-1/2 z-10 h-6 w-32 -translate-x-1/2 text-[#c97b8b]/30" viewBox="0 0 120 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <path d="M2 12c10 8 20-8 30 0s20 8 30 0 20-8 30 0 20 8 26 0" />
              <ellipse cx="25" cy="12" rx="4" ry="2" fill="currentColor" stroke="none" transform="rotate(15 25 12)" />
              <ellipse cx="55" cy="12" rx="4" ry="2" fill="currentColor" stroke="none" transform="rotate(-20 55 12)" />
              <ellipse cx="85" cy="12" rx="4" ry="2" fill="currentColor" stroke="none" transform="rotate(10 85 12)" />
              <ellipse cx="110" cy="12" rx="4" ry="2" fill="currentColor" stroke="none" transform="rotate(-15 110 12)" />
            </svg>
          </div>
        {/if}

        <!-- Resepsi — Garden sign card -->
        {#if receptionEvent}
          <div use:reveal={200} class="relative">
            <!-- Leaf vine decoration top -->
            <svg class="pointer-events-none absolute -top-3 left-1/2 z-10 h-6 w-32 -translate-x-1/2 text-[#1e3a5f]/35" viewBox="0 0 120 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <path d="M2 12c10-8 20 8 30 0s20-8 30 0 20 8 30 0 20-8 26 0" />
              <ellipse cx="20" cy="12" rx="4" ry="2" fill="currentColor" stroke="none" transform="rotate(-20 20 12)" />
              <ellipse cx="50" cy="12" rx="4" ry="2" fill="currentColor" stroke="none" transform="rotate(15 50 12)" />
              <ellipse cx="80" cy="12" rx="4" ry="2" fill="currentColor" stroke="none" transform="rotate(-10 80 12)" />
              <ellipse cx="105" cy="12" rx="4" ry="2" fill="currentColor" stroke="none" transform="rotate(20 105 12)" />
            </svg>

            <!-- Main card — garden sign style -->
            <div class="garden-sign border-[#1e3a5f]/20 bg-[#fdfbf7]/80">
              <!-- Navy wash corner -->
              <div class="absolute top-0 left-0 h-32 w-32 bg-[radial-gradient(circle_at_top_left,rgba(30,58,95,0.10),transparent_70%)]"></div>

              <div class="relative pt-2">
                <div class="mb-4 flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e3a5f]/10">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#1e3a5f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 class="font-script text-2xl text-[#1a1a1a]">Resepsi Pernikahan</h3>
                </div>

                {#if resepsiDate}
                  <p class="font-love text-lg text-[#4a4a4a]">
                    {resepsiDate.dayName}, {resepsiDate.day} {resepsiDate.monthName} {resepsiDate.year}
                  </p>
                  <p class="mt-1 font-love text-sm text-[#1e3a5f]">
                    {resepsiDate.hours}:{resepsiDate.minutes} WIB - Selesai
                  </p>
                {/if}

                <!-- Watercolor countdown -->
                <div class="mt-6 flex justify-center gap-3">
                  {#each ['days', 'hours', 'minutes', 'seconds'] as unit}
                    <div class="flex flex-col items-center">
                      <span class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1e3a5f]/15 to-[#1e3a5f]/5 text-sm font-semibold text-[#1e3a5f] shadow-inner sm:h-14 sm:w-14">
                        {resepsiTimeLeft[unit as keyof TimeLeft] ?? '--'}
                      </span>
                      <span class="mt-1.5 font-love text-[10px] text-[#8a8a8a] capitalize">{unit}</span>
                    </div>
                  {/each}
                </div>

                <!-- Location -->
                <div class="mt-6 rounded-xl bg-[#faf8f5]/80 p-4">
                  <div class="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="mt-0.5 h-4 w-4 shrink-0 text-[#1e3a5f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p class="font-love text-sm leading-relaxed text-[#4a4a4a]">
                      {receptionEvent.location ?? 'Lokasi tidak tersedia'}
                    </p>
                  </div>
                  {#if receptionEvent.locationUrl}
                    <a href={receptionEvent.locationUrl} target="_blank" rel="noopener noreferrer"
                      class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#1e3a5f] px-5 py-2.5 text-xs text-white shadow-[0_4px_14px_rgba(30,58,95,0.30)] transition hover:bg-[#152d4a] hover:shadow-[0_6px_20px_rgba(30,58,95,0.40)]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Lihat Lokasi
                    </a>
                  {/if}
                </div>
              </div>
            </div>

            <!-- Leaf decoration bottom -->
            <svg class="pointer-events-none absolute -bottom-3 left-1/2 z-10 h-6 w-32 -translate-x-1/2 text-[#1e3a5f]/25" viewBox="0 0 120 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <path d="M2 12c10 8 20-8 30 0s20 8 30 0 20-8 30 0 20 8 26 0" />
              <ellipse cx="25" cy="12" rx="4" ry="2" fill="currentColor" stroke="none" transform="rotate(15 25 12)" />
              <ellipse cx="55" cy="12" rx="4" ry="2" fill="currentColor" stroke="none" transform="rotate(-20 55 12)" />
              <ellipse cx="85" cy="12" rx="4" ry="2" fill="currentColor" stroke="none" transform="rotate(10 85 12)" />
              <ellipse cx="110" cy="12" rx="4" ry="2" fill="currentColor" stroke="none" transform="rotate(-15 110 12)" />
            </svg>
          </div>
        {/if}
      </div>
    </div>
  </section>

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION: GALLERY — Scattered Watercolor Cards
       ════════════════════════════════════════════════════════════════════════ -->
  <section class="relative overflow-hidden py-20">
    <!-- Artsy watercolor background -->
    <div class="absolute inset-0 bg-[#f5f0e8]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_20%,rgba(201,123,139,0.14),transparent_55%)]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_80%,rgba(30,58,95,0.11),transparent_55%)]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(245,240,232,0.8),transparent_70%)]"></div>

    <!-- Loose flowers decoration -->
    <img use:reveal={0} src="/images/watercolor/loose1.png" alt="" class="pointer-events-none absolute top-[5%] left-[-5%] z-0 w-28 rotate-[15deg] object-contain sm:w-36" />
    <img use:reveal={100} src="/images/watercolor/loose2.png" alt="" class="pointer-events-none absolute top-[10%] right-[-3%] z-0 w-20 rotate-[-20deg] scale-x-[-1] object-contain sm:w-24" />
    <img use:reveal={200} src="/images/watercolor/loose3.png" alt="" class="pointer-events-none absolute bottom-[8%] left-[2%] z-0 w-18 rotate-[-10deg] object-contain sm:w-22" />
    <img use:reveal={300} src="/images/watercolor/loose4.png" alt="" class="pointer-events-none absolute bottom-[5%] right-[-4%] z-0 w-24 rotate-[12deg] scale-x-[-1] object-contain sm:w-28" />

    <div class="relative z-10">
      <div use:reveal class="mb-14 text-center">
        <h2 class="font-script text-4xl text-[#1a1a1a] sm:text-5xl">Our Gallery</h2>
        <div class="mx-auto mt-3 h-px w-20 bg-[#c97b8b]/40"></div>
      </div>

      <!-- Scattered watercolor cards -->
      <div class="mx-auto max-w-md px-6">
        <div class="grid grid-cols-2 gap-5 sm:gap-6">
          {#each galleryImages.slice(0, 9) as photo, i}
            {@const color = washColors[i % washColors.length]}
            {@const rotation = cardRotations[i % cardRotations.length]}
            {@const isPortrait = i % 3 !== 1}
            {@const colSpan = isPortrait ? 'col-span-1' : 'col-span-2'}
            {@const offsetClass = i % 4 === 1 ? 'sm:mt-8' : i % 4 === 3 ? 'sm:-mt-4' : ''}

            <div
              use:reveal={i * 120}
              class="{colSpan} {offsetClass}"
              style="transform: rotate({rotation}deg)"
            >
              <div class="rounded-xl border {color.border} {color.bg} p-2 shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]">
                <div class="overflow-hidden rounded-lg">
                  <img
                    src={photo}
                    alt=""
                    class="{isPortrait ? 'aspect-[3/4]' : 'aspect-[4/3]'} w-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION: LOVE STORY — Watercolor Timeline
       ════════════════════════════════════════════════════════════════════════ -->
  {#if loveStories.length > 0}
    <section bind:this={storyEl} class="relative overflow-hidden py-20">
      <!-- Parchment background with washes -->
      <div class="absolute inset-0 bg-[#f5f0e8]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(201,123,139,0.12),transparent_60%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(30,58,95,0.08),transparent_60%)]"></div>

      <!-- Loose flowers decoration -->
      <img use:reveal={0} src="/images/watercolor/loose1.png" alt="" class="pointer-events-none absolute top-[5%] left-[2%] z-0 w-20 rotate-[12deg] object-contain sm:w-28" />
      <img use:reveal={100} src="/images/watercolor/loose3.png" alt="" class="pointer-events-none absolute bottom-[10%] right-[3%] z-0 w-18 rotate-[-15deg] object-contain sm:w-24" />
      <img use:reveal={200} src="/images/watercolor/loose2.png" alt="" class="pointer-events-none absolute top-[40%] right-[-2%] z-0 w-16 rotate-[20deg] scale-x-[-1] object-contain sm:w-20" />

      <!-- Watermark flower -->
      <svg class="pointer-events-none absolute bottom-[5%] left-[5%] z-0 h-24 w-24 opacity-10" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="15" fill="#c97b8b"/>
        <ellipse cx="50" cy="25" rx="12" ry="20" fill="#c97b8b" transform="rotate(0 50 50)"/>
        <ellipse cx="50" cy="25" rx="12" ry="20" fill="#c97b8b" transform="rotate(72 50 50)"/>
        <ellipse cx="50" cy="25" rx="12" ry="20" fill="#c97b8b" transform="rotate(144 50 50)"/>
        <ellipse cx="50" cy="25" rx="12" ry="20" fill="#c97b8b" transform="rotate(216 50 50)"/>
        <ellipse cx="50" cy="25" rx="12" ry="20" fill="#c97b8b" transform="rotate(288 50 50)"/>
        <circle cx="50" cy="50" r="6" fill="#f5f0e8"/>
      </svg>

      <div class="relative z-10">
        <div use:reveal class="mb-14 text-center">
          <h2 class="font-script text-4xl text-[#6b1f1f] sm:text-5xl">Our Story</h2>
          <div class="mx-auto mt-3 h-px w-20 bg-[#c97b8b]/40"></div>
        </div>

        <div
          bind:this={storyContainer}
          class="relative mx-auto max-w-md px-6 {loveStories.length > 4 ? 'pb-4' : ''}"
        >
          <!-- SVG vine that draws progressively as user scrolls -->
          <svg
            class="pointer-events-none absolute top-0 left-1/2 z-0 h-full w-px -translate-x-1/2 overflow-visible"
          >
            <path
              d={storyPathD}
              fill="none"
              stroke="#c97b8b"
              stroke-opacity="0.4"
              stroke-width="1"
              stroke-linecap="round"
              stroke-dasharray={storyLineLength}
              stroke-dashoffset={storyLineLength * (1 - storyProgress)}
              style="transition: none;"
            />
          </svg>

          {#each loveStories as story, i}
            {@const isLeft = i % 2 === 0}
            {@const dotActive = storyProgress > i / loveStories.length - 0.05}
            <div
              class="relative mb-14 transition-all duration-700 ease-out last:mb-0 {dotActive
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'}"
            >
              <!-- Timeline flower icon with leaves -->
              <div class="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <div class="transition-all duration-500 {dotActive ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-[-180deg] opacity-0'}">
                  <!-- Vine leaves branching out -->
                  <div class="absolute {isLeft ? '-right-4' : '-left-4'} top-1/2 -translate-y-1/2">
                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" class="{isLeft ? '' : 'scale-x-[-1]'}">
                      <path d="M2 8 Q6 2 12 4 Q16 6 18 8 Q14 10 10 8 Q6 7 2 8" fill="#6b9e75" opacity="0.6"/>
                      <path d="M2 8 Q8 12 14 10" stroke="#5a8a65" stroke-width="0.8" fill="none" opacity="0.5"/>
                    </svg>
                  </div>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="4" fill={isLeft ? '#c97b8b' : '#1e3a5f'}/>
                    <ellipse cx="14" cy="6" rx="4" ry="7" fill={isLeft ? '#c97b8b' : '#1e3a5f'} transform="rotate(0 14 14)" opacity="0.9"/>
                    <ellipse cx="14" cy="6" rx="4" ry="7" fill={isLeft ? '#c97b8b' : '#1e3a5f'} transform="rotate(72 14 14)" opacity="0.9"/>
                    <ellipse cx="14" cy="6" rx="4" ry="7" fill={isLeft ? '#c97b8b' : '#1e3a5f'} transform="rotate(144 14 14)" opacity="0.9"/>
                    <ellipse cx="14" cy="6" rx="4" ry="7" fill={isLeft ? '#c97b8b' : '#1e3a5f'} transform="rotate(216 14 14)" opacity="0.9"/>
                    <ellipse cx="14" cy="6" rx="4" ry="7" fill={isLeft ? '#c97b8b' : '#1e3a5f'} transform="rotate(288 14 14)" opacity="0.9"/>
                    <circle cx="14" cy="14" r="2" fill="#f5f0e8"/>
                  </svg>
                </div>
              </div>

              <div class="flex items-center">
                {#if isLeft}
                  <!-- Photo left -->
                  <div class="flex w-1/2 justify-end pr-4">
                    {#if story.imageUrl}
                      <div
                        class="w-full rotate-1 overflow-hidden rounded-xl bg-white/90 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur"
                      >
                        <img
                          src={story.imageUrl}
                          alt={story.title}
                          class="h-36 w-full rounded-lg object-cover"
                          loading="lazy"
                        />
                      </div>
                    {/if}
                  </div>

                  <!-- Text right -->
                  <div class="w-1/2 pl-4">
                    {#if story.date}
                      <p class="font-love text-[11px] tracking-wider text-[#4a6885]">
                        {story.date}
                      </p>
                    {/if}
                    <h4 class="mt-1 font-script text-sm text-[#6b1f1f]">
                      {story.title}
                    </h4>
                    <p class="mt-1 font-love text-xs leading-relaxed text-[#2c3e5a]">
                      {story.description}
                    </p>
                  </div>
                {:else}
                  <!-- Text left -->
                  <div class="w-1/2 pr-4 text-right">
                    {#if story.date}
                      <p class="font-love text-[11px] tracking-wider text-[#4a6885]">
                        {story.date}
                      </p>
                    {/if}
                    <h4 class="mt-1 font-script text-sm text-[#6b1f1f]">
                      {story.title}
                    </h4>
                    <p class="mt-1 font-love text-xs leading-relaxed text-[#2c3e5a]">
                      {story.description}
                    </p>
                  </div>

                  <!-- Photo right -->
                  <div class="flex w-1/2 justify-start pl-4">
                    {#if story.imageUrl}
                      <div
                        class="w-full -rotate-1 overflow-hidden rounded-xl bg-white/90 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur"
                      >
                        <img
                          src={story.imageUrl}
                          alt={story.title}
                          class="h-36 w-full rounded-lg object-cover"
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

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION: GIFT — Vintage Postcard Stack
       ════════════════════════════════════════════════════════════════════════ -->
  {#if gifts.length > 0}
    <section class="relative overflow-hidden py-20">
      <!-- Parchment background -->
      <div class="absolute inset-0 bg-[#f5f0e8]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,123,139,0.10),transparent_60%)]"></div>

      <!-- Loose flowers decoration -->
      <img use:reveal={0} src="/images/watercolor/loose1.png" alt="" class="pointer-events-none absolute top-[8%] right-[3%] z-0 w-18 rotate-[-10deg] object-contain sm:w-24" />
      <img use:reveal={100} src="/images/watercolor/loose3.png" alt="" class="pointer-events-none absolute bottom-[10%] left-[2%] z-0 w-16 rotate-[15deg] object-contain sm:w-20" />

      <div class="relative z-10">
        <div use:reveal class="mb-14 text-center">
          <h2 class="font-script text-4xl text-[#1a1a1a] sm:text-5xl">Wedding Gift</h2>
          <div class="mx-auto mt-3 h-px w-20 bg-[#c97b8b]/40"></div>
        </div>

        <div class="mx-auto max-w-md px-5">
          <!-- Vintage message card -->
          <div use:reveal class="mb-10 text-center">
            <p class="font-love text-sm leading-relaxed text-[#4a4a4a]">
              Doa restu Anda merupakan karunia yang paling berarti.<br />
              Namun apabila berkenan memberikan tanda kasih,<br />
              dapat melalui:
            </p>
          </div>

          <!-- Postcard stack for bank accounts -->
          <div class="space-y-6">
            {#each bankAccounts as acc, i}
              {@const rotation = [1.5, -1, 2, -1.5, 0.5][i % 5]}
              <div
                use:reveal={i * 100}
                class="postcard"
                style="transform: rotate({rotation}deg)"
              >
                <!-- Postcard border lines -->
                <div class="postcard-border"></div>

                <div class="relative p-5">
                  <!-- Leaf stamp area -->
                  <div class="absolute top-3 right-3">
                    <div class="leaf-stamp">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#6b8f5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3C7.5 3 4 6.5 4 10c0 3.5 3 7 8 11 5-4 8-7.5 8-11 0-3.5-3.5-7-8-7z" />
                      </svg>
                    </div>
                  </div>

                  <!-- Postmark -->
                  <div class="absolute top-3 left-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-[#6b8f5e]/30">
                    <span class="font-script text-[10px] text-[#6b8f5e]/60">gift</span>
                  </div>

                  <!-- Content -->
                  <div class="mt-8">
                    <p class="mb-3 text-center font-love text-xs tracking-wider text-[#8a8a8a] uppercase">Transfer to</p>

                    <div class="text-center">
                      <p class="font-love text-lg text-[#1a1a1a]">{acc.name}</p>
                      <div class="my-2 flex items-center justify-center gap-2">
                        <span class="font-mono text-2xl tracking-wider text-[#1a1a1a]">{acc.accountNumber}</span>
                      </div>
                      <p class="text-sm text-[#8a8a8a]">a.n. {acc.accountHolder}</p>
                    </div>

                    <!-- Copy button as vintage seal -->
                    <div class="mt-4 flex justify-center">
                      <button
                        class="vintage-seal"
                        on:click={() => copyToClipboard(acc.accountNumber ?? '')}
                      >
                        <span class="flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Salin
                        </span>
                      </button>
                    </div>
                  </div>

                  <!-- Decorative line with leaf -->
                  <div class="mt-4 flex items-center gap-2">
                    <div class="h-px flex-1 border-t border-dashed border-[#e8e0d5]"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-[#6b8f5e]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3C7.5 3 4 6.5 4 10c0 3.5 3 7 8 11 5-4 8-7.5 8-11 0-3.5-3.5-7-8-7z" />
                    </svg>
                    <div class="h-px flex-1 border-t border-dashed border-[#e8e0d5]"></div>
                  </div>
                </div>
              </div>
            {/each}
          </div>

          {#if bankAccounts.length > 0 && physicalGifts.length > 0}
            <div class="my-8 flex items-center justify-center gap-4">
              <div class="h-px w-12 border-t-2 border-dashed border-[#c97b8b]/30"></div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#c97b8b]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <div class="h-px w-12 border-t-2 border-dashed border-[#c97b8b]/30"></div>
            </div>
          {/if}

          <!-- Address label for physical gifts -->
          {#each physicalGifts as pg, i}
            <div use:reveal={i * 100} class="mt-6">
              <div class="address-label">
                <div class="flex items-center gap-2 border-b-2 border-dashed border-[#1e3a5f]/20 pb-3">
                  <div class="rounded-full bg-[#1e3a5f]/10 p-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#1e3a5f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p class="text-xs font-medium uppercase tracking-wider text-[#1e3a5f]">
                    {pg.name ?? 'Kirim ke Alamat'}
                  </p>
                </div>
                <p class="mt-3 text-center text-sm leading-relaxed text-[#4a4a4a]" style="white-space:pre-line">
                  {pg.description}
                </p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION: RSVP & WISHES — Botanical Notebook Style
       ════════════════════════════════════════════════════════════════════════ -->
  <section class="relative overflow-hidden py-20">
    <!-- Parchment background -->
    <div class="absolute inset-0 bg-[#f5f0e8]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,123,139,0.10),transparent_60%)]"></div>

    <!-- Loose flowers -->
    <img use:reveal={0} src="/images/watercolor/loose2.png" alt="" class="pointer-events-none absolute top-[5%] left-[3%] z-0 w-16 rotate-[20deg] object-contain sm:w-20" />
    <img use:reveal={100} src="/images/watercolor/loose4.png" alt="" class="pointer-events-none absolute bottom-[8%] right-[2%] z-0 w-18 rotate-[-10deg] scale-x-[-1] object-contain sm:w-22" />

    <div class="relative z-10">
      <div class="mx-auto max-w-md space-y-16 px-5">
        <!-- RSVP Form -->
        <div use:reveal>
          <div class="mb-10 text-center">
            <h2 class="font-script text-4xl text-[#1a1a1a] sm:text-5xl">Reservasi Kehadiran</h2>
            <div class="mx-auto mt-3 h-px w-20 bg-[#c97b8b]/40"></div>
          </div>

          <!-- Botanical Notebook -->
          <div class="botanical-notebook">
            <!-- Spiral binding -->
            <div class="spiral-binding"></div>

            <!-- Notebook paper -->
            <div class="notebook-paper">
              <!-- Leaf corner decorations -->
              <svg class="pointer-events-none absolute top-2 right-2 z-0 h-5 w-5 text-[#c97b8b]/20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3C7.5 3 4 6.5 4 10c0 3.5 3 7 8 11 5-4 8-7.5 8-11 0-3.5-3.5-7-8-7z"/>
              </svg>
              <svg class="pointer-events-none absolute bottom-2 left-8 z-0 h-4 w-4 text-[#1e3a5f]/15 rotate-[-20deg]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3C7.5 3 4 6.5 4 10c0 3.5 3 7 8 11 5-4 8-7.5 8-11 0-3.5-3.5-7-8-7z"/>
              </svg>

              <!-- Header inside notebook -->
              <div class="mb-6 text-center">
                <p class="font-love text-sm text-[#8a8a8a]">
                  Mohon konfirmasi kehadiran Anda
                </p>
              </div>

              <div class="space-y-1">
                <!-- Nama -->
                <div class="notebook-field">
                  <div class="botanical-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <label for="garden-rsvp-name" class="notebook-label">Nama Lengkap</label>
                    <input
                      id="garden-rsvp-name"
                      type="text"
                      bind:value={rsvpName}
                      placeholder="Tulis nama Anda..."
                      class="notebook-input"
                    />
                  </div>
                </div>

                <!-- Kehadiran -->
                <div class="notebook-field">
                  <div class="botanical-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="notebook-label">Konfirmasi Kehadiran</p>
                    <div class="flex gap-3 pt-1">
                      <button
                        type="button"
                        on:click={() => (rsvpPresence = 'hadir')}
                        class="notebook-checkbox {rsvpPresence === 'hadir' ? 'notebook-checkbox-checked' : ''}"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Hadir
                      </button>
                      <button
                        type="button"
                        on:click={() => (rsvpPresence = 'tidak')}
                        class="notebook-checkbox {rsvpPresence === 'tidak' ? 'notebook-checkbox-checked-navy' : ''}"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Tidak Hadir
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Ucapan -->
                <div class="notebook-field">
                  <div class="botanical-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <label for="garden-rsvp-msg" class="notebook-label">Ucapan & Doa</label>
                    <textarea
                      id="garden-rsvp-msg"
                      bind:value={rsvpMessage}
                      rows="3"
                      placeholder="Tulis doa terbaik Anda..."
                      class="notebook-textarea"
                    ></textarea>
                  </div>
                </div>
              </div>

              {#if rsvpError}<p class="mt-3 text-xs text-red-400">{rsvpError}</p>{/if}
              {#if rsvpSubmitted}<p class="mt-3 text-xs text-[#c97b8b]">Terima kasih, konfirmasi terkirim!</p>{/if}

              <!-- Submit button -->
              <div class="mt-8 flex justify-center">
                <button
                  type="button"
                  on:click={handleSubmitRsvp}
                  disabled={rsvpSubmitting}
                  class="botanical-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {rsvpSubmitting ? 'Mengirim...' : 'Kirim'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Wishes display — Sticky Notes Style -->
        <div use:reveal>
          <div class="mb-10 text-center">
            <h2 class="font-script text-3xl text-[#1a1a1a] sm:text-4xl">Ucapan & Doa</h2>
            <div class="mx-auto mt-3 h-px w-20 bg-[#c97b8b]/40"></div>
          </div>

          <p class="mb-6 text-center font-love text-xs text-[#8a8a8a]">
            Doa dan harapan terbaik dari keluarga dan sahabat
          </p>

          <div class="space-y-4">
            {#each pagedWishes as r, i (r.id)}
              {@const rotations = [-1, 0.5, -0.5, 1, -0.8, 0.3]}
              {@const bgColors = ['bg-[#fef9e7]', 'bg-[#f5f0e8]', 'bg-[#fdf2f4]']}
              {@const pinColors = ['text-[#c97b8b]', 'text-[#1e3a5f]', 'text-[#6b1f1f]']}
              <div
                class="sticky-note {bgColors[i % bgColors.length]}"
                style="transform: rotate({rotations[i % rotations.length]}deg)"
              >
                <!-- Leaf pin at top -->
                <div class="absolute -top-3 left-1/2 -translate-x-1/2 {pinColors[i % pinColors.length]}">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3C7.5 3 4 6.5 4 10c0 3.5 3 7 8 11 5-4 8-7.5 8-11 0-3.5-3.5-7-8-7z"/>
                    <path d="M12 3v18" stroke="white" stroke-width="0.5" fill="none"/>
                  </svg>
                </div>
                <div class="relative pt-1">
                  <div class="flex items-start gap-3">
                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e3a5f]/8">
                      <span class="font-script text-sm text-[#1e3a5f]">{r.name.charAt(0)}</span>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-[#1a1a1a]">{r.name}</p>
                      {#if r.message}
                        <p class="mt-1 text-sm leading-relaxed text-[#4a4a4a]">{r.message}</p>
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
            <button
              class="botanical-btn mx-auto mt-6 block"
              on:click={() => (wishesPage += 1)}
            >
              Tampilkan lebih banyak
            </button>
          {/if}
        </div>
      </div>
    </div>
  </section>

  <!-- ════════════════════════════════════════════════════════════════════════
       SECTION: CLOSING — Garden Gate Frame
       ════════════════════════════════════════════════════════════════════════ -->
  <section class="relative overflow-hidden py-28">
    <!-- Parchment wash background -->
    <div class="absolute inset-0 bg-[#f5f0e8]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,123,139,0.08),transparent_60%)]"></div>

    <div class="relative z-20 mx-auto max-w-sm px-6">
      <!-- Garden trellis frame -->
      <div use:reveal class="garden-frame">
        <!-- Flowers climbing on frame -->
        <img src="/images/watercolor/loose1.png" alt="" class="pointer-events-none absolute -top-5 -left-5 z-10 w-14 rotate-[-15deg] object-contain sm:w-18" />
        <img src="/images/watercolor/loose2.png" alt="" class="pointer-events-none absolute -top-4 -right-5 z-10 w-12 rotate-[20deg] scale-x-[-1] object-contain sm:w-16" />
        <img src="/images/watercolor/loose3.png" alt="" class="pointer-events-none absolute -bottom-5 -left-4 z-10 w-14 rotate-[10deg] object-contain sm:w-18" />
        <img src="/images/watercolor/flower-1.png" alt="" class="pointer-events-none absolute -bottom-6 -right-5 z-10 w-16 rotate-[-10deg] scale-x-[-1] object-contain sm:w-20" />

        <!-- Trellis vine decoration top -->
        <svg class="pointer-events-none absolute -top-2 left-1/2 z-0 h-4 w-28 -translate-x-1/2 text-[#c97b8b]/25" viewBox="0 0 120 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M2 8c10-6 20 6 30 0s20-6 30 0 20 6 30 0 20-6 26 0" />
          <circle cx="20" cy="8" r="2" fill="currentColor" stroke="none" />
          <circle cx="50" cy="8" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="80" cy="8" r="2" fill="currentColor" stroke="none" />
          <circle cx="105" cy="8" r="1.5" fill="currentColor" stroke="none" />
        </svg>

        <!-- Trellis vine decoration bottom -->
        <svg class="pointer-events-none absolute -bottom-2 left-1/2 z-0 h-4 w-28 -translate-x-1/2 text-[#1e3a5f]/20" viewBox="0 0 120 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M2 8c10 6 20-6 30 0s20 6 30 0 20-6 30 0 20 6 26 0" />
          <circle cx="25" cy="8" r="2" fill="currentColor" stroke="none" />
          <circle cx="55" cy="8" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="85" cy="8" r="2" fill="currentColor" stroke="none" />
          <circle cx="110" cy="8" r="1.5" fill="currentColor" stroke="none" />
        </svg>

        <div class="relative px-8 py-10 text-center">
          <p class="font-love text-sm leading-relaxed text-[#4a4a4a]">
            Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak / Ibu / Saudara / i
            berkenan hadir dan memberikan doa restu.
          </p>

          <p class="mt-6 mb-8 font-love text-sm text-[#8a8a8a] italic">
            {closingMessage || 'Atas kehadiran dan doa restunya, kami ucapkan terima kasih.'}
          </p>

          <!-- Couple names with watercolor underline -->
          <div class="space-y-1">
            <div class="relative inline-block">
              <p class="font-script text-4xl text-[#1a1a1a]" style={groomNameStyle}>{groomFirstName}</p>
              <div class="absolute -bottom-1 left-[10%] right-[10%] h-2 rounded-full bg-[#c97b8b]/20 blur-[2px]"></div>
            </div>

            <p class="font-script text-2xl text-[#c97b8b]">&amp;</p>

            <div class="relative inline-block">
              <p class="font-script text-4xl text-[#1a1a1a]" style={brideNameStyle}>{brideFirstName}</p>
              <div class="absolute -bottom-1 left-[10%] right-[10%] h-2 rounded-full bg-[#1e3a5f]/20 blur-[2px]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Divider flower -->
    <div class="relative z-20 mt-12 flex items-center justify-center gap-4">
      <div class="h-px w-16 border-t border-dashed border-[#c97b8b]/30"></div>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#c97b8b]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      <div class="h-px w-16 border-t border-dashed border-[#c97b8b]/30"></div>
    </div>

    <!-- Credit -->
    <div use:reveal class="relative z-20 mt-8 text-center">
      <div class="relative inline-block">
        <Credit />
        <img src="/images/watercolor/loose3.png" alt="" class="pointer-events-none absolute -top-6 -left-8 z-0 w-10 rotate-[-20deg] object-contain" />
        <img src="/images/watercolor/loose4.png" alt="" class="pointer-events-none absolute -top-5 -right-8 z-0 w-10 rotate-[15deg] scale-x-[-1] object-contain" />
      </div>
    </div>
  </section>
</main>

<style>
  .garden-main {
    font-family:
      'Segoe UI',
      system-ui,
      -apple-system,
      sans-serif;
    background-color: #f5f0e8;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  }

  .arch-photo {
    border: 1.5px solid #2c2c2c;
    border-radius: 50% 50% 0 0 / 15% 15% 0 0;
    overflow: hidden;
  }

  .arch-frame-sm {
    border: 1.5px solid #2c2c2c;
    border-radius: 80px 80px 0 0;
    background: transparent;
  }

  /* ── Quote meadow animations ─────────────────────────────── */
  .cursor {
    display: inline-block;
    width: 1px;
    background: #1a3a5c;
    margin-left: 1px;
    animation: none;
  }
  .cursor.blink {
    animation: blink 0.8s infinite;
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
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

  /* ── Vintage postcard styles ───────────────────────────── */
  .postcard {
    position: relative;
    background: #fdfcf9;
    border-radius: 4px;
    box-shadow:
      0 1px 1px rgba(0,0,0,0.08),
      0 2px 4px rgba(0,0,0,0.06),
      0 8px 16px rgba(0,0,0,0.04);
  }

  .postcard-border {
    position: absolute;
    inset: 6px;
    border: 1px solid #e8e0d5;
    border-radius: 2px;
    pointer-events: none;
  }

  .stamp {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 38px;
    background: repeating-linear-gradient(
      -45deg,
      #fdfcf9,
      #fdfcf9 2px,
      #e8e0d5 2px,
      #e8e0d5 4px
    );
    border: 1px solid #e8e0d5;
    box-shadow: inset 0 0 0 1px #fdfcf9;
  }

  .vintage-seal {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 6px 16px;
    background: #c97b8b;
    color: white;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.05em;
    border-radius: 2px;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.2),
      0 2px 4px rgba(201,123,139,0.3);
    transition: all 0.2s ease;
    cursor: pointer;
  }
  .vintage-seal:hover {
    background: #b56a7a;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.2),
      0 3px 6px rgba(201,123,139,0.4);
  }
  .vintage-seal:active {
    transform: scale(0.95);
  }

  .address-label {
    background: #f5f0e8;
    border: 2px dashed #1e3a5f;
    border-radius: 4px;
    padding: 16px;
    position: relative;
  }
  .address-label::before {
    content: '';
    position: absolute;
    top: 8px;
    right: 8px;
    width: 16px;
    height: 20px;
    background: repeating-linear-gradient(
      -45deg,
      #f5f0e8,
      #f5f0e8 1px,
      #1e3a5f 1px,
      #1e3a5f 2px
    );
    opacity: 0.15;
  }

  /* ── Botanical notebook styles ──────────────────────────── */
  .botanical-notebook {
    position: relative;
    background: #fdfbf7;
    border-radius: 8px;
    box-shadow:
      0 1px 2px rgba(0,0,0,0.05),
      0 4px 8px rgba(0,0,0,0.04),
      0 12px 24px rgba(0,0,0,0.03);
  }

  .spiral-binding {
    position: absolute;
    left: 8px;
    top: 24px;
    bottom: 24px;
    width: 3px;
    background: repeating-linear-gradient(
      to bottom,
      #c97b8b 0px,
      #c97b8b 8px,
      transparent 8px,
      transparent 14px
    );
    opacity: 0.5;
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
      #c97b8b 4px,
      #c97b8b 5px,
      transparent 5px,
      transparent 14px
    );
    opacity: 0.4;
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
    border-bottom: 1px solid #e8e0d5;
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
    background: rgba(201,123,139,0.12);
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
    border-bottom: 1px solid #e8e0d5;
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
    border-bottom: 1px solid #e8e0d5;
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
    border: 1.5px solid #e0d8cc;
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
    background: rgba(201,123,139,0.08);
    border: 1.5px solid rgba(201,123,139,0.35);
    border-radius: 24px;
    font-size: 13px;
    color: #c97b8b;
    font-weight: 500;
    letter-spacing: 0.02em;
    box-shadow: 0 2px 8px rgba(201,123,139,0.08);
    transition: all 0.25s ease;
    cursor: pointer;
  }
  .botanical-btn:hover {
    background: #c97b8b;
    border-color: #c97b8b;
    color: white;
    box-shadow: 0 4px 14px rgba(201,123,139,0.25);
  }
  .botanical-btn:active {
    transform: scale(0.96);
  }
  .botanical-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .sticky-note {
    position: relative;
    padding: 16px;
    border-radius: 2px;
    box-shadow:
      0 1px 2px rgba(0,0,0,0.06),
      0 3px 6px rgba(0,0,0,0.04);
  }

  .garden-sign {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    border-width: 2px;
    border-style: dashed;
    padding: 20px;
    box-shadow:
      0 2px 4px rgba(0,0,0,0.04),
      0 8px 16px rgba(0,0,0,0.03);
  }

  .garden-frame {
    position: relative;
    border: 2px solid #e0d8cc;
    border-radius: 16px;
    background: rgba(253,251,247,0.6);
    box-shadow:
      0 2px 4px rgba(0,0,0,0.03),
      0 8px 16px rgba(0,0,0,0.02);
  }

  @media (min-width: 640px) {
    .arch-frame-sm {
      border-radius: 100px 100px 0 0;
    }
  }
</style>
