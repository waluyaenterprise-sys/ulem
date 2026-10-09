<script lang="ts">
  import { onMount } from 'svelte';
  import { PUBLIC_API_URL } from '$env/static/public';
  import GroomForm from '../admin/components/GroomForm.svelte';
  import BrideForm from '../admin/components/BrideForm.svelte';
  import MediaForm from '../admin/components/MediaForm.svelte';
  import EventsForm from '../admin/components/EventsForm.svelte';
  import GiftsForm from '../admin/components/GiftsForm.svelte';
  import LoveStoryForm from '../admin/components/LoveStoryForm.svelte';
  import ClosingForm from '../admin/components/ClosingForm.svelte';
  import PreviewModal from '../admin/components/PreviewModal.svelte';

  const API = PUBLIC_API_URL;

  // ── Types ────────────────────────────────────────────────────────────────
  type Section =
    | 'groom'
    | 'bride'
    | 'cover'
    | 'quote'
    | 'gallery'
    | 'events'
    | 'gifts'
    | 'loveStory'
    | 'closing';

  interface Template {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
  }

  interface TemplateRule {
    section: Section;
    hasImage: boolean;
    multipleImage: boolean;
    minImages: number | null;
    maxImages: number | null;
  }

  interface Song {
    id: string;
    title: string;
    url: string;
  }

  interface PersonForm {
    name: string;
    father: string;
    mother: string;
    notes: string;
    socialMedia: { instagram: string; facebook: string };
    imageUrls: string[];
  }
  interface EventForm {
    type: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    locationUrl: string;
    imageUrls: string[];
  }
  interface GiftForm {
    type: 'bank' | 'eWallet' | 'physical';
    name: string;
    accountNumber: string;
    accountHolder: string;
    description: string;
    imageUrls: string[];
  }
  interface LoveStoryForm {
    title: string;
    date: string;
    description: string;
    imageUrl: string;
  }

  // ── State ────────────────────────────────────────────────────────────────
  let templates = $state<Template[]>([]);
  let songs = $state<Song[]>([]);
  let rules = $state<TemplateRule[]>([]);
  let loadingTemplates = $state(true);
  let loadingError = $state('');

  let form = $state({
    slug: '',
    templateId: '',
    templateSlug: '',
    songUrl: '',
    groom: {
      name: '',
      father: '',
      mother: '',
      notes: '',
      socialMedia: { instagram: '', facebook: '' },
      imageUrls: [] as string[]
    } as PersonForm,
    bride: {
      name: '',
      father: '',
      mother: '',
      notes: '',
      socialMedia: { instagram: '', facebook: '' },
      imageUrls: [] as string[]
    } as PersonForm,
    cover: { imageUrls: [] as string[] },
    quote: { text: '', source: '', imageUrls: [] as string[] },
    gallery: { imageUrls: [] as string[] },
    events: [] as EventForm[],
    gifts: [] as GiftForm[],
    loveStories: [] as LoveStoryForm[],
    loveStoryVideos: [] as { url: string }[],
    closing: { message: '', imageUrls: [] as string[] }
  });

  type Tab = 'basic' | 'groom' | 'bride' | 'media' | 'events' | 'story' | 'closing';
  let activeTab = $state<Tab>('basic');
  let showPreview = $state(false);

  const ALL_TABS: {
    id: Tab;
    label: string;
    shortLabel: string;
    title: string;
    description: string;
    optional?: boolean;
  }[] = [
    {
      id: 'basic',
      label: 'Gaya Undangan',
      shortLabel: 'Gaya',
      title: 'Pilih gaya undangan',
      description: 'Tentukan desain dan musik yang paling mewakili hari bahagiamu.'
    },
    {
      id: 'groom',
      label: 'Mempelai Pria',
      shortLabel: 'Pria',
      title: 'Tentang mempelai pria',
      description: 'Lengkapi nama dan informasi keluarga mempelai pria.'
    },
    {
      id: 'bride',
      label: 'Mempelai Wanita',
      shortLabel: 'Wanita',
      title: 'Tentang mempelai wanita',
      description: 'Lengkapi nama dan informasi keluarga mempelai wanita.'
    },
    {
      id: 'media',
      label: 'Foto & Kutipan',
      shortLabel: 'Foto',
      title: 'Hidupkan undanganmu',
      description: 'Tambahkan foto cover, kutipan, dan momen favorit untuk galeri.'
    },
    {
      id: 'events',
      label: 'Acara & Hadiah',
      shortLabel: 'Acara',
      title: 'Detail hari bahagia',
      description: 'Masukkan jadwal acara, lokasi, dan pilihan hadiah untuk tamu.'
    },
    {
      id: 'story',
      label: 'Kisah Cinta',
      shortLabel: 'Cerita',
      title: 'Bagikan perjalanan kalian',
      description: 'Ceritakan momen berkesan dari pertemuan hingga hari pernikahan.',
      optional: true
    },
    {
      id: 'closing',
      label: 'Tinjau & Selesai',
      shortLabel: 'Selesai',
      title: 'Satu langkah lagi',
      description: 'Tambahkan pesan penutup, periksa ringkasan, lalu buat undanganmu.'
    }
  ];

  let submitting = $state(false);
  let submitError = $state('');
  let submitSuccess = $state(false);
  let createdSlug = $state('');
  let copiedLink = $state(false);
  let formErrors = $state<Record<string, string>>({});

  // ── Derived per-component errors ─────────────────────────────────────────
  let groomErrors = $state<Record<string, string>>({});
  let brideErrors = $state<Record<string, string>>({});

  $effect(() => {
    const e: Record<string, string> = {};
    if (formErrors.groomName) e.name = formErrors.groomName;
    if (formErrors.groomFather) e.father = formErrors.groomFather;
    if (formErrors.groomMother) e.mother = formErrors.groomMother;
    groomErrors = e;
  });

  $effect(() => {
    const e: Record<string, string> = {};
    if (formErrors.brideName) e.name = formErrors.brideName;
    if (formErrors.brideFather) e.father = formErrors.brideFather;
    if (formErrors.brideMother) e.mother = formErrors.brideMother;
    brideErrors = e;
  });

  // ── Auto-slug ─────────────────────────────────────────────────────────────
  function toSlugPart(name: string): string {
    return name
      .trim()
      .split(/\s+/)[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
  }

  $effect(() => {
    const g = toSlugPart(form.groom.name);
    const b = toSlugPart(form.bride.name);
    if (g || b) form.slug = [g, b].filter(Boolean).join('-');
  });

  // ── Template rules helper ────────────────────────────────────────────────
  function rule(section: Section): TemplateRule | null {
    return rules.find((r) => r.section === section) ?? null;
  }

  // ── Load data ────────────────────────────────────────────────────────────
  async function loadTemplates() {
    loadingTemplates = true;
    loadingError = '';
    try {
      const res = await fetch(`${API}/templates`);
      if (!res.ok) throw new Error('Template belum dapat dimuat. Silakan coba lagi.');
      templates = await res.json();
      if (templates.length > 0) {
        form.templateId = templates[0].id;
        form.templateSlug = templates[0].slug;
        await loadRules(templates[0].id);
      }
    } catch (error: any) {
      loadingError = error.message ?? 'Template belum dapat dimuat. Silakan coba lagi.';
    } finally {
      loadingTemplates = false;
    }
  }

  async function loadSongs() {
    try {
      const res = await fetch(`${API}/songs`);
      if (res.ok) songs = await res.json();
    } catch {}
  }

  async function loadRules(templateId: string) {
    if (!templateId) return;
    try {
      const res = await fetch(`${API}/template-rules?templateId=${templateId}`);
      if (res.ok) rules = await res.json();
      else rules = [];
    } catch {
      rules = [];
    }
  }

  async function selectTemplate(template: Template) {
    form.templateId = template.id;
    form.templateSlug = template.slug;
    await loadRules(template.id);
  }

  // ── Tab helpers ──────────────────────────────────────────────────────────
  function isTabComplete(tabId: string): boolean {
    switch (tabId) {
      case 'basic':
        return !!form.templateId;
      case 'groom':
        return !!(form.groom.name.trim() && form.groom.father.trim() && form.groom.mother.trim());
      case 'bride':
        return !!(form.bride.name.trim() && form.bride.father.trim() && form.bride.mother.trim());
      case 'media':
        return form.cover.imageUrls.some(Boolean) || form.gallery.imageUrls.some(Boolean);
      case 'events':
        return (
          form.events.length > 0 &&
          form.events.every(
            (event) => event.title.trim() && event.date && event.startTime && event.location.trim()
          )
        );
      case 'story':
        return (
          form.loveStories.length === 0 ||
          form.loveStories.every((story) => story.title.trim() && story.date)
        );
      case 'closing':
        return false;
      default:
        return false;
    }
  }

  // ── Validation ───────────────────────────────────────────────────────────
  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.templateId) errs.template = 'Pilih template undangan terlebih dahulu';
    if (!form.slug.trim()) errs.slug = 'Slug wajib diisi';
    if (!form.groom.name.trim()) errs.groomName = 'Nama mempelai pria wajib diisi';
    if (!form.groom.father.trim()) errs.groomFather = 'Nama ayah wajib diisi';
    if (!form.groom.mother.trim()) errs.groomMother = 'Nama ibu wajib diisi';
    if (!form.bride.name.trim()) errs.brideName = 'Nama mempelai wanita wajib diisi';
    if (!form.bride.father.trim()) errs.brideFather = 'Nama ayah wajib diisi';
    if (!form.bride.mother.trim()) errs.brideMother = 'Nama ibu wajib diisi';
    if (form.events.length === 0) {
      errs.events = 'Tambahkan minimal satu acara';
    } else if (
      form.events.some(
        (event) => !event.title.trim() || !event.date || !event.startTime || !event.location.trim()
      )
    ) {
      errs.events = 'Lengkapi judul, tanggal, jam mulai, dan lokasi pada setiap acara';
    }
    if (form.loveStories.some((story) => !story.title.trim() || !story.date)) {
      errs.story = 'Lengkapi judul dan tanggal pada setiap kisah cinta';
    }
    formErrors = errs;

    if (errs.template) activeTab = 'basic';
    else if (errs.groomName || errs.groomFather || errs.groomMother) activeTab = 'groom';
    else if (errs.brideName || errs.brideFather || errs.brideMother) activeTab = 'bride';
    else if (errs.events) activeTab = 'events';
    else if (errs.story) activeTab = 'story';

    if (Object.keys(errs).length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return Object.keys(errs).length === 0;
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!validate()) return;

    submitting = true;
    submitError = '';
    submitSuccess = false;

    try {
      const res = await fetch(`${API}/invitations/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: form.slug,
          templateSlug: form.templateSlug,
          songUrl: form.songUrl,
          groom: {
            ...form.groom,
            notes: form.groom.notes || undefined,
            socialMedia: {
              instagram: form.groom.socialMedia.instagram || undefined,
              facebook: form.groom.socialMedia.facebook || undefined
            },
            imageUrls: form.groom.imageUrls.filter(Boolean)
          },
          bride: {
            ...form.bride,
            notes: form.bride.notes || undefined,
            socialMedia: {
              instagram: form.bride.socialMedia.instagram || undefined,
              facebook: form.bride.socialMedia.facebook || undefined
            },
            imageUrls: form.bride.imageUrls.filter(Boolean)
          },
          cover: { imageUrls: form.cover.imageUrls.filter(Boolean) },
          quote: {
            text: form.quote.text || undefined,
            source: form.quote.source || undefined,
            imageUrls: form.quote.imageUrls.filter(Boolean)
          },
          gallery: { imageUrls: form.gallery.imageUrls.filter(Boolean) },
          events: form.events.map((e) => ({
            ...e,
            date: e.date ? new Date(`${e.date}T00:00:00.000Z`).toISOString() : e.date
          })),
          gifts: form.gifts,
          loveStories: form.loveStories,
          loveStoryVideos: form.loveStoryVideos.filter((v) => v.url),
          closing: {
            message: form.closing.message || undefined,
            imageUrls: form.closing.imageUrls.filter(Boolean)
          }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Gagal membuat undangan');

      createdSlug = data.slug;
      submitSuccess = true;
    } catch (err: any) {
      submitError = err.message;
    } finally {
      submitting = false;
    }
  }

  function resetForm() {
    window.location.reload();
  }

  function goToStep(tab: Tab) {
    activeTab = tab;
    submitError = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function copyInvitationLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/wedding/${createdSlug}`);
    copiedLink = true;
    setTimeout(() => (copiedLink = false), 2000);
  }

  // ── Derived ──────────────────────────────────────────────────────────────
  let currentIndex = $derived(ALL_TABS.findIndex((t) => t.id === activeTab));
  let currentTab = $derived(ALL_TABS[currentIndex]);
  let completedCount = $derived(ALL_TABS.filter((tab) => isTabComplete(tab.id)).length);
  let progress = $derived(Math.round(((currentIndex + 1) / ALL_TABS.length) * 100));
  let selectedTemplate = $derived(templates.find((template) => template.id === form.templateId));
  let photoCount = $derived(
    [
      ...form.groom.imageUrls,
      ...form.bride.imageUrls,
      ...form.cover.imageUrls,
      ...form.quote.imageUrls,
      ...form.gallery.imageUrls,
      ...form.closing.imageUrls
    ].filter(Boolean).length +
      form.events.flatMap((event) => event.imageUrls).filter(Boolean).length +
      form.gifts.flatMap((gift) => gift.imageUrls).filter(Boolean).length +
      form.loveStories.filter((story) => story.imageUrl).length
  );

  onMount(() => {
    loadTemplates();
    loadSongs();
  });
