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
  const brideFirstName = (bride.name || 'BRIDE').split(' ')[0];
  const groomFirstName = (groom.name || 'GROOM').split(' ')[0];
  const groomNameStyle = getAdaptiveNameStyle(groomFirstName, { maxRem: 2.6, minRem: 1.4, endAt: 18 });
  const brideNameStyle = getAdaptiveNameStyle(brideFirstName, { maxRem: 2.6, minRem: 1.4, endAt: 18 });
  const galleryImages: string[] = invitation.gallery?.imageUrls ?? [];
  const stripPhoto: string | null = invitation.cover?.imageUrls?.[0] ?? galleryImages[0] ?? null;

  function igHandle(person: any): string | null {
    const url: string = person?.socialMedia?.instagram ?? '';
    if (!url) return null;
    const handle = url.split('/').filter(Boolean).pop() ?? '';
    return handle ? `@${handle.replace(/^@/, '')}` : null;
  }
  const brideIg = igHandle(bride);
  const groomIg = igHandle(groom);

  const events = invitation?.events ?? [];
  const akadEvent = events.find((e: any) => e.type === 'akad');
  const receptionEvent = events.find((e: any) => e.type === 'reception');
  const loveStories = invitation?.loveStories ?? [];
  const gifts = invitation?.gifts ?? [];
  const bankAccounts = gifts.filter((g: any) => g.type === 'bank');
  const physicalGifts = gifts.filter((g: any) => g.type === 'physical');
  const closingMessage = invitation?.closing?.message ?? '';

  // Gift tab
  let giftTab: 'transfer' | 'fisik' = bankAccounts.length > 0 ? 'transfer' : 'fisik';

  // Typing animation for verse
  const verseFullText = invitation?.quote?.text ||
    'Di antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa cinta dan kasih sayang.';
  const quoteSource = invitation?.quote?.source || 'QS. Ar-Rum: 21';
  let verseTyped = '';
  let verseCursor = true;

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

    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < verseFullText.length) {
        verseTyped += verseFullText[i];
        i++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => (verseCursor = false), 2000);
      }
    }, 45);

    return () => {
      window.removeEventListener('scroll', onScroll);
      clearInterval(typeInterval);
    };
  });

  function cubicLen(
    x0: number, y0: number, x1: number, y1: number,
    x2: number, y2: number, x3: number, y3: number
  ): number {
    let len = 0;
    let lx = x0, ly = y0;
    for (let t = 1; t <= 24; t++) {
      const u = t / 24, v = 1 - u;
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
    let px = 0, py = 0;

    for (let i = 0; i < n; i++) {
      const tx = photoOff * (i % 2 === 0 ? -1 : 1);
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

  // Countdown (menuju akad)
  type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

  let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

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
      timeLeft = calcTimeLeft(akadEvent?.date ?? receptionEvent?.date ?? '');
    }, 1000);
    return () => clearInterval(countdownTimer);
  });

  const akadDate = akadEvent?.date ? formatIndonesianDate(akadEvent.date) : null;
  const resepsiDate = receptionEvent?.date ? formatIndonesianDate(receptionEvent.date) : null;

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

