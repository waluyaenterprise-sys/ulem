<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import Credit from '$lib/Credit.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const WA_NUMBER = '628981219376';
  const WA_MESSAGE = encodeURIComponent(
    'Halo, saya ingin memesan undangan digital dari Ulem. Boleh info lebih lanjut?'
  );
  const waLink = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

  let scrolled = $state(false);
  let menuOpen = $state(false);
  let openFaq = $state<number | null>(0);
  let preview = $state<{ slug: string; name: string } | null>(null);

  $effect(() => {
    if (!preview) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') preview = null;
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  });

  onMount(() => {
    const onScroll = () => (scrolled = window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  function reveal(node: HTMLElement, { delay = 0, y = 30 } = {}) {
    node.style.opacity = '0';
    node.style.transform = `translateY(${y}px)`;
    node.style.transition = `opacity 0.9s ease ${delay}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'translateY(0)';
          io.unobserve(node);
        }
      },
      { threshold: 0.1 }
    );
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }

  const features = [
    {
      icon: 'gems',
      title: 'Desain Elegan',
      desc: 'Puluhan template premium yang dirancang khusus untuk undangan pernikahan.'
    },
    {
      icon: 'music',
      title: 'Musik Latar',
      desc: 'Tambahkan lagu favorit kalian sebagai pengiring saat tamu membuka undangan.'
    },
    {
      icon: 'rsvp',
      title: 'RSVP Online',
      desc: 'Tamu dapat mengkonfirmasi kehadiran langsung dari undangan digital.'
    },
    {
      icon: 'share',
      title: 'Mudah Dibagikan',
      desc: 'Cukup kirim tautan — bisa lewat WhatsApp, Instagram, atau media sosial lainnya.'
    }
  ];

  const stats = [
    { value: '21+', label: 'Template Premium' },
    { value: '1000+', label: 'Undangan Terkirim' },
    { value: '500+', label: 'Pasangan Bahagia' },
    { value: '4.9/5', label: 'Rating Kepuasan' }
  ];

  const testimonials = [
    {
      initials: '✦',
      name: 'Desain Eksklusif',
      detail: 'Template Premium',
      quote:
        'Desain template yang elegan dan modern bikin undangan kamu tampil beda dari yang lain. Setiap detail dirancang untuk kesan mewah.'
    },
    {
      initials: '⚡',
      name: 'Proses Cepat',
      detail: 'Langsung Jadi',
      quote:
        'Tinggal isi data pernikahan, undangan langsung siap dibagikan ke ratusan tamu. Nggak perlu tunggu lama.'
    },
    {
      initials: '♫',
      name: 'Fitur Lengkap',
      detail: 'Musik & RSVP',
      quote:
        'Fitur RSVP online memudahkan kamu memantau konfirmasi kehadiran tamu secara real-time. Plus musik latar yang bisa disesuaikan.'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Isi Data',
      desc: 'Akses halaman pembuatan undangan dan lengkapi detail pernikahan kamu.'
    },
    {
      step: '02',
      title: 'Pilih Template',
      desc: 'Pilih desain favorit, atur musik, dan lihat preview sebelum dipublikasikan.'
    },
    {
      step: '03',
      title: 'Bagikan ke Tamu',
      desc: 'Salin tautan undangan dan bagikan ke seluruh tamu lewat WhatsApp atau media sosial.'
    }
  ];

  const faqs = [
    {
      q: 'Bagaimana cara membuat undangan di Ulem?',
      a: 'Cukup klik "Buat Undangan", isi data pernikahan, pilih template, dan undangan siap. Seluruh proses bisa dilakukan tanpa instalasi aplikasi.'
    },
    {
      q: 'Apakah saya bisa mengedit undangan setelah dibuat?',
      a: 'Bisa. Setiap undangan memiliki halaman khusus untuk mengubah data, foto, musik, hingga tanggal acara — kapan pun kamu butuhkan.'
    },
    {
      q: 'Fitur apa saja yang termasuk?',
      a: 'Template premium, musik latar, RSVP online real-time, galeri foto, peta lokasi, hadiah/transfer, hingga ucapan tamu.'
    },
    {
      q: 'Berapa lama proses pembuatan undangan?',
      a: 'Tergantung kelengkapan data. Umumnya undangan siap dibagikan dalam hitungan menit setelah data dan foto diunggah.'
    },
    {
      q: 'Bagaimana cara membagikan undangan ke tamu?',
      a: 'Setiap undangan punya tautan unik yang bisa dibagikan lewat WhatsApp, Instagram, email, atau media sosial lainnya. Tautan juga bisa dipasang di bio.'
    }
  ];

  const templateCovers: Record<
    string,
    { from: string; to: string; accent: string; script?: boolean; tag: string; light?: boolean }
  > = {
    aurum: { from: '#0a0804', to: '#241b0a', accent: '#c9a84c', script: true, tag: 'Mewah' },
    carte: { from: '#2a1010', to: '#6b1414', accent: '#b8962e', script: true, tag: 'Klasik' },
    chronicle: { from: '#1c2a4f', to: '#2c3e6b', accent: '#c4754a', tag: 'Sagrada' },
    frame: { from: '#f5efe4', to: '#e6d7c2', accent: '#a9834a', tag: 'Frame', light: true },
    hana: {
      from: '#d4a0a0',
      to: '#8fa89c',
      accent: '#5f5144',
      script: true,
      tag: 'Floral',
      light: true
    },
    lens: { from: '#3f4752', to: '#6b7280', accent: '#F0A269', tag: 'Editorial' },
    lumiere: {
      from: '#faf6ef',
      to: '#e6d5bd',
      accent: '#a9834a',
      script: true,
      tag: 'Lux',
      light: true
    },
    minimalist: { from: '#f4f4f4', to: '#ffffff', accent: '#e07a3f', tag: 'Modern', light: true },
    reel: { from: '#7a6848', to: '#c9933a', accent: '#f5e6c8', tag: 'Film' },
    scroll: { from: '#3E2A10', to: '#8B6914', accent: '#d9b95c', script: true, tag: 'Antik' },
    velvet: { from: '#1c0f0a', to: '#3d2210', accent: '#c9a84c', script: true, tag: 'Velvet' },
    voyage: { from: '#8a6a1c', to: '#c9a84c', accent: '#e8d4a0', script: true, tag: 'Mewah' }
  };

  const defaultCover = {
    from: '#14100c',
    to: '#3a2c16',
    accent: '#c9a84c',
    script: true,
    tag: 'Premium'
  };

  function coverFor(slug: string) {
    return templateCovers[slug] ?? defaultCover;
  }

  function previewImageFor(slug: string) {
    const normalized = slug.toLowerCase();
    const preset = {
      aurum: '/images/default/cover.png',
      carte: '/images/default/couple-11.jpeg',
      chronicle: '/images/default/couple-12.jpeg',
      frame: '/images/default/couple-13.jpeg',
      hana: '/images/default/couple-14.jpeg',
      lumiere: '/images/default/couple-15.jpeg',
      minimalist: '/images/default/couple-16.jpeg',
      reel: '/images/default/couple-17.jpeg',
      scroll: '/images/default/couple-18.jpeg',
      velvet: '/images/default/couple-19.jpeg',
      voyage: '/images/default/couple-20.jpeg',
      elegant: '/images/default/couple-21.jpeg',
      floral: '/images/floral/floral-top-new.png',
      floris: '/images/floral/floral-top-new.png',
      sunda: '/images/default/panorama.png',
      earth: '/images/earth/earth.png',
      fire: '/images/default/couple-3.jpeg',
      ocean: '/images/default/couple-2.jpeg',
      sky: '/images/default/couple-1.jpeg',
      garden: '/images/default/couple-4.jpeg',
      meadow: '/images/default/couple-5.jpeg',
      rustic: '/images/default/couple-6.jpeg',
      creamy: '/images/default/couple-7.jpeg',
      deck: '/images/default/couple-8.jpeg'
    } as Record<string, string>;

    return preset[normalized] ?? '/images/default/cover.png';
  }
</script>

{#snippet SectionHead(props: { eyebrow: string; title: string; subtitle?: string; dark?: boolean })}
  <div use:reveal class="text-center">
    <div class="mb-4 inline-flex items-center gap-3">
      <span class="h-px w-8 bg-gold/70"></span>
      <p class="font-body text-xs font-medium tracking-[0.35em] text-gold uppercase">
        {props.eyebrow}
      </p>
      <span class="h-px w-8 bg-gold/70"></span>
    </div>
    <h2
      class="font-heading text-3xl font-semibold md:text-4xl {props.dark
        ? 'text-cream'
        : 'text-ink'}"
    >
      {props.title}
    </h2>
    {#if props.subtitle}
      <p
        class="mx-auto mt-4 max-w-md font-body text-sm leading-relaxed {props.dark
          ? 'text-cream/50'
          : 'text-stone-500'}"
      >
        {props.subtitle}
      </p>
    {/if}
  </div>
{/snippet}

{#snippet FeatureIcon(name: string)}
  {#if name === 'gems'}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M6 3h12l4 6-10 13L2 9l4-6Z" />
      <path d="M11 3 8 9l4 13 4-13-3-6" />
      <path d="M2 9h20" />
    </svg>
  {:else if name === 'music'}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  {:else if name === 'rsvp'}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  {:else if name === 'share'}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  {/if}
{/snippet}

<main class="landing-page min-h-screen bg-white text-ink">
  <!-- ── NAV ────────────────────────────────────────────────────────────── -->
  <nav
    class:scrolled
    class="fixed inset-x-0 top-0 z-50 transition-all duration-300 {scrolled
      ? 'border-b border-stone-200/80 bg-white/95 shadow-sm shadow-stone-900/5 backdrop-blur-md'
      : 'bg-white/75 backdrop-blur-sm'}"
  >
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <a href="#top" class="font-script text-3xl text-gold" aria-label="Ulem — kembali ke atas"
        >ulem</a
      >

      <div class="hidden items-center gap-8 md:flex">
        <a href="#templates" class="font-body text-sm text-stone-600 transition hover:text-gold"
          >Template</a
        >
        <a href="#keunggulan" class="font-body text-sm text-stone-600 transition hover:text-gold"
          >Keunggulan</a
        >
        <a href="#faq" class="font-body text-sm text-stone-600 transition hover:text-gold">FAQ</a>
      </div>

      <div class="flex items-center gap-3">
        <a
          href="/create-wedding"
          class="hidden rounded-full bg-gold px-6 py-2.5 font-body text-sm font-semibold text-ink shadow-md shadow-gold/20 transition hover:bg-gold-soft md:inline-flex"
        >
          Buat Undangan
        </a>
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-ink md:hidden"
          aria-label="Buka menu navigasi"
          aria-expanded={menuOpen}
          onclick={() => (menuOpen = !menuOpen)}
        >
          {#if menuOpen}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          {/if}
        </button>
      </div>
    </div>

    {#if menuOpen}
      <div class="border-t border-stone-200 bg-white/95 backdrop-blur-md md:hidden">
        <div class="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
          <a
            href="#templates"
            class="rounded-lg px-3 py-3 font-body text-sm text-stone-600 transition hover:bg-stone-50 hover:text-gold"
            onclick={() => (menuOpen = false)}>Template</a
          >
          <a
            href="#keunggulan"
            class="rounded-lg px-3 py-3 font-body text-sm text-stone-600 transition hover:bg-stone-50 hover:text-gold"
            onclick={() => (menuOpen = false)}>Keunggulan</a
          >
          <a
            href="#faq"
            class="rounded-lg px-3 py-3 font-body text-sm text-stone-600 transition hover:bg-stone-50 hover:text-gold"
            onclick={() => (menuOpen = false)}>FAQ</a
          >
          <a
            href="/create-wedding"
            class="mt-2 rounded-full bg-gold px-6 py-3 text-center font-body text-sm font-semibold text-ink"
            onclick={() => (menuOpen = false)}>Buat Undangan</a
          >
        </div>
      </div>
    {/if}
  </nav>

  <!-- ── HERO ───────────────────────────────────────────────────────────── -->
  <header id="top" class="relative overflow-hidden bg-[#fffdf9] text-ink">
    <div
      class="pointer-events-none absolute inset-0"
      style="background-image: radial-gradient(circle, rgba(201,168,76,0.12) 1px, transparent 1px); background-size: 30px 30px;"
    ></div>
    <img
      src="/images/watercolor/flo-3.png"
      alt=""
      class="jelly pointer-events-none absolute top-24 -left-10 hidden w-40 opacity-20 md:block"
    />
    <img
      src="/images/watercolor/loose1.png"
      alt=""
      class="jelly pointer-events-none absolute -right-8 bottom-12 hidden w-44 opacity-15 delay-1 lg:block"
    />

    <div class="relative mx-auto max-w-6xl px-6 pt-32 pb-20 md:pt-40 md:pb-24">
      <div class="flex flex-col items-center gap-14 lg:flex-row lg:gap-16">
        <!-- Text -->
        <div class="flex-1 text-center lg:text-left">
          <div use:reveal>
            <div class="inline-flex items-center gap-3">
              <span class="h-px w-8 bg-gold/60"></span>
              <p class="font-body text-xs font-medium tracking-[0.4em] text-gold uppercase">
                Undangan Pernikahan Digital
              </p>
              <span class="h-px w-8 bg-gold/60"></span>
            </div>
          </div>
          <div use:reveal={{ delay: 100 }}>
            <h1
              class="mt-6 font-heading text-5xl leading-[1.05] font-medium tracking-tight md:text-6xl lg:text-7xl"
            >
              Ceritakan <span class="font-script text-gold">Kisah Cinta</span>
              <br />
              Kalian
            </h1>
          </div>
          <div use:reveal={{ delay: 200 }}>
            <p
              class="mx-auto mt-6 max-w-md font-body text-base leading-relaxed text-stone-600 lg:mx-0"
            >
              Undangan digital yang indah, personal, dan mudah dibagikan ke seluruh tamu undangan.
            </p>
          </div>
          <div
            use:reveal={{ delay: 300 }}
            class="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <a
              href="/create-wedding"
              class="group inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-body text-sm font-semibold text-ink shadow-lg shadow-gold/25 transition hover:bg-gold-soft"
            >
              Buat Undangan
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#templates"
              class="rounded-full border border-stone-300 px-8 py-3.5 font-body text-sm font-semibold text-ink transition hover:border-gold/60 hover:text-gold"
            >
              Lihat Template
            </a>
          </div>
        </div>

        <!-- Hero image -->
        <div use:reveal={{ delay: 150, y: 40 }} class="w-full max-w-lg flex-1 lg:max-w-none">
          <div class="relative mx-auto max-w-xl">
            <div class="absolute -inset-3 rounded-[30px] border border-gold/40"></div>
            <div class="absolute -inset-1.5 rounded-[24px] border border-gold/20"></div>
            <div
              class="relative aspect-video overflow-hidden rounded-3xl shadow-xl shadow-stone-900/15"
            >
              <img
                src="/images/hero-banner.png"
                alt="Ulem undangan preview"
                class="h-full w-full object-cover"
              />
              <div
                class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"
              ></div>
            </div>
            <div
              class="absolute -bottom-4 -left-4 rounded-full bg-white px-5 py-2.5 shadow-lg ring-1 ring-gold/40"
            >
              <p class="font-script text-xl text-gold">Selamat Datang</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- ── STATS ──────────────────────────────────────────────────────────── -->
  <section class="relative bg-white px-6 pb-20">
    <div class="mx-auto max-w-6xl">
      <div
        use:reveal
        class="grid grid-cols-2 gap-y-10 border-y border-gold/25 py-12 lg:grid-cols-4"
      >
        {#each stats as s}
          <div class="text-center">
            <p class="font-heading text-4xl font-semibold text-gold md:text-5xl">{s.value}</p>
            <p class="mt-2 font-body text-xs tracking-widest text-stone-500 uppercase">{s.label}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ── FEATURES ───────────────────────────────────────────────────────── -->
  <section id="keunggulan" class="relative bg-[#faf9f6] px-6 py-24">
    <div class="mx-auto max-w-5xl">
      {@render SectionHead({
        eyebrow: 'Kenapa Ulem?',
        title: 'Semua yang kamu butuhkan',
        subtitle: 'Setiap detail dirancang untuk menghadirkan undangan yang berkesan.'
      })}
      <div class="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {#each features as f, i}
          <div
            use:reveal={{ delay: i * 80 }}
            class="group rounded-3xl bg-white p-7 shadow-sm ring-1 ring-gold/15 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/10 hover:ring-gold/40"
          >
            <div
              class="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-ink text-gold ring-1 ring-gold/25 transition group-hover:bg-gold group-hover:text-ink"
            >
              {@render FeatureIcon(f.icon)}
            </div>
            <h3 class="mb-2 font-heading text-lg font-semibold text-ink">{f.title}</h3>
            <p class="font-body text-sm leading-relaxed text-stone-500">{f.desc}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ── TEMPLATES GRID ─────────────────────────────────────────────────── -->
  <section id="templates" class="relative overflow-hidden bg-[#faf9f6] px-6 py-24">
    <div
      class="pointer-events-none absolute inset-0"
      style="background-image: radial-gradient(circle, rgba(201,168,76,0.11) 1px, transparent 1px); background-size: 30px 30px;"
    ></div>
    <div class="relative mx-auto max-w-6xl">
      {@render SectionHead({
        eyebrow: 'Koleksi Template',
        title: 'Pilih Template Favoritmu',
        subtitle: 'Setiap template dirancang dengan penuh detail. Klik untuk melihat demo lengkap.',
        dark: false
      })}

      {#if data.templates.length === 0}
        <p class="mt-12 text-center font-body text-sm text-stone-500">
          Template tidak tersedia saat ini.
        </p>
      {:else}
        <div class="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {#each data.templates as t, i}
            {@const c = coverFor(t.slug)}
            <button
              type="button"
              onclick={() => (preview = { slug: t.slug, name: t.name })}
              use:reveal={{ delay: i * 40, y: 20 }}
              aria-haspopup="dialog"
              aria-expanded={preview?.slug === t.slug}
              aria-label={`Lihat preview template ${t.name}`}
              class="group flex w-full flex-col overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 shadow-stone-900/5 ring-stone-200 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/10 hover:ring-gold/50"
            >
              <div class="relative aspect-9/16 overflow-hidden">
                <div
                  class="absolute inset-0"
                  style="background: linear-gradient(160deg, {c.from} 0%, {c.to} 100%);"
                ></div>
                <div
                  class="absolute inset-0 opacity-20"
                  style="background-image: radial-gradient(circle, {c.accent} 1px, transparent 1px); background-size: 20px 20px;"
                ></div>
                {#if t.imageUrl}
                  <img
                    src={t.imageUrl}
                    alt={t.name}
                    loading="lazy"
                    class="relative h-full w-full object-cover"
                  />
                {:else}
                  <img
                    src={previewImageFor(t.slug)}
                    alt={t.name}
                    loading="lazy"
                    class="relative h-full w-full object-cover opacity-90 transition group-hover:scale-105"
                  />
                {/if}

                {#if !t.imageUrl}
                  <div
                    class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
                  ></div>
                  <div
                    class="relative flex h-full flex-col items-center justify-center gap-2.5 px-4 text-center"
                  >
                    <span
                      class="font-body text-[9px] font-medium tracking-[0.35em] uppercase"
                      style="color: {c.accent};"
                    >
                      Digital Invitation
                    </span>
                    <span
                      class="{c.script ? 'font-script' : 'font-heading'} leading-none"
                      style="color: {c.accent}; font-size: 3.4rem;"
                    >
                      {t.name.charAt(0)}
                    </span>
                    <div class="flex items-center gap-2">
                      <span class="h-px w-6" style="background: {c.accent};"></span>
                      <span class="h-1 w-1 rotate-45" style="background: {c.accent};"></span>
                      <span class="h-px w-6" style="background: {c.accent};"></span>
                    </div>
                    <span
                      class="font-body text-[9px] tracking-[0.3em] uppercase"
                      style="color: {c.accent};"
                    >
                      {c.tag}
                    </span>
                  </div>
                {/if}
                <div
                  class="pointer-events-none absolute inset-3 rounded-xl border"
                  style="border-color: {c.accent}55;"
                ></div>
                <div
                  class="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/15"
                ></div>
                <div
                  class="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100"
                >
                  <span
                    class="rounded-full bg-gold px-5 py-2 font-body text-xs font-semibold tracking-widest text-ink uppercase shadow-lg"
                  >
                    Lihat Demo
                  </span>
                </div>
              </div>
              <div class="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p class="font-heading text-sm font-semibold text-ink">{t.name}</p>
                  {#if t.tag}
                    <p class="font-body text-xs text-stone-500">{t.tag}</p>
                  {/if}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </section>

  <!-- ── TESTIMONIALS ───────────────────────────────────────────────────── -->
  <section id="testimoni" class="relative overflow-hidden bg-white px-6 py-24">
    <img
      src="/images/watercolor/flo-1.png"
      alt=""
      class="jelly pointer-events-none absolute top-8 -right-12 hidden w-36 opacity-15 delay-2 lg:block"
    />
    <div class="relative mx-auto max-w-5xl">
      {@render SectionHead({
        eyebrow: 'Keunggulan',
        title: 'Kenapa Pasangan Memilih Ulem',
        subtitle: 'Berikut keunggulan yang bisa kamu nikmati.',
        dark: false
      })}
      <div class="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {#each testimonials as t, i}
          <div
            use:reveal={{ delay: i * 100 }}
            class="flex flex-col rounded-3xl bg-[#faf9f6] p-7 ring-1 ring-stone-200 transition duration-300 hover:ring-gold/40"
          >
            <div class="mb-4 flex gap-0.5 text-gold">
              {#each Array(5) as _}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              {/each}
            </div>
            <p class="mb-5 flex-1 font-body text-sm leading-relaxed text-stone-600 italic">
              "{t.quote}"
            </p>
            <div class="flex items-center gap-3 border-t border-stone-200 pt-5">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-sm font-semibold text-gold ring-1 ring-gold/30"
              >
                {t.initials}
              </div>
              <div>
                <p class="font-heading text-sm font-semibold text-ink">{t.name}</p>
                <p class="font-body text-xs text-stone-500">{t.detail}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ── HOW IT WORKS ───────────────────────────────────────────────────── -->
  <section id="cara-kerja" class="bg-white px-6 py-24">
    <div class="mx-auto max-w-3xl">
      {@render SectionHead({
        eyebrow: 'Cara Kerja',
        title: 'Simpel dan Cepat'
      })}
      <div class="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
        {#each steps as s, i}
          <div use:reveal={{ delay: i * 120 }} class="flex flex-col items-center text-center">
            <div class="relative mb-5">
              <span class="font-heading text-5xl font-semibold text-gold/25">{s.step}</span>
              <span class="absolute inset-x-0 -bottom-2 mx-auto h-px w-10 bg-gold/50"></span>
            </div>
            <h3 class="mb-2 font-heading text-lg font-semibold text-ink">{s.title}</h3>
            <p class="font-body text-sm leading-relaxed text-stone-500">{s.desc}</p>
          </div>
        {/each}
      </div>
      <div use:reveal={{ delay: 350 }} class="mt-12 text-center">
        <a
          href="/create-wedding"
          class="group inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 font-body text-sm font-semibold text-cream shadow-lg shadow-black/20 transition hover:bg-ink-soft"
        >
          Mulai Sekarang
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-gold transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0-5 5m5-5H6" />
          </svg>
        </a>
      </div>
    </div>
  </section>

  <!-- ── FAQ ────────────────────────────────────────────────────────────── -->
  <section id="faq" class="bg-[#faf9f6] px-6 py-24">
    <div class="mx-auto max-w-3xl">
      {@render SectionHead({
        eyebrow: 'FAQ',
        title: 'Pertanyaan yang Sering Diajukan',
        subtitle: 'Masih ragu? Jangan sungkan untuk menghubungi kami.'
      })}
      <div class="mt-12 space-y-4">
        {#each faqs as f, i}
          <div
            use:reveal={{ delay: i * 60 }}
            class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gold/15 transition hover:ring-gold/40"
          >
            <button
              type="button"
              class="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={openFaq === i}
              aria-controls={`faq-panel-${i}`}
              onclick={() => (openFaq = openFaq === i ? null : i)}
            >
              <span class="font-heading text-base font-semibold text-ink">{f.q}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 shrink-0 text-gold transition-transform duration-300 {openFaq === i
                  ? 'rotate-45'
                  : ''}"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            {#if openFaq === i}
              <div id={`faq-panel-${i}`} class="px-6 pb-5">
                <p class="font-body text-sm leading-relaxed text-stone-600">{f.a}</p>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ── CTA / CONTACT ──────────────────────────────────────────────────── -->
  <section class="relative overflow-hidden bg-[#fffdf9] px-6 py-28 text-center">
    <div
      class="pointer-events-none absolute inset-0"
      style="background-image: radial-gradient(circle, rgba(201,168,76,0.12) 1px, transparent 1px); background-size: 30px 30px;"
    ></div>
    <img
      src="/images/watercolor/bunch2.png"
      alt=""
      class="jelly pointer-events-none absolute bottom-4 -left-8 hidden w-40 opacity-15 delay-2 lg:block"
    />
    <img
      src="/images/watercolor/flo-6.png"
      alt=""
      class="jelly pointer-events-none absolute top-8 -right-10 hidden w-36 opacity-15 delay-1 lg:block"
    />

    <div class="relative mx-auto max-w-2xl">
      <div use:reveal>
        <p class="font-script text-4xl text-gold md:text-5xl">Siap Membuat Undangan?</p>
      </div>
      <div use:reveal={{ delay: 100 }}>
        <p class="mx-auto mt-4 max-w-lg font-body text-base leading-relaxed text-stone-600">
          Mulai sekarang — isi data pernikahan dan undangan eleganmu langsung siap dibagikan ke
          seluruh tamu.
        </p>
      </div>
      <div
        use:reveal={{ delay: 200 }}
        class="mt-9 flex flex-wrap items-center justify-center gap-3"
      >
        <a
          href="/create-wedding"
          class="group inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 font-body text-base font-semibold text-ink shadow-lg shadow-gold/25 transition hover:bg-gold-soft"
        >
          Buat Undangan
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0-5 5m5-5H6" />
          </svg>
        </a>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-3 rounded-full border border-stone-300 px-8 py-4 font-body text-base font-semibold text-ink transition hover:border-gold/60 hover:text-gold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
            />
          </svg>
          Chat WhatsApp
        </a>
      </div>
      <p class="mt-6 font-body text-xs tracking-wide text-stone-500">
        Senin – Sabtu · 08.00 – 21.00 WIB
      </p>
    </div>
  </section>

  <!-- ── FOOTER ─────────────────────────────────────────────────────────── -->
  <footer class="border-t border-stone-200 bg-white px-6 py-16">
    <div class="mx-auto max-w-6xl">
      <div class="grid grid-cols-1 gap-10 md:grid-cols-4">
        <div class="md:col-span-2">
          <p class="font-script text-3xl text-gold">ulem</p>
          <p class="mt-3 max-w-sm font-body text-sm leading-relaxed text-stone-500">
            Undangan digital yang berkesan untuk hari istimewamu. Dibuat dengan cinta untuk momen
            yang tak terlupakan.
          </p>
        </div>
        <div>
          <p class="mb-4 font-heading text-sm font-semibold tracking-widest text-gold uppercase">
            Produk
          </p>
          <ul class="space-y-2.5 font-body text-sm">
            <li>
              <a href="#templates" class="text-stone-600 transition hover:text-gold">Template</a>
            </li>
            <li>
              <a href="/create-wedding" class="text-stone-600 transition hover:text-gold"
                >Buat Undangan</a
              >
            </li>
            <li>
              <a href="#cara-kerja" class="text-stone-600 transition hover:text-gold">Cara Kerja</a>
            </li>
            <li>
              <a href="#keunggulan" class="text-stone-600 transition hover:text-gold">Keunggulan</a>
            </li>
          </ul>
        </div>
        <div>
          <p class="mb-4 font-heading text-sm font-semibold tracking-widest text-gold uppercase">
            Bantuan
          </p>
          <ul class="space-y-2.5 font-body text-sm">
            <li><a href="#faq" class="text-stone-600 transition hover:text-gold">FAQ</a></li>
            <li>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                class="text-stone-600 transition hover:text-gold">Hubungi Kami</a
              >
            </li>
            <li>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                class="text-stone-600 transition hover:text-gold">0898-1219-376</a
              >
            </li>
            <li>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                class="text-stone-600 transition hover:text-gold">Senin – Sabtu · 08.00 – 21.00</a
              >
            </li>
          </ul>
        </div>
      </div>
      <div
        class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-200 pt-8 sm:flex-row"
      >
        <p class="font-body text-xs text-stone-500">
          © {new Date().getFullYear()} ulem — Waluya Enterprise
        </p>
        <Credit />
      </div>
    </div>
  </footer>

  <!-- ── TEMPLATE PREVIEW MODAL ─────────────────────────────────────────── -->
  {#if preview}
    <div
      class="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Preview template ${preview.name}`}
      transition:fade={{ duration: 200 }}
    >
      <button
        type="button"
        class="absolute inset-0 h-full w-full cursor-pointer bg-black/75 backdrop-blur-sm"
        aria-label="Tutup preview"
        onclick={() => (preview = null)}
      ></button>

      <div
        class="relative flex w-full max-w-md flex-col overflow-hidden rounded-3xl bg-ink-soft shadow-2xl ring-1 ring-gold/30"
        transition:fly={{ y: 24, duration: 250 }}
      >
        <div class="flex items-center justify-between gap-3 border-b border-cream/10 px-5 py-3.5">
          <div class="flex items-center gap-3">
            <span class="h-5 w-px bg-gold/60"></span>
            <p class="font-heading text-base font-semibold text-cream">{preview.name}</p>
          </div>
          <div class="flex items-center gap-2">
            <a
              href="/wedding/demo-{preview.slug}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-1.5 font-body text-xs font-semibold text-ink transition hover:bg-gold-soft"
            >
              Buka Demo Penuh
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0-5 5m5-5H6" />
              </svg>
            </a>
            <button
              type="button"
              onclick={() => (preview = null)}
              class="inline-flex h-8 w-8 items-center justify-center rounded-full text-cream/60 transition hover:bg-white/10 hover:text-cream"
              aria-label="Tutup preview"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="relative bg-black">
          {#key preview.slug}
            <iframe
              src="/wedding/demo-{preview.slug}?preview=true"
              title="Preview undangan {preview.name}"
              sandbox="allow-scripts allow-same-origin"
              class="h-[70vh] w-full border-none bg-white"
            ></iframe>
          {/key}
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  /* Decorative flowers support the composition on larger screens without competing with content on phones. */
  @media (max-width: 767px) {
    .landing-page .jelly {
      display: none;
      animation: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .landing-page .jelly {
      animation: none;
    }
  }
</style>