</script>

<svelte:head>
  <title>Buat Undangan Pernikahan | Ulem</title>
  <meta name="description" content="Buat undangan pernikahan digital dengan langkah yang mudah." />
</svelte:head>

<div class="create-page min-h-screen bg-[#f7f5f1] text-[#25231f]">
  <header class="border-b border-black/6 bg-white/90 backdrop-blur-xl">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
      <a href="/" class="flex items-center gap-2.5" aria-label="Kembali ke beranda Ulem">
        <span
          class="flex h-9 w-9 items-center justify-center rounded-full bg-[#25231f] text-sm text-white"
          >U</span
        >
        <span class="font-heading text-lg font-semibold tracking-tight">Ulem</span>
      </a>
      <button
        type="button"
        onclick={() => (showPreview = true)}
        disabled={!form.templateId}
        class="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:border-black/20 hover:bg-[#faf9f7] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.7"
            d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
          />
          <circle cx="12" cy="12" r="2.5" stroke-width="1.7" />
        </svg>
        Preview
      </button>
    </div>
  </header>

  <div class="mx-auto w-full max-w-7xl min-w-0 px-4 py-7 sm:px-6 sm:py-10">
    {#if submitSuccess}
      <div
        class="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-black/6 bg-white text-center shadow-[0_24px_80px_rgba(37,35,31,0.10)]"
      >
        <div class="h-2 bg-gradient-to-r from-[#c7a47b] via-[#8d6a48] to-[#c7a47b]"></div>
        <div class="px-6 py-12 sm:px-12 sm:py-16">
          <div
            class="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#eef5ed]"
          >
            <svg class="h-9 w-9 text-[#52704c]" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <p class="mb-2 text-xs font-bold tracking-[0.22em] text-[#8d6a48] uppercase">
            Siap dibagikan
          </p>
          <h2 class="font-heading text-3xl font-semibold sm:text-4xl">
            Undanganmu berhasil dibuat
          </h2>
          <p class="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#76716a]">
            Lihat hasil akhirnya, lalu bagikan tautan ini kepada keluarga dan sahabat.
          </p>
          <div
            class="mx-auto mt-7 flex max-w-xl items-center gap-2 rounded-2xl border border-black/8 bg-[#f7f5f1] p-2 pl-4 text-left"
          >
            <span class="min-w-0 flex-1 truncate text-sm text-[#56514b]"
              >/wedding/{createdSlug}</span
            >
            <button
              type="button"
              onclick={copyInvitationLink}
              class="shrink-0 rounded-xl bg-white px-4 py-2 text-xs font-bold shadow-sm"
            >
              {copiedLink ? 'Tersalin!' : 'Salin link'}
            </button>
          </div>
          <div class="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/wedding/{createdSlug}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 rounded-full bg-[#25231f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              Lihat undangan ↗
            </a>
            <button
              type="button"
              onclick={resetForm}
              class="rounded-full border border-black/10 px-6 py-3 text-sm font-semibold transition hover:bg-[#f7f5f1]"
              >Buat undangan baru</button
            >
          </div>
        </div>
      </div>
    {:else}
      <div class="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="mb-2 text-xs font-bold tracking-[0.2em] text-[#8d6a48] uppercase">
            Buat undanganmu
          </p>
          <h1 class="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Ceritakan hari bahagiamu
          </h1>
          <p class="mt-2 max-w-xl text-sm leading-6 text-[#76716a]">
            Ikuti langkah sederhana berikut. Kamu tetap bisa kembali dan mengubah bagian sebelumnya.
          </p>
        </div>
        <div class="min-w-48">
          <div class="mb-2 flex items-center justify-between text-xs font-medium text-[#76716a]">
            <span>Langkah {currentIndex + 1} dari {ALL_TABS.length}</span>
            <span>{progress}%</span>
          </div>
          <div class="h-1.5 overflow-hidden rounded-full bg-black/8">
            <div
              class="h-full rounded-full bg-[#8d6a48] transition-all duration-500"
              style:width={`${progress}%`}
            ></div>
          </div>
        </div>
      </div>

      <!-- Tab nav with checkmarks -->
      <div class="no-scrollbar mb-5 overflow-x-auto">
        <div class="flex min-w-max gap-2 pb-1">
          {#each ALL_TABS as tab, index}
            <button
              type="button"
              class="flex items-center gap-2 rounded-full border px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap transition {activeTab ===
              tab.id
                ? 'border-[#25231f] bg-[#25231f] text-white shadow-sm'
                : 'border-black/8 bg-white text-[#76716a] hover:border-black/15'}"
              onclick={() => goToStep(tab.id)}
            >
              <span class="opacity-60">{index + 1}</span>
              {#if isTabComplete(tab.id)}
                <svg class="h-3.5 w-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              {:else}
                <span class="text-[10px] opacity-40">○</span>
              {/if}
              {tab.shortLabel}
            </button>
          {/each}
        </div>
      </div>

      <div class="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_270px]">
        <main
          class="w-full max-w-full min-w-0 overflow-hidden rounded-[1.75rem] border border-black/6 bg-white shadow-[0_18px_55px_rgba(37,35,31,0.06)]"
        >
          <div class="border-b border-black/6 px-5 py-6 sm:px-8 sm:py-7">
            <p class="mb-1.5 text-xs font-bold tracking-[0.16em] text-[#8d6a48] uppercase">
              Langkah {currentIndex + 1}{#if currentTab.optional}
                · Opsional{/if}
            </p>
            <h2 class="font-heading text-2xl font-semibold">{currentTab.title}</h2>
            <p class="mt-1.5 max-w-xl text-sm leading-6 text-[#76716a]">{currentTab.description}</p>
          </div>

          {#if Object.keys(formErrors).length > 0}
            <div
              class="mx-5 mt-5 rounded-2xl border border-[#e8c9c4] bg-[#fff6f4] px-4 py-3 text-sm text-[#9b443b] sm:mx-8"
            >
              <p class="font-semibold">Masih ada informasi yang perlu dilengkapi.</p>
              <p class="mt-0.5 text-xs opacity-80">
                Kami sudah membawamu ke bagian pertama yang perlu diperiksa.
              </p>
            </div>
          {/if}

          <div class="form-stage p-5 sm:p-8">
            <!-- ═══════ DASAR ═══════ -->
            {#if activeTab === 'basic'}
              <div class="space-y-7">
                <div>
                  <div class="mb-3 flex items-end justify-between gap-4">
                    <div>
                      <p class="text-sm font-semibold">
                        Pilih template <span class="text-[#a24f43]">*</span>
                      </p>
                      <p class="mt-1 text-xs text-[#8a857e]">
                        Klik template lalu gunakan Preview untuk melihat hasilnya.
                      </p>
                    </div>
                    <span class="text-xs text-[#9a958e]">{templates.length} pilihan</span>
                  </div>
                  {#if loadingTemplates}
                    <div class="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 sm:grid-cols-3">
                      {#each Array(6) as _}<div
                          class="h-36 animate-pulse rounded-2xl bg-[#f0ede8]"
                        ></div>{/each}
                    </div>
                  {:else if loadingError}
                    <div
                      class="rounded-2xl border border-[#e8c9c4] bg-[#fff6f4] p-4 text-sm text-[#9b443b]"
                    >
                      <p>{loadingError}</p>
                      <button
                        type="button"
                        onclick={loadTemplates}
                        class="mt-2 font-semibold underline">Coba lagi</button
                      >
                    </div>
                  {:else}
                    <div class="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 sm:grid-cols-3">
                      {#each templates as template}
                        <button
                          type="button"
                          onclick={() => selectTemplate(template)}
                          class="group overflow-hidden rounded-2xl border-2 text-left transition {form.templateId ===
                          template.id
                            ? 'border-[#8d6a48] bg-[#faf7f2] shadow-[0_8px_24px_rgba(141,106,72,0.14)]'
                            : 'border-black/7 bg-white hover:-translate-y-0.5 hover:border-black/18'}"
                        >
                          <div
                            class="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#e9dfd2] to-[#c7a47b]"
                          >
                            {#if template.imageUrl}
                              <img
                                src={template.imageUrl}
                                alt="Preview template {template.name}"
                                class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              />
                            {:else}
                              <div
                                class="flex h-full items-center justify-center font-heading text-3xl text-white/80"
                              >
                                {template.name.slice(0, 1)}
                              </div>
                            {/if}
                            {#if form.templateId === template.id}<span
                                class="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#25231f] text-xs text-white"
                                >✓</span
                              >{/if}
                          </div>
                          <span class="block px-3 py-2.5 text-sm font-semibold"
                            >{template.name}</span
                          >
                        </button>
                      {/each}
                    </div>
                  {/if}
                </div>

                <div class="grid gap-5 border-t border-black/6 pt-6 sm:grid-cols-2">
                  <div>
                    <label for="song" class="mb-2 block text-sm font-semibold"
                      >Lagu latar <span class="font-normal text-[#9a958e]">(opsional)</span></label
                    >
                    <select
                      id="song"
                      bind:value={form.songUrl}
                      class="w-full rounded-xl border border-black/10 bg-[#faf9f7] px-3.5 py-3 text-sm transition outline-none focus:border-[#8d6a48] focus:bg-white"
                    >
                      <option value="">Tanpa lagu</option>
                      {#each songs as song}<option value={song.url}>{song.title}</option>{/each}
                    </select>
                    <p class="mt-2 text-xs leading-5 text-[#9a958e]">
                      Musik diputar setelah tamu membuka cover.
                    </p>
                  </div>
                  <div>
                    <span class="mb-2 block text-sm font-semibold">Alamat undangan</span>
                    <div
                      class="flex min-h-11 items-center rounded-xl border border-black/8 bg-[#f3f0eb] px-3.5 text-sm text-[#77716a]"
                    >
                      /wedding/{form.slug || 'nama-kalian'}
                    </div>
                    <p class="mt-2 text-xs leading-5 text-[#9a958e]">
                      Dibuat otomatis dari nama kedua mempelai.
                    </p>
                  </div>
                </div>
              </div>
            {/if}

            <!-- ═══════ MEMPELAI PRIA ═══════ -->
            {#if activeTab === 'groom'}
              <div class="mb-4">
                <GroomForm
                  bind:name={form.groom.name}
                  bind:father={form.groom.father}
                  bind:mother={form.groom.mother}
                  bind:notes={form.groom.notes}
                  bind:instagram={form.groom.socialMedia.instagram}
                  bind:facebook={form.groom.socialMedia.facebook}
                  bind:imageUrls={form.groom.imageUrls}
                  hasImage={rule('groom')?.hasImage ?? true}
                  maxImages={rule('groom')?.maxImages ?? null}
                  minImages={rule('groom')?.minImages ?? null}
                  multipleImage={rule('groom')?.multipleImage ?? true}
                  bind:errors={groomErrors}
                />
              </div>
            {/if}

            <!-- ═══════ MEMPELAI WANITA ═══════ -->
            {#if activeTab === 'bride'}
              <div class="mb-4">
                <BrideForm
                  bind:name={form.bride.name}
                  bind:father={form.bride.father}
                  bind:mother={form.bride.mother}
                  bind:notes={form.bride.notes}
                  bind:instagram={form.bride.socialMedia.instagram}
                  bind:facebook={form.bride.socialMedia.facebook}
                  bind:imageUrls={form.bride.imageUrls}
                  hasImage={rule('bride')?.hasImage ?? true}
                  maxImages={rule('bride')?.maxImages ?? null}
                  minImages={rule('bride')?.minImages ?? null}
                  multipleImage={rule('bride')?.multipleImage ?? true}
                  bind:errors={brideErrors}
                />
              </div>
            {/if}

            <!-- ═══════ MEDIA ═══════ -->
            {#if activeTab === 'media'}
              <MediaForm
                bind:coverImages={form.cover.imageUrls}
                bind:quoteText={form.quote.text}
                bind:quoteSource={form.quote.source}
                bind:quoteImages={form.quote.imageUrls}
                bind:galleryImages={form.gallery.imageUrls}
                hasCover={rule('cover')?.hasImage ?? true}
                hasQuote={rule('quote')?.hasImage ?? true}
                hasGallery={rule('gallery')?.hasImage ?? true}
                coverMax={rule('cover')?.maxImages ?? null}
                coverMin={rule('cover')?.minImages ?? null}
                coverMultiple={rule('cover')?.multipleImage ?? true}
                quoteMax={rule('quote')?.maxImages ?? null}
                quoteMin={rule('quote')?.minImages ?? null}
                quoteMultiple={rule('quote')?.multipleImage ?? true}
                galleryMax={rule('gallery')?.maxImages ?? null}
                galleryMin={rule('gallery')?.minImages ?? null}
                galleryMultiple={rule('gallery')?.multipleImage ?? true}
              />
            {/if}

            <!-- ═══════ ACARA & HADIAH ═══════ -->
            {#if activeTab === 'events'}
              {#if formErrors.events}
                <p class="mb-4 rounded-xl bg-[#fff6f4] px-4 py-3 text-sm text-[#9b443b]">
                  {formErrors.events}
                </p>
              {/if}
              <EventsForm
                bind:events={form.events}
                hasImages={rule('events')?.hasImage ?? true}
                maxImages={rule('events')?.maxImages ?? null}
                minImages={rule('events')?.minImages ?? null}
                multipleImage={rule('events')?.multipleImage ?? true}
              />
              <GiftsForm
                bind:gifts={form.gifts}
                hasImages={rule('gifts')?.hasImage ?? true}
                maxImages={rule('gifts')?.maxImages ?? null}
                minImages={rule('gifts')?.minImages ?? null}
                multipleImage={rule('gifts')?.multipleImage ?? true}
              />
            {/if}

            <!-- ═══════ LOVE STORY ═══════ -->
            {#if activeTab === 'story'}
              {#if formErrors.story}
                <p class="mb-4 rounded-xl bg-[#fff6f4] px-4 py-3 text-sm text-[#9b443b]">
                  {formErrors.story}
                </p>
              {/if}
              <LoveStoryForm
                bind:stories={form.loveStories}
                hasImage={rule('loveStory')?.hasImage ?? true}
                maxImages={rule('loveStory')?.maxImages ?? null}
                minImages={rule('loveStory')?.minImages ?? null}
              />
            {/if}

            <!-- ═══════ PENUTUP ═══════ -->
            {#if activeTab === 'closing'}
              <ClosingForm
                bind:closingMessage={form.closing.message}
                bind:closingImages={form.closing.imageUrls}
                maxImages={rule('closing')?.maxImages ?? null}
                minImages={rule('closing')?.minImages ?? null}
                multipleImage={rule('closing')?.multipleImage ?? true}
                hasImage={rule('closing')?.hasImage ?? true}
              />
              <div class="rounded-2xl border border-black/7 bg-[#f7f5f1] p-5">
                <div class="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 class="text-sm font-semibold">Ringkasan undangan</h3>
                    <p class="mt-1 text-xs text-[#8a857e]">
                      Periksa detail utama sebelum melanjutkan.
                    </p>
                  </div>
                  <button
                    type="button"
                    onclick={() => (showPreview = true)}
                    class="shrink-0 text-xs font-bold text-[#8d6a48] hover:underline"
                    >Buka preview</button
                  >
                </div>
                <dl class="grid gap-3 sm:grid-cols-2">
                  <div class="rounded-xl bg-white p-3.5">
                    <dt class="text-[10px] font-bold tracking-wider text-[#9a958e] uppercase">
                      Mempelai
                    </dt>
                    <dd class="mt-1 truncate text-sm font-semibold">
                      {form.bride.name || 'Belum diisi'} & {form.groom.name || 'Belum diisi'}
                    </dd>
                  </div>
                  <div class="rounded-xl bg-white p-3.5">
                    <dt class="text-[10px] font-bold tracking-wider text-[#9a958e] uppercase">
                      Template
                    </dt>
                    <dd class="mt-1 text-sm font-semibold">
                      {selectedTemplate?.name ?? 'Belum dipilih'}
                    </dd>
                  </div>
                  <div class="rounded-xl bg-white p-3.5">
                    <dt class="text-[10px] font-bold tracking-wider text-[#9a958e] uppercase">
                      Acara
                    </dt>
                    <dd class="mt-1 text-sm font-semibold">{form.events.length} acara</dd>
                  </div>
                  <div class="rounded-xl bg-white p-3.5">
                    <dt class="text-[10px] font-bold tracking-wider text-[#9a958e] uppercase">
                      Media
                    </dt>
                    <dd class="mt-1 text-sm font-semibold">{photoCount} foto</dd>
                  </div>
                </dl>
              </div>
            {/if}
          </div>
          <div
            class="sticky bottom-0 z-10 flex items-center justify-between gap-3 border-t border-black/6 bg-white/95 px-5 py-4 backdrop-blur-xl sm:px-8"
          >
            {#if currentIndex > 0}
              <button
                type="button"
                onclick={() => goToStep(ALL_TABS[currentIndex - 1].id)}
                class="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-[#f7f5f1]"
                >← <span class="hidden sm:inline">Sebelumnya</span></button
              >
            {:else}
              <a href="/" class="text-sm font-semibold text-[#76716a] hover:text-[#25231f]">Batal</a
              >
            {/if}
            <span class="hidden text-xs text-[#9a958e] sm:block"
              >{completedCount} bagian lengkap</span
            >
            {#if currentIndex < ALL_TABS.length - 1}
              <button
                type="button"
                onclick={() => goToStep(ALL_TABS[currentIndex + 1].id)}
                class="inline-flex items-center gap-2 rounded-full bg-[#25231f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
                >Selanjutnya →</button
              >
            {:else}
              <button
                type="button"
                onclick={handleSubmit}
                disabled={submitting}
                class="inline-flex min-w-40 items-center justify-center gap-2 rounded-full bg-[#8d6a48] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#76583c] disabled:cursor-wait disabled:opacity-60"
              >
                {#if submitting}<span
                    class="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
                  ></span> Membuat...{:else}Buat undangan ✓{/if}
              </button>
            {/if}
          </div>

          {#if submitError}
            <div
              class="mx-5 mt-4 mb-5 rounded-xl bg-[#fff6f4] px-4 py-2.5 text-sm text-[#9b443b] sm:mx-8"
            >
              {submitError}
            </div>
          {/if}
        </main>

        <aside class="sticky top-6 hidden space-y-4 xl:block">
          <div
            class="overflow-hidden rounded-[1.5rem] border border-black/6 bg-white shadow-[0_12px_40px_rgba(37,35,31,0.05)]"
          >
            <div
              class="relative aspect-[4/3] bg-gradient-to-br from-[#ded0be] via-[#c7a47b] to-[#8d6a48]"
            >
              {#if selectedTemplate?.imageUrl}<img
                  src={selectedTemplate.imageUrl}
                  alt="Template terpilih"
                  class="h-full w-full object-cover"
                />{/if}
              <div class="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent"></div>
              <div class="absolute right-4 bottom-4 left-4 text-white">
                <p class="text-[10px] font-bold tracking-[0.18em] uppercase">Template pilihan</p>
                <p class="mt-1 font-heading text-xl font-semibold">
                  {selectedTemplate?.name ?? 'Pilih template'}
                </p>
              </div>
            </div>
            <div class="p-4">
              <button
                type="button"
                onclick={() => (showPreview = true)}
                disabled={!form.templateId}
                class="w-full rounded-full bg-[#25231f] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-40"
                >Preview undangan</button
              >
            </div>
          </div>
          <div
            class="rounded-[1.5rem] border border-black/6 bg-white p-5 text-sm shadow-[0_12px_40px_rgba(37,35,31,0.05)]"
          >
            <p class="font-semibold">Tips agar undangan berkesan</p>
            <p class="mt-1.5 text-xs leading-5 text-[#8a857e]">
              Gunakan foto berkualitas baik dan periksa kembali tanggal serta lokasi acara.
            </p>
          </div>
        </aside>
      </div>
    {/if}
  </div>
</div>

<PreviewModal bind:open={showPreview} {form} templateSlug={selectedTemplate?.slug ?? ''} />

<style>
  .no-scrollbar {
    scrollbar-width: none;
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  :global(.form-stage > .rounded-2xl),
  :global(.form-stage > div > .rounded-2xl) {
    margin-bottom: 1rem;
    border: 1px solid rgb(0 0 0 / 0.07);
    box-shadow: none;
  }
  :global(.form-stage > .rounded-2xl:last-child),
  :global(.form-stage > div > .rounded-2xl:last-child) {
    margin-bottom: 0;
  }
  @media (max-width: 639px) {
    .create-page {
      width: 100%;
      max-width: 100vw;
      overflow-x: clip;
    }

    .create-page main {
      width: calc(100vw - 2rem);
      max-width: calc(100vw - 2rem);
    }

    :global(.form-stage input),
    :global(.form-stage select),
    :global(.form-stage textarea) {
      min-width: 0;
      max-width: 100%;
      font-size: 16px;
    }

    :global(.form-stage > .rounded-2xl),
    :global(.form-stage > div > .rounded-2xl) {
      padding: 1rem;
    }
  }
</style>