<main class="meadow-main relative overflow-x-hidden text-[#1a1a1a]">
  <!-- SECTION: QUOTE — Full Watercolor Meadow (garden-style) -->
  <section class="quote-meadow relative min-h-svh w-full overflow-hidden">
    <!-- z-0: Sky background -->
    <img
      src="/images/watercolor/sky-bg.png"
      alt=""
      class="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
    />

    <!-- z-10: Verse text with typing animation -->
    <div class="relative z-10 flex flex-col items-center px-6 pt-24 pb-[50vh]">
      <div class="mx-auto max-w-sm text-center">
        <p class="text-sm leading-relaxed text-[#1a3a5c] sm:text-base">
          {verseTyped}<span class="cursor" class:blink={verseCursor}>|</span>
        </p>
        <p class="mt-4 font-type text-xs text-[#6b1f1f]/80 italic">{quoteSource}</p>
      </div>
    </div>

    <!-- z-20: 3 Butterflies near text -->
    <img src="/images/watercolor/bf-1.png" alt="" class="float-gentle pointer-events-none absolute top-[14%] left-[18%] z-20 w-6 object-contain sm:w-8" style="--float-dur:4s; --float-del:0s;" />
    <img src="/images/watercolor/bf-2.png" alt="" class="float-gentle pointer-events-none absolute top-[18%] right-[22%] z-20 w-5 scale-x-[-1] object-contain sm:w-7" style="--float-dur:5s; --float-del:1.2s;" />
    <img src="/images/watercolor/bf-3.png" alt="" class="float-gentle pointer-events-none absolute top-[10%] left-[48%] z-20 w-7 object-contain sm:w-9" style="--float-dur:4.5s; --float-del:0.6s;" />

    <!-- z-45: 4 Butterflies near flowers -->
    <img src="/images/watercolor/bf-1.png" alt="" class="float-gentle pointer-events-none absolute bottom-[18%] left-[12%] z-45 w-6 scale-x-[-1] object-contain sm:w-8" style="--float-dur:5s; --float-del:0.3s;" />
    <img src="/images/watercolor/bf-2.png" alt="" class="float-gentle pointer-events-none absolute right-[15%] bottom-[22%] z-45 w-5 object-contain sm:w-7" style="--float-dur:4s; --float-del:1.5s;" />
    <img src="/images/watercolor/bf-3.png" alt="" class="float-gentle pointer-events-none absolute bottom-[15%] left-[38%] z-45 w-6 scale-x-[-1] object-contain sm:w-8" style="--float-dur:5.5s; --float-del:0.9s;" />
    <img src="/images/watercolor/bf-1.png" alt="" class="float-gentle pointer-events-none absolute right-[38%] bottom-[20%] z-45 w-5 object-contain sm:w-7" style="--float-dur:4.2s; --float-del:1.8s;" />

    <!-- z-30: Meadow strip -->
    <img src="/images/watercolor/meadow.png" alt="" class="pointer-events-none absolute bottom-0 z-30 w-full object-contain" />

    <!-- z-35: Couple walking -->
    <img src="/images/watercolor/couple-walking.png" alt="" class="pointer-events-none absolute bottom-[14%] left-[46%] z-[37] w-28 object-contain sm:w-36" />

    <!-- z-30: Deep background flowers (smallest, far behind) -->
    <img use:reveal={0} src="/images/watercolor/flo-3.png" alt="" class="pointer-events-none absolute -bottom-4 left-[4%] z-30 h-20 object-contain sm:h-28" />
    <img use:reveal={50} src="/images/watercolor/flo-6.png" alt="" class="pointer-events-none absolute -bottom-4 left-[22%] z-30 h-24 object-contain sm:h-32" />
    <img use:reveal={100} src="/images/watercolor/flo-2.png" alt="" class="pointer-events-none absolute -bottom-4 left-[40%] z-30 h-20 object-contain sm:h-28" />
    <img use:reveal={150} src="/images/watercolor/flo-5.png" alt="" class="pointer-events-none absolute -bottom-4 left-[56%] z-30 h-24 object-contain sm:h-32" />
    <img use:reveal={200} src="/images/watercolor/flo-7.png" alt="" class="pointer-events-none absolute -bottom-4 left-[72%] z-30 h-20 object-contain sm:h-28" />
    <img use:reveal={250} src="/images/watercolor/flo-4.png" alt="" class="pointer-events-none absolute -bottom-4 left-[88%] z-30 h-24 object-contain sm:h-32" />

    <!-- z-35: Mid-layer flowers (medium) -->
    <img use:reveal={300} src="/images/watercolor/flo-5.png" alt="" class="pointer-events-none absolute -bottom-2 left-[8%] z-35 h-28 object-contain sm:h-36" />
    <img use:reveal={350} src="/images/watercolor/flo-1.png" alt="" class="pointer-events-none absolute -bottom-2 left-[16%] z-35 h-24 object-contain sm:h-32" />
    <img use:reveal={400} src="/images/watercolor/flo-7.png" alt="" class="pointer-events-none absolute -bottom-2 left-[28%] z-35 h-28 scale-x-[-1] object-contain sm:h-36" />
    <img use:reveal={450} src="/images/watercolor/flo-3.png" alt="" class="pointer-events-none absolute -bottom-2 left-[36%] z-35 h-24 object-contain sm:h-32" />
    <img use:reveal={500} src="/images/watercolor/flo-2.png" alt="" class="pointer-events-none absolute -bottom-2 left-[46%] z-35 h-28 object-contain sm:h-36" />
    <img use:reveal={550} src="/images/watercolor/flo-6.png" alt="" class="pointer-events-none absolute -bottom-2 left-[52%] z-35 h-24 scale-x-[-1] object-contain sm:h-32" />
    <img use:reveal={600} src="/images/watercolor/flo-4.png" alt="" class="pointer-events-none absolute -bottom-2 left-[62%] z-35 h-28 object-contain sm:h-36" />
    <img use:reveal={650} src="/images/watercolor/flo-1.png" alt="" class="pointer-events-none absolute -bottom-2 left-[70%] z-35 h-24 object-contain sm:h-32" />
    <img use:reveal={700} src="/images/watercolor/flo-5.png" alt="" class="pointer-events-none absolute -bottom-2 left-[80%] z-35 h-28 scale-x-[-1] object-contain sm:h-36" />
    <img use:reveal={750} src="/images/watercolor/flo-7.png" alt="" class="pointer-events-none absolute -bottom-2 left-[92%] z-35 h-24 object-contain sm:h-32" />

    <!-- z-40: Foreground flowers (biggest, front) -->
    <img use:reveal={800} src="/images/watercolor/flo-1.png" alt="" class="pointer-events-none absolute bottom-0 left-[1%] z-40 h-32 object-contain sm:h-48" />
    <img use:reveal={850} src="/images/watercolor/flo-2.png" alt="" class="pointer-events-none absolute bottom-0 left-[7%] z-40 h-24 object-contain sm:h-32" />
    <img use:reveal={900} src="/images/watercolor/flo-3.png" alt="" class="pointer-events-none absolute bottom-0 left-[12%] z-40 h-28 object-contain sm:h-40" />
    <img use:reveal={950} src="/images/watercolor/flo-4.png" alt="" class="pointer-events-none absolute bottom-0 left-[18%] z-40 h-24 scale-x-[-1] object-contain sm:h-32" />
    <img use:reveal={1000} src="/images/watercolor/flo-5.png" alt="" class="pointer-events-none absolute bottom-0 left-[24%] z-40 h-32 object-contain sm:h-48" />
    <img use:reveal={1050} src="/images/watercolor/flo-6.png" alt="" class="pointer-events-none absolute bottom-0 left-[30%] z-40 h-28 scale-x-[-1] object-contain sm:h-40" />
    <img use:reveal={1100} src="/images/watercolor/flo-7.png" alt="" class="pointer-events-none absolute bottom-0 left-[36%] z-40 h-32 object-contain sm:h-48" />
    <img use:reveal={1150} src="/images/watercolor/flo-1.png" alt="" class="pointer-events-none absolute bottom-0 left-[42%] z-40 h-24 object-contain sm:h-32" />
    <img use:reveal={1200} src="/images/watercolor/flo-2.png" alt="" class="pointer-events-none absolute bottom-0 left-[48%] z-40 h-28 object-contain sm:h-40" />
    <img use:reveal={1250} src="/images/watercolor/flo-3.png" alt="" class="pointer-events-none absolute bottom-0 left-[54%] z-40 h-24 object-contain sm:h-32" />
    <img use:reveal={1300} src="/images/watercolor/flo-4.png" alt="" class="pointer-events-none absolute bottom-0 left-[60%] z-40 h-32 scale-x-[-1] object-contain sm:h-48" />
    <img use:reveal={1350} src="/images/watercolor/flo-5.png" alt="" class="pointer-events-none absolute bottom-0 left-[66%] z-40 h-28 object-contain sm:h-40" />
    <img use:reveal={1400} src="/images/watercolor/flo-6.png" alt="" class="pointer-events-none absolute bottom-0 left-[72%] z-40 h-24 object-contain sm:h-32" />
    <img use:reveal={1450} src="/images/watercolor/flo-7.png" alt="" class="pointer-events-none absolute bottom-0 left-[78%] z-40 h-32 object-contain sm:h-48" />
    <img use:reveal={1500} src="/images/watercolor/flo-1.png" alt="" class="pointer-events-none absolute bottom-0 left-[84%] z-40 h-24 object-contain sm:h-32" />
    <img use:reveal={1550} src="/images/watercolor/flo-3.png" alt="" class="pointer-events-none absolute bottom-0 left-[90%] z-40 h-28 object-contain sm:h-40" />
  </section>
  <!-- SECTION: COUPLE — Storybook Portrait -->
  <div class="relative pt-24 pb-10 text-center" use:reveal={0}>
    <p class="font-type text-[10px] tracking-[0.3em] text-[#8a8a8a] uppercase">The Wedding of</p>
    <h2 class="mt-2 font-script text-5xl text-[#c97b8b] sm:text-6xl" style={brideNameStyle}>{brideFirstName}</h2>
    <h2 class="font-script text-5xl text-[#1a1a1a] sm:text-6xl" style={groomNameStyle}>{groomFirstName}</h2>
    {#if akadDate}
      <p class="mt-4 font-type text-sm text-[#8a8a8a]">
        {akadDate.dayName}, {akadDate.day} {akadDate.monthName} {akadDate.year}
      </p>
    {/if}
  </div>

  <!-- BRIDE — Sticker photo kiri, info kanan -->
  <section class="relative overflow-hidden py-16" use:reveal={0}>
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
        <img use:reveal={200} src="/images/watercolor/cherry.png" alt="" class="pointer-events-none absolute -top-6 -left-6 z-10 w-24 rotate-[12deg] object-contain sm:w-32" />
        <img use:reveal={300} src="/images/watercolor/white.png" alt="" class="pointer-events-none absolute -bottom-4 -right-4 z-10 w-20 rotate-[-20deg] object-contain sm:w-24" />
      </div>

      <!-- Info -->
      <div class="mt-8 text-center sm:mt-0 sm:w-1/2 sm:text-left">
        <p class="font-script text-3xl text-[#c97b8b]">{brideFirstName}</p>
        {#if brideIg}
          <p class="mt-1 flex items-center justify-center gap-1 font-type text-xs text-[#8a8a8a] sm:justify-start">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            {brideIg}
          </p>
        {/if}
        <p class="mt-3 font-type text-sm leading-relaxed text-[#4a4a4a]">
          Putri dari Bapak {bride.father ?? '-'} &amp; Ibu {bride.mother ?? '-'}
        </p>
      </div>
    </div>
  </section>
  <!-- GROOM — Info kiri, sticker photo kanan -->
  <section class="relative overflow-hidden py-16" use:reveal={0}>
    <div class="relative mx-auto max-w-md px-6 sm:flex sm:flex-row-reverse sm:items-center sm:gap-8">
      <!-- Sticker photo -->
      <div class="relative mx-auto w-3/4 sm:mx-0 sm:w-1/2">
        <div class="sticker rotate-[2deg]">
          <img
            src={groom.imageUrls?.[0] ?? '/images/default/groom.png'}
            alt={groomFirstName}
            class="h-72 w-full rounded-2xl object-cover sm:h-80"
          />
        </div>
        <img use:reveal={200} src="/images/watercolor/navy.png" alt="" class="pointer-events-none absolute -top-6 -right-6 z-10 w-24 rotate-[-12deg] object-contain sm:w-32" />
        <img use:reveal={300} src="/images/watercolor/white.png" alt="" class="pointer-events-none absolute -bottom-4 -left-4 z-10 w-20 rotate-[20deg] object-contain sm:w-24" />
      </div>

      <!-- Info -->
      <div class="mt-8 text-center sm:mt-0 sm:w-1/2 sm:text-right">
        <p class="font-script text-3xl text-[#1e3a5f]">{groomFirstName}</p>
        {#if groomIg}
          <p class="mt-1 flex items-center justify-center gap-1 font-type text-xs text-[#8a8a8a] sm:justify-end">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            {groomIg}
          </p>
        {/if}
        <p class="mt-3 font-type text-sm leading-relaxed text-[#4a4a4a]">
          Putra dari Bapak {groom.father ?? '-'} &amp; Ibu {groom.mother ?? '-'}
        </p>
      </div>
    </div>
  </section>

  <!-- Flower divider -->
  <div class="relative flex items-end justify-center gap-2 py-6 sm:gap-3 sm:py-8">
    <img use:reveal={0} src="/images/watercolor/cherry.png" alt="" class="h-20 rotate-[-6deg] object-contain sm:h-28" />
    <img use:reveal={100} src="/images/watercolor/white.png" alt="" class="h-16 rotate-[3deg] object-contain sm:h-20" />
    <img use:reveal={200} src="/images/watercolor/navy.png" alt="" class="z-10 h-28 object-contain sm:h-36" />
    <img use:reveal={300} src="/images/watercolor/cherry.png" alt="" class="h-18 scale-x-[-1] rotate-[6deg] object-contain sm:h-22" />
    <img use:reveal={400} src="/images/watercolor/white.png" alt="" class="h-16 scale-x-[-1] rotate-[-3deg] object-contain sm:h-20" />
  </div>
  <!-- SECTION: SAVE THE DATE + EVENTS — Lake Bottom Strip -->
  <section class="relative overflow-hidden pb-0 pt-20">
    <div class="absolute inset-0 bg-[#fdfcfa]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(201,123,139,0.10),transparent_60%)]"></div>

    <div class="relative z-10 mx-auto max-w-md px-6 pb-40 sm:pb-48">
      <!-- Save the Date heading -->
      <div use:reveal class="mb-10 text-center">
        <h2 class="font-script text-5xl text-[#c97b8b] sm:text-6xl">Save the Date</h2>
        {#if akadDate}
          <p class="mt-3 font-type text-sm text-[#8a8a8a]">
            {akadDate.dayName}, {akadDate.day} {akadDate.monthName} {akadDate.year}
          </p>
        {/if}
      </div>

      <!-- Countdown tiles — 1 big days + 3 small -->
      <div use:reveal={200} class="relative mb-10 flex flex-col items-center gap-4">
        <!-- Flowers behind tiles -->
        <img src="/images/watercolor/flo-3.png" alt="" class="pointer-events-none absolute -left-6 top-1/2 z-0 w-24 -translate-y-1/2 object-contain sm:w-28" />
        <img src="/images/watercolor/flo-5.png" alt="" class="pointer-events-none absolute -right-6 top-1/2 z-0 w-24 -translate-y-1/2 object-contain sm:w-28" />

        <!-- Big days tile -->
        <div class="relative z-10 flex flex-col items-center">
          <div class="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#f0d7dd] shadow-sm sm:h-28 sm:w-28">
            <span class="font-type text-4xl text-[#6b1f1f] sm:text-5xl">{timeLeft.days ?? '--'}</span>
          </div>
          <span class="mt-2 font-type text-xs text-[#8a8a8a] uppercase">Days</span>
        </div>

        <!-- Small hours/minutes/seconds -->
        <div class="flex gap-3">
          {#each ['hours', 'minutes', 'seconds'] as unit}
            <div class="relative z-10 flex flex-col items-center">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0d7dd]/60 shadow-sm sm:h-14 sm:w-14">
                <span class="font-type text-lg text-[#6b1f1f] sm:text-xl">{timeLeft[unit as keyof TimeLeft] ?? '--'}</span>
              </div>
              <span class="mt-1 font-type text-[10px] text-[#8a8a8a] capitalize">{unit}</span>
            </div>
          {/each}
        </div>
      </div>

      <p use:reveal class="mb-16 text-center font-script text-3xl text-[#6b1f1f]">Days to go</p>
      <!-- Akad Nikah -->
      {#if akadEvent}
        <div use:reveal={0} class="mb-10 text-center">
          <h3 class="font-script text-3xl text-[#c97b8b] sm:text-4xl">Akad Nikah</h3>
          {#if akadDate}
            <p class="mt-2 font-type text-sm text-[#4a4a4a]">
              {akadDate.dayName}, {akadDate.day} {akadDate.monthName} {akadDate.year}
            </p>
            <p class="mt-1 font-type text-xs text-[#8a8a8a]">
              at {akadDate.hours}:{akadDate.minutes} WIB - finish
            </p>
          {/if}
          <p class="mt-2 font-type text-xs leading-relaxed text-[#8a8a8a]">
            {akadEvent.location ?? 'Lokasi tidak tersedia'}
          </p>
          {#if akadEvent.locationUrl}
            <a href={akadEvent.locationUrl} target="_blank" rel="noopener noreferrer"
              class="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#c97b8b] px-5 py-2 text-xs text-white shadow-sm transition hover:bg-[#b56a7a]"
            >
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Save the date
            </a>
          {/if}
        </div>
      {/if}

      <!-- Resepsi -->
      {#if receptionEvent}
        <div use:reveal={200} class="mb-10 text-center">
          <h3 class="font-script text-3xl text-[#1e3a5f] sm:text-4xl">Resepsi</h3>
          {#if resepsiDate}
            <p class="mt-2 font-type text-sm text-[#4a4a4a]">
              {resepsiDate.dayName}, {resepsiDate.day} {resepsiDate.monthName} {resepsiDate.year}
            </p>
            <p class="mt-1 font-type text-xs text-[#8a8a8a]">
              at {resepsiDate.hours}:{resepsiDate.minutes} WIB - finish
            </p>
          {/if}
          <p class="mt-2 font-type text-xs leading-relaxed text-[#8a8a8a]">
            {receptionEvent.location ?? 'Lokasi tidak tersedia'}
          </p>
          {#if receptionEvent.locationUrl}
            <a href={receptionEvent.locationUrl} target="_blank" rel="noopener noreferrer"
              class="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#1e3a5f] px-5 py-2 text-xs text-white shadow-sm transition hover:bg-[#152d4a]"
            >
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              See location
            </a>
          {/if}
        </div>
      {/if}


    </div>

    <!-- Lake watercolor bottom strip — fixed height, smooth fade to background -->
    <div class="pointer-events-none absolute bottom-0 z-0 h-40 w-full sm:h-48">
      <!-- Soft fade from background into lake -->
      <div class="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-[linear-gradient(to_bottom,#fdfcfa,transparent)]"></div>
      <img src="/images/watercolor/lake.jpg" alt="" class="h-full w-full object-cover object-bottom" />
    </div>

    <!-- Wildflower stems — slim, small, hugging the lake edge (mixed colors) -->
    <!-- Left side -->
    <img use:reveal={0} src="/images/watercolor/flo-7.png" alt="" class="pointer-events-none absolute bottom-6 left-[-2%] z-10 h-20 rotate-[-8deg] object-contain sm:bottom-8 sm:h-24" />
    <img use:reveal={80} src="/images/watercolor/flo-5.png" alt="" class="pointer-events-none absolute bottom-8 left-[4%] z-10 h-16 rotate-[6deg] scale-x-[-1] object-contain sm:bottom-10 sm:h-20" />
    <img use:reveal={160} src="/images/watercolor/flo-1.png" alt="" class="pointer-events-none absolute bottom-6 left-[10%] z-10 h-14 rotate-[-12deg] object-contain sm:bottom-8 sm:h-16" />

    <!-- Right side -->
    <img use:reveal={100} src="/images/watercolor/flo-4.png" alt="" class="pointer-events-none absolute bottom-6 right-[-2%] z-10 h-20 rotate-[8deg] object-contain sm:bottom-8 sm:h-24" />
    <img use:reveal={180} src="/images/watercolor/flo-6.png" alt="" class="pointer-events-none absolute bottom-8 right-[4%] z-10 h-16 rotate-[-6deg] scale-x-[-1] object-contain sm:bottom-10 sm:h-20" />
    <img use:reveal={260} src="/images/watercolor/flo-1.png" alt="" class="pointer-events-none absolute bottom-6 right-[10%] z-10 h-14 rotate-[12deg] object-contain sm:bottom-8 sm:h-16" />
  </section>
  <!-- SECTION: GALLERY — Polaroid Wall -->
  <section class="relative overflow-hidden py-20">
    <div class="absolute inset-0 bg-[#fdfcfa]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_20%,rgba(201,123,139,0.12),transparent_55%)]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_80%,rgba(30,58,95,0.10),transparent_55%)]"></div>

    <img use:reveal={0} src="/images/watercolor/loose1.png" alt="" class="pointer-events-none absolute top-[5%] left-[-5%] z-0 w-28 rotate-[15deg] object-contain sm:w-36" />
    <img use:reveal={100} src="/images/watercolor/loose2.png" alt="" class="pointer-events-none absolute top-[10%] right-[-3%] z-0 w-20 rotate-[-20deg] scale-x-[-1] object-contain sm:w-24" />
    <img use:reveal={200} src="/images/watercolor/loose3.png" alt="" class="pointer-events-none absolute bottom-[8%] left-[2%] z-0 w-18 rotate-[-10deg] object-contain sm:w-22" />
    <img use:reveal={300} src="/images/watercolor/loose4.png" alt="" class="pointer-events-none absolute bottom-[5%] right-[-4%] z-0 w-24 rotate-[12deg] scale-x-[-1] object-contain sm:w-28" />

    <div class="relative z-10">
      <div use:reveal class="mb-14 text-center">
        <h2 class="font-script text-4xl text-[#1a1a1a] sm:text-5xl">Our Gallery</h2>
        <div class="mx-auto mt-3 h-px w-20 bg-[#c97b8b]/40"></div>
      </div>

      <div class="mx-auto max-w-md px-6">
        <div class="grid grid-cols-2 gap-5 sm:gap-6">
          {#each galleryImages.slice(0, 9) as photo, i}
            {@const rotation = [-2, 1.5, -1, 2, -1.5, 1][i % 6]}
            {@const tape = ['washi-pink', 'washi-kraft', 'washi-navy'][i % 3]}
            {@const isPortrait = i % 3 !== 1}
            {@const colSpan = isPortrait ? 'col-span-1' : 'col-span-2'}
            {@const offsetClass = i % 4 === 1 ? 'sm:mt-8' : i % 4 === 3 ? 'sm:-mt-4' : ''}

            <div use:reveal={i * 120} class="{colSpan} {offsetClass}" style="transform: rotate({rotation}deg)">
              <div class="polaroid">
                <span class="washi {tape}"></span>
                <div class="overflow-hidden rounded-[2px]">
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
  <!-- SECTION: LOVE STORY — Twine Timeline -->
  {#if loveStories.length > 0}
    <section bind:this={storyEl} class="relative overflow-hidden py-20">
      <div class="absolute inset-0 bg-[#fdfcfa]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(201,123,139,0.12),transparent_60%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(30,58,95,0.08),transparent_60%)]"></div>

      <img use:reveal={0} src="/images/watercolor/loose1.png" alt="" class="pointer-events-none absolute top-[5%] left-[2%] z-0 w-20 rotate-[12deg] object-contain sm:w-28" />
      <img use:reveal={100} src="/images/watercolor/loose3.png" alt="" class="pointer-events-none absolute bottom-[10%] right-[3%] z-0 w-18 rotate-[-15deg] object-contain sm:w-24" />
      <img use:reveal={200} src="/images/watercolor/loose2.png" alt="" class="pointer-events-none absolute top-[40%] right-[-2%] z-0 w-16 rotate-[20deg] scale-x-[-1] object-contain sm:w-20" />

      <div class="relative z-10">
        <div use:reveal class="mb-14 text-center">
          <h2 class="font-script text-4xl text-[#6b1f1f] sm:text-5xl">Our Story</h2>
          <div class="mx-auto mt-3 h-px w-20 bg-[#c97b8b]/40"></div>
        </div>

        <div bind:this={storyContainer} class="relative mx-auto max-w-md px-6 {loveStories.length > 4 ? 'pb-4' : ''}">
          <svg class="pointer-events-none absolute top-0 left-1/2 z-0 h-full w-px -translate-x-1/2 overflow-visible">
            <path
              d={storyPathD}
              fill="none"
              stroke="#c97b8b"
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
            {@const dotActive = storyProgress > i / loveStories.length - 0.05}
            <div
              class="relative mb-14 transition-all duration-700 ease-out last:mb-0 {dotActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}"
            >
              <!-- Node bunga dengan ring maroon -->
              <div class="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                <div class="transition-all duration-500 {dotActive ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-[-180deg] opacity-0'}">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <circle cx="15" cy="15" r="14" fill="none" stroke="#6b1f1f" stroke-width="1" opacity="0.5" />
                    <circle cx="15" cy="15" r="4" fill={isLeft ? '#c97b8b' : '#1e3a5f'} />
                    <ellipse cx="15" cy="7" rx="4" ry="7" fill={isLeft ? '#c97b8b' : '#1e3a5f'} transform="rotate(0 15 15)" opacity="0.9" />
                    <ellipse cx="15" cy="7" rx="4" ry="7" fill={isLeft ? '#c97b8b' : '#1e3a5f'} transform="rotate(72 15 15)" opacity="0.9" />
                    <ellipse cx="15" cy="7" rx="4" ry="7" fill={isLeft ? '#c97b8b' : '#1e3a5f'} transform="rotate(144 15 15)" opacity="0.9" />
                    <ellipse cx="15" cy="7" rx="4" ry="7" fill={isLeft ? '#c97b8b' : '#1e3a5f'} transform="rotate(216 15 15)" opacity="0.9" />
                    <ellipse cx="15" cy="7" rx="4" ry="7" fill={isLeft ? '#c97b8b' : '#1e3a5f'} transform="rotate(288 15 15)" opacity="0.9" />
                    <circle cx="15" cy="15" r="2" fill="#fdfcfa" />
                  </svg>
                </div>
              </div>
              <div class="flex items-center">
                {#if isLeft}
                  <div class="flex w-1/2 justify-end pr-4">
                    {#if story.imageUrl}
                      <div class="polaroid mini w-full rotate-1">
                        <img src={story.imageUrl} alt={story.title} class="h-36 w-full rounded-[2px] object-cover" loading="lazy" />
                      </div>
                    {/if}
                  </div>
                  <div class="w-1/2 pl-4">
                    {#if story.date}<p class="font-type text-[11px] tracking-wider text-[#4a6885]">{story.date}</p>{/if}
                    <h4 class="mt-1 font-script text-sm text-[#6b1f1f]">{story.title}</h4>
                    <p class="mt-1 font-type text-xs leading-relaxed text-[#2c3e5a]">{story.description}</p>
                  </div>
                {:else}
                  <div class="w-1/2 pr-4 text-right">
                    {#if story.date}<p class="font-type text-[11px] tracking-wider text-[#4a6885]">{story.date}</p>{/if}
                    <h4 class="mt-1 font-script text-sm text-[#6b1f1f]">{story.title}</h4>
                    <p class="mt-1 font-type text-xs leading-relaxed text-[#2c3e5a]">{story.description}</p>
                  </div>
                  <div class="flex w-1/2 justify-start pl-4">
                    {#if story.imageUrl}
                      <div class="polaroid mini w-full -rotate-1">
                        <img src={story.imageUrl} alt={story.title} class="h-36 w-full rounded-[2px] object-cover" loading="lazy" />
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
  <!-- SECTION: GIFT — Clean Storybook -->
  {#if gifts.length > 0}
    <section class="relative overflow-hidden py-20">
      <div class="absolute inset-0 bg-[#fdfcfa]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,123,139,0.10),transparent_60%)]"></div>

      <img use:reveal={0} src="/images/watercolor/loose1.png" alt="" class="pointer-events-none absolute top-[8%] right-[3%] z-0 w-18 rotate-[-10deg] object-contain sm:w-24" />
      <img use:reveal={100} src="/images/watercolor/loose3.png" alt="" class="pointer-events-none absolute bottom-[10%] left-[2%] z-0 w-16 rotate-[15deg] object-contain sm:w-20" />

      <div class="relative z-10">
        <div use:reveal class="mb-14 text-center">
          <h2 class="font-script text-4xl text-[#1a1a1a] sm:text-5xl">Wedding Gift</h2>
          <div class="mx-auto mt-3 h-px w-20 bg-[#c97b8b]/40"></div>
        </div>

        <div class="mx-auto max-w-md px-5">
          <div use:reveal class="mb-10 text-center">
            <p class="font-type text-sm leading-relaxed text-[#4a4a4a]">
              Doa restu Anda merupakan karunia yang paling berarti.<br />
              Namun apabila berkenan memberikan tanda kasih,<br />
              dapat melalui:
            </p>
          </div>

          <!-- Tabs -->
          <div use:reveal class="mb-8 flex justify-center gap-3">
            {#if bankAccounts.length > 0}
              <button
                on:click={() => (giftTab = 'transfer')}
                class="rounded-full px-5 py-2 text-xs font-type transition {giftTab === 'transfer' ? 'bg-[#c97b8b] text-white shadow-sm' : 'border border-[#ddd2bd] text-[#8a8a8a] hover:border-[#c97b8b] hover:text-[#c97b8b]' }"
              >Transfer</button>
            {/if}
            {#if physicalGifts.length > 0}
              <button
                on:click={() => (giftTab = 'fisik')}
                class="rounded-full px-5 py-2 text-xs font-type transition {giftTab === 'fisik' ? 'bg-[#c97b8b] text-white shadow-sm' : 'border border-[#ddd2bd] text-[#8a8a8a] hover:border-[#c97b8b] hover:text-[#c97b8b]' }"
              >Kado Fisik</button>
            {/if}
          </div>

          {#if giftTab === 'transfer'}
            <div class="space-y-5">
              {#each bankAccounts as acc, i}
                {@const rotation = [1.5, -1, 2, -1.5, 0.5][i % 5]}
                <div use:reveal={i * 100} class="rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]" style="transform: rotate({rotation}deg)">
                  <p class="mb-1 text-center font-type text-xs tracking-wider text-[#8a8a8a] uppercase">Transfer to</p>
                  <p class="text-center font-love text-lg text-[#1a1a1a]">{acc.name}</p>
                  <div class="my-3 flex items-center justify-center gap-2">
                    <span class="font-mono text-2xl tracking-wider text-[#1a1a1a]">{acc.accountNumber}</span>
                  </div>
                  <p class="text-center text-sm text-[#8a8a8a]">a.n. {acc.accountHolder}</p>
                  <div class="mt-4 flex justify-center">
                    <button on:click={() => copyToClipboard(acc.accountNumber ?? '')} class="rounded-full bg-[#6b1f1f] px-5 py-2 text-xs text-white shadow-sm transition hover:bg-[#571818]">
                      <span class="flex items-center gap-1.5">
                        <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Salin
                      </span>
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
          {#if giftTab === 'fisik'}
            <div class="space-y-5">
              {#each physicalGifts as pg, i}
                <div use:reveal={i * 100} class="rounded-xl border-2 border-dashed border-[#c97b8b]/30 bg-[#fdfcfa] p-5">
                  <div class="flex items-center gap-2 border-b border-dashed border-[#c97b8b]/20 pb-3">
                    <div class="rounded-full bg-[#c97b8b]/10 p-1.5">
                      <svg class="h-4 w-4 text-[#c97b8b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p class="text-xs font-medium uppercase tracking-wider text-[#c97b8b]">{pg.name ?? 'Kirim ke Alamat'}</p>
                  </div>
                  <p class="mt-3 text-center text-sm leading-relaxed text-[#4a4a4a]" style="white-space:pre-line">{pg.description}</p>
                </div>
              {/each}
            </div>
          {/if}


        </div>
      </div>
    </section>
  {/if}
  <!-- SECTION: RSVP & WISHES — Storybook Notebook -->
  <section class="relative overflow-hidden py-20">
    <div class="absolute inset-0 bg-[#fdfcfa]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(201,123,139,0.10),transparent_60%)]"></div>

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

          <div class="botanical-notebook">
            <div class="spiral-binding"></div>
            <div class="notebook-paper">
              <div class="mb-6 text-center">
                <p class="font-type text-sm text-[#8a8a8a]">Mohon konfirmasi kehadiran Anda</p>
              </div>

              <div class="space-y-1">
                <div class="notebook-field">
                  <div class="botanical-icon">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <div class="flex-1">
                    <label for="meadow-rsvp-name" class="notebook-label">Nama Lengkap</label>
                    <input id="meadow-rsvp-name" type="text" bind:value={rsvpName} placeholder="Tulis nama Anda..." class="notebook-input" />
                  </div>
                </div>
                <div class="notebook-field">
                  <div class="botanical-icon">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div class="flex-1">
                    <p class="notebook-label">Konfirmasi Kehadiran</p>
                    <div class="flex gap-3 pt-1">
                      <button type="button" on:click={() => (rsvpPresence = 'hadir')} class="notebook-checkbox {rsvpPresence === 'hadir' ? 'notebook-checkbox-checked' : ''}">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Hadir
                      </button>
                      <button type="button" on:click={() => (rsvpPresence = 'tidak')} class="notebook-checkbox {rsvpPresence === 'tidak' ? 'notebook-checkbox-checked-navy' : ''}">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        Tidak Hadir
                      </button>
                    </div>
                  </div>
                </div>

                <div class="notebook-field">
                  <div class="botanical-icon">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  </div>
                  <div class="flex-1">
                    <label for="meadow-rsvp-msg" class="notebook-label">Ucapan &amp; Doa</label>
                    <textarea id="meadow-rsvp-msg" bind:value={rsvpMessage} rows="3" placeholder="Tulis doa terbaik Anda..." class="notebook-textarea"></textarea>
                  </div>
                </div>
              </div>
              {#if rsvpError}<p class="mt-3 text-xs text-red-400">{rsvpError}</p>{/if}
              {#if rsvpSubmitted}<p class="mt-3 text-xs text-[#c97b8b]">Terima kasih, konfirmasi terkirim!</p>{/if}

              <div class="mt-8 flex justify-center">
                <button type="button" on:click={handleSubmitRsvp} disabled={rsvpSubmitting} class="botanical-btn">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  {rsvpSubmitting ? 'Mengirim...' : 'Kirim'}
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Wishes display -->
        <div use:reveal>
          <div class="mb-10 text-center">
            <h2 class="font-script text-3xl text-[#1a1a1a] sm:text-4xl">Ucapan &amp; Doa</h2>
            <div class="mx-auto mt-3 h-px w-20 bg-[#c97b8b]/40"></div>
          </div>

          <p class="mb-6 text-center font-type text-xs text-[#8a8a8a]">Doa dan harapan terbaik dari keluarga dan sahabat</p>

          <div class="space-y-4">
            {#each pagedWishes as r, i (r.id)}
              {@const rotations = [-1, 0.5, -0.5, 1, -0.8, 0.3]}
              {@const bgColors = ['bg-[#fef9e7]', 'bg-[#fdfcfa]', 'bg-[#fdf2f4]']}
              {@const pinColors = ['bg-[#8b6f4e]', 'bg-[#6b1f1f]', 'bg-[#1e3a5f]']}
              <div class="sticky-note {bgColors[i % bgColors.length]}" style="transform: rotate({rotations[i % rotations.length]}deg)">
                <div class="absolute -top-1.5 left-1/2 -translate-x-1/2">
                  <span class="block h-3.5 w-3.5 rounded-full {pinColors[i % pinColors.length]} shadow-[0_1px_3px_rgba(0,0,0,0.35)] ring-1 ring-black/10"></span>
                </div>
                <div class="relative pt-1">
                  <div class="flex items-start gap-3">
                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1e3a5f]/8">
                      <span class="font-script text-sm text-[#1e3a5f]">{r.name.charAt(0)}</span>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-[#1a1a1a]">{r.name}</p>
                      {#if r.message}<p class="mt-1 text-sm leading-relaxed text-[#4a4a4a]">{r.message}</p>{/if}
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
            <button class="botanical-btn mx-auto mt-6 block" on:click={() => (wishesPage += 1)}>Tampilkan lebih banyak</button>
          {/if}
        </div>
      </div>
    </div>
  </section>
  <!-- SECTION: CLOSING — Meadow Finale -->
  <section class="relative overflow-hidden py-20">
    <div class="absolute inset-0 bg-[#fdfcfa]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,123,139,0.08),transparent_60%)]"></div>

    <div class="relative z-20 mx-auto max-w-sm px-6 text-center">
      <div use:reveal>
        <p class="font-type text-sm leading-relaxed text-[#4a4a4a]">
          Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak / Ibu / Saudara / i
          berkenan hadir dan memberikan doa restu.
        </p>
        <p class="mt-6 mb-10 font-type text-sm text-[#8a8a8a] italic">
          {closingMessage || 'Atas kehadiran dan doa restunya, kami ucapkan terima kasih.'}
        </p>

        <div class="space-y-1">
          <p class="font-script text-5xl text-[#c97b8b]" style={brideNameStyle}>{brideFirstName}</p>
          <p class="font-script text-3xl text-[#6b1f1f]">&amp;</p>
          <p class="font-script text-5xl text-[#1e3a5f]" style={groomNameStyle}>{groomFirstName}</p>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="relative z-20 mt-12 flex items-center justify-center gap-4">
      <div class="h-px w-16 border-t border-dashed border-[#c97b8b]/30"></div>
      <svg class="h-5 w-5 text-[#c97b8b]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
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
  .meadow-main {
    font-family:
      'Segoe UI',
      system-ui,
      -apple-system,
      sans-serif;
    background-color: #fdfcfa;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  }

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
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .float-gentle {
    animation: gentleFloat var(--float-dur, 4s) ease-in-out infinite;
    animation-delay: var(--float-del, 0s);
  }
  @keyframes gentleFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-16px); }
  }

  /* Sticker photo frame — organic die-cut look */
  .sticker {
    position: relative;
    padding: 10px;
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    background: white;
    border: 1px solid #e5e0d8;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.06),
      0 8px 24px rgba(0, 0, 0, 0.12);
  }

  /* Polaroid + washi tape */
  .polaroid {
    position: relative;
    background: #fdfbf7;
    padding: 8px 8px 26px;
    border-radius: 2px;
    border: 1px solid #e5e0d8;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.08),
      0 6px 18px rgba(0, 0, 0, 0.10);
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
    background: repeating-linear-gradient(45deg, rgba(201, 123, 139, 0.55) 0 6px, rgba(201, 123, 139, 0.35) 6px 12px);
  }
  .washi-navy {
    background: repeating-linear-gradient(45deg, rgba(30, 58, 95, 0.45) 0 6px, rgba(30, 58, 95, 0.28) 6px 12px);
  }
  .washi-kraft {
    background: repeating-linear-gradient(45deg, rgba(160, 128, 96, 0.5) 0 6px, rgba(160, 128, 96, 0.32) 6px 12px);
  }
  /* Notebook RSVP */
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
  .sticky-note {
    position: relative;
    padding: 16px;
    border-radius: 2px;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.06),
      0 3px 6px rgba(0, 0, 0, 0.04);
  }
</style>
