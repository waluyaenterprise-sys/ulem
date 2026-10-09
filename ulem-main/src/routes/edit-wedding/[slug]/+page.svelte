<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { uploadImage } from '$lib/upload';
  import { PUBLIC_API_URL } from '$env/static/public';
  import { customerHeaders } from '$lib/customerAuth';
  import GroomForm from '../../admin/components/GroomForm.svelte';
  import BrideForm from '../../admin/components/BrideForm.svelte';
  import MediaForm from '../../admin/components/MediaForm.svelte';
  import EventsForm from '../../admin/components/EventsForm.svelte';
  import GiftsForm from '../../admin/components/GiftsForm.svelte';
  import LoveStoryForm from '../../admin/components/LoveStoryForm.svelte';
  import ClosingForm from '../../admin/components/ClosingForm.svelte';
  import PreviewModal from '../../admin/components/PreviewModal.svelte';

  const API = PUBLIC_API_URL;
  let slug = $derived($page.params.slug);
  let customerMode = $derived($page.url.searchParams.get('customer') === 'true');

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
  interface StoryForm {
    title: string;
    date: string;
    description: string;
    imageUrl: string;
  }

  let templates = $state<Template[]>([]);
  let songs = $state<Song[]>([]);
  let rules = $state<TemplateRule[]>([]);
  let loadingData = $state(true);
  let loadError = $state('');
  let loadingRules = $state(false);
  let activeTemplateId = $state('');
  let templateChangeNotice = $state<{
    previousId: string;
    previousSlug: string;
    nextName: string;
    hiddenSections: string[];
    requiredSections: string[];
    excessSections: string[];
  } | null>(null);
  let savedSnapshot = $state('');

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
    loveStories: [] as StoryForm[],
    loveStoryVideos: [] as { url: string }[],
    closing: { message: '', imageUrls: [] as string[] }
  });

  type Tab = 'basic' | 'groom' | 'bride' | 'media' | 'events' | 'story' | 'closing';
  let activeTab = $state<Tab>('basic');
  let showPreview = $state(false);

  const ALL_TABS: { id: Tab; label: string }[] = [
    { id: 'basic', label: 'Dasar' },
    { id: 'groom', label: 'Mempelai Pria' },
    { id: 'bride', label: 'Mempelai Wanita' },
    { id: 'media', label: 'Media' },
    { id: 'events', label: 'Acara & Hadiah' },
    { id: 'story', label: 'Love Story' },
    { id: 'closing', label: 'Penutup' }
  ];

  let submitting = $state(false);
  let submitError = $state('');
  let submitSuccess = $state(false);
  let formErrors = $state<Record<string, string>>({});

  let groomErrors = $state<Record<string, string>>({});
  let brideErrors = $state<Record<string, string>>({});
  let mediaErrors = $state<Record<string, string>>({});

  $effect(() => {
    const errors: Record<string, string> = {};
    if (formErrors.groomName) errors.name = formErrors.groomName;
    if (formErrors.groomFather) errors.father = formErrors.groomFather;
    if (formErrors.groomMother) errors.mother = formErrors.groomMother;
    groomErrors = errors;
  });

  $effect(() => {
    const errors: Record<string, string> = {};
    if (formErrors.brideName) errors.name = formErrors.brideName;
    if (formErrors.brideFather) errors.father = formErrors.brideFather;
    if (formErrors.brideMother) errors.mother = formErrors.brideMother;
    brideErrors = errors;
  });

  let uploadingMap = $state<Record<string, boolean>>({});

  function toDateInput(iso: string): string {
    if (!iso) return '';
    return iso.split('T')[0];
  }

  function rule(section: Section): TemplateRule | null {
    return rules.find((r) => r.section === section) ?? null;
  }

  function canAddImage(section: Section, currentCount: number): boolean {
    const r = rule(section);
    if (!r || !r.hasImage) return false;
    if (!r.multipleImage) return currentCount === 0;
    if (r.maxImages !== null) return currentCount < r.maxImages;
    return true;
  }

  function imageHint(section: Section): string {
    const r = rule(section);
    if (!r || !r.hasImage) return '';
    if (!r.multipleImage) return '1 gambar';
    const min = r.minImages;
    const max = r.maxImages;
    if (min !== null && max !== null) return `${min}–${max} gambar`;
    if (min !== null) return `Min. ${min} gambar`;
    if (max !== null) return `Maks. ${max} gambar`;
    return 'Beberapa gambar';
  }

  async function handleUpload(
    key: string,
    file: File,
    folder: string,
    onDone: (url: string) => void
  ) {
    uploadingMap = { ...uploadingMap, [key]: true };
    try {
      const url = await uploadImage(file, folder);
      onDone(url);
    } catch (e: any) {
      alert(e.message ?? 'Upload gagal');
    } finally {
      const { [key]: _, ...rest } = uploadingMap;
      uploadingMap = rest;
    }
  }

  async function loadRules(templateId: string): Promise<TemplateRule[]> {
    if (!templateId) return [];
    loadingRules = true;
    try {
      const res = await fetch(`${API}/template-rules?templateId=${templateId}`);
      const nextRules = res.ok ? await res.json() : [];
      rules = nextRules;
      return nextRules;
    } finally {
      loadingRules = false;
    }
  }

  function formSnapshot(): string {
    return JSON.stringify(form);
  }

  let hasUnsavedChanges = $derived(Boolean(savedSnapshot) && formSnapshot() !== savedSnapshot);

  const IMAGE_SECTION_LABELS: Record<Section, string> = {
    groom: 'foto mempelai pria', bride: 'foto mempelai wanita', cover: 'foto cover',
    quote: 'gambar quote', gallery: 'foto galeri', events: 'foto acara',
    gifts: 'foto hadiah', loveStory: 'foto love story', closing: 'foto penutup'
  };

  function sectionImageCount(section: Section): number {
    if (section === 'groom') return form.groom.imageUrls.filter(Boolean).length;
    if (section === 'bride') return form.bride.imageUrls.filter(Boolean).length;
    if (section === 'cover') return form.cover.imageUrls.filter(Boolean).length;
    if (section === 'quote') return form.quote.imageUrls.filter(Boolean).length;
    if (section === 'gallery') return form.gallery.imageUrls.filter(Boolean).length;
    if (section === 'events') return form.events.reduce((count, event) => count + event.imageUrls.filter(Boolean).length, 0);
    if (section === 'gifts') return form.gifts.reduce((count, gift) => count + gift.imageUrls.filter(Boolean).length, 0);
    if (section === 'loveStory') return form.loveStories.filter((story) => Boolean(story.imageUrl)).length;
    return form.closing.imageUrls.filter(Boolean).length;
  }

  function sectionHasImages(section: Section): boolean {
    return sectionImageCount(section) > 0;
  }

  async function loadTemplates() {
    try {
      const res = await fetch(`${API}/templates`);
      if (res.ok) templates = await res.json();
    } catch {}
  }

  async function loadSongs() {
    try {
      const res = await fetch(`${API}/songs`);
      if (res.ok) songs = await res.json();
    } catch {}
  }

  async function loadInvitation() {
    loadingData = true;
    loadError = '';
    try {
      const res = await fetch(customerMode ? `${API}/customer/invitation` : `${API}/invitations/${slug}`, {
        headers: customerMode ? customerHeaders() : {}
      });
      if (!res.ok) throw new Error('Undangan tidak ditemukan');
      const inv = await res.json();

      form.slug = inv.slug;
      form.templateId = inv.template?.id ?? '';
      form.templateSlug = inv.template?.slug ?? '';
      form.songUrl = inv.songUrl ?? '';

      const sm = (s: any) => ({ instagram: s?.instagram ?? '', facebook: s?.facebook ?? '' });
      form.groom = {
        name: inv.groom?.name ?? '',
        father: inv.groom?.father ?? '',
        mother: inv.groom?.mother ?? '',
        notes: inv.groom?.notes ?? '',
        socialMedia: sm(inv.groom?.socialMedia),
        imageUrls: inv.groom?.imageUrls ?? []
      };
      form.bride = {
        name: inv.bride?.name ?? '',
        father: inv.bride?.father ?? '',
        mother: inv.bride?.mother ?? '',
        notes: inv.bride?.notes ?? '',
        socialMedia: sm(inv.bride?.socialMedia),
        imageUrls: inv.bride?.imageUrls ?? []
      };
      form.cover = { imageUrls: inv.cover?.imageUrls ?? [] };
      form.quote = { text: inv.quote?.text ?? '', source: inv.quote?.source ?? '', imageUrls: inv.quote?.imageUrls ?? [] };
      form.gallery = { imageUrls: inv.gallery?.imageUrls ?? [] };
      form.events = (inv.events ?? []).map((e: any) => ({
        type: e.type ?? 'akad',
        title: e.title ?? '',
        date: toDateInput(e.date),
        startTime: e.startTime ?? '',
        endTime: e.endTime ?? '',
        location: e.location ?? '',
        locationUrl: e.locationUrl ?? '',
        imageUrls: e.imageUrls ?? []
      }));
      form.gifts = (inv.gifts ?? []).map((g: any) => ({
        type: g.type ?? 'bank',
        name: g.name ?? '',
        accountNumber: g.accountNumber ?? '',
        accountHolder: g.accountHolder ?? '',
        description: g.description ?? '',
        imageUrls: g.imageUrls ?? []
      }));
      form.loveStories = (inv.loveStories ?? []).map((s: any) => ({
        title: s.title ?? '',
        date: toDateInput(s.date),
        description: s.description ?? '',
        imageUrl: s.imageUrl ?? ''
      }));
      form.loveStoryVideos = (inv.loveStoryVideos ?? []).map((v: any) => ({ url: v.url ?? '' }));
      form.closing = {
        message: inv.closing?.message ?? '',
        imageUrls: inv.closing?.imageUrls ?? []
      };

      if (form.templateId) await loadRules(form.templateId);
      activeTemplateId = form.templateId;
      savedSnapshot = formSnapshot();
    } catch (e: any) {
      loadError = e.message;
    } finally {
      loadingData = false;
    }
  }

  async function onTemplateChange() {
    const t = templates.find((t) => t.id === form.templateId);
    if (t) {
      const previousTemplate = templates.find((item) => item.id === activeTemplateId);
      const nextRules = await loadRules(t.id);
      form.templateSlug = t.slug;
      if (activeTemplateId && activeTemplateId !== t.id) {
        const hiddenSections = (Object.keys(IMAGE_SECTION_LABELS) as Section[])
          .filter((section) => sectionHasImages(section) && nextRules.find((item) => item.section === section)?.hasImage === false)
          .map((section) => IMAGE_SECTION_LABELS[section]);
        const requiredSections = nextRules
          .filter((item) => item.hasImage && (item.minImages ?? 0) > 0 && !sectionHasImages(item.section))
          .map((item) => IMAGE_SECTION_LABELS[item.section]);
        const excessSections = nextRules
          .filter((item) => item.hasImage && item.maxImages !== null && sectionImageCount(item.section) > item.maxImages)
          .map((item) => `${IMAGE_SECTION_LABELS[item.section]} (maks. ${item.maxImages})`);
        templateChangeNotice = {
          previousId: activeTemplateId,
          previousSlug: previousTemplate?.slug ?? form.templateSlug,
          nextName: t.name,
          hiddenSections,
          requiredSections,
          excessSections
        };
      }
      activeTemplateId = t.id;
    }
  }

  async function cancelTemplateChange() {
    if (!templateChangeNotice) return;
    form.templateId = templateChangeNotice.previousId;
    form.templateSlug = templateChangeNotice.previousSlug;
    activeTemplateId = templateChangeNotice.previousId;
    await loadRules(activeTemplateId);
    templateChangeNotice = null;
  }

  // ── Tab helpers ──────────────────────────────────────────────────────────
  function isTabComplete(tabId: string): boolean {
    switch (tabId) {
      case 'basic': return !!form.templateId;
      case 'groom': return !!form.groom.name.trim();
      case 'bride': return !!form.bride.name.trim();
      case 'media': return form.cover.imageUrls.some(Boolean) || form.gallery.imageUrls.some(Boolean);
      case 'events': return form.events.length > 0;
      case 'story': return form.loveStories.length > 0;
      case 'closing': return true;
      default: return false;
    }
  }

  let completedCount = $derived(ALL_TABS.filter(t => isTabComplete(t.id)).length);
  let currentTabIndex = $derived(ALL_TABS.findIndex(t => t.id === activeTab));

  function goToNextTab() {
    if (currentTabIndex < ALL_TABS.length - 1) activeTab = ALL_TABS[currentTabIndex + 1].id;
  }
  function goToPreviousTab() {
    if (currentTabIndex > 0) activeTab = ALL_TABS[currentTabIndex - 1].id;
  }

  // ── Validation ───────────────────────────────────────────────────────────
  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.groom.name.trim()) errs.groomName = 'Nama mempelai pria wajib diisi';
    if (!form.groom.father.trim()) errs.groomFather = 'Nama ayah wajib diisi';
    if (!form.groom.mother.trim()) errs.groomMother = 'Nama ibu wajib diisi';
    if (!form.bride.name.trim()) errs.brideName = 'Nama mempelai wanita wajib diisi';
    if (!form.bride.father.trim()) errs.brideFather = 'Nama ayah wajib diisi';
    if (!form.bride.mother.trim()) errs.brideMother = 'Nama ibu wajib diisi';
    for (const templateRule of rules) {
      const minImages = templateRule.hasImage ? (templateRule.minImages ?? 0) : 0;
      if (minImages > sectionImageCount(templateRule.section)) {
        errs[`images-${templateRule.section}`] = `${IMAGE_SECTION_LABELS[templateRule.section]} minimal ${minImages} gambar`;
      }
    }
    formErrors = errs;
    if (Object.keys(errs).length) {
      const imageError = Object.values(errs).find((message) => message.includes('minimal'));
      if (imageError) submitError = imageError;

      if (errs.groomName || errs.groomFather || errs.groomMother) activeTab = 'groom';
      else if (errs.brideName || errs.brideFather || errs.brideMother) activeTab = 'bride';
      else {
        const imageSection = (Object.keys(IMAGE_SECTION_LABELS) as Section[]).find(
          (section) => errs[`images-${section}`]
        );
        if (imageSection === 'groom') activeTab = 'groom';
        else if (imageSection === 'bride') activeTab = 'bride';
        else if (imageSection === 'cover' || imageSection === 'quote' || imageSection === 'gallery') activeTab = 'media';
        else if (imageSection === 'events' || imageSection === 'gifts') activeTab = 'events';
        else if (imageSection === 'loveStory') activeTab = 'story';
        else if (imageSection === 'closing') activeTab = 'closing';
      }
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
      const res = await fetch(customerMode ? `${API}/customer/invitation` : `${API}/invitations/public/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(customerMode ? customerHeaders() : {}) },
        body: JSON.stringify({
          slug: form.slug,
          templateSlug: form.templateSlug,
          songUrl: form.songUrl,
          groom: { ...form.groom, notes: form.groom.notes || undefined, socialMedia: { instagram: form.groom.socialMedia.instagram || undefined, facebook: form.groom.socialMedia.facebook || undefined }, imageUrls: form.groom.imageUrls.filter(Boolean) },
          bride: { ...form.bride, notes: form.bride.notes || undefined, socialMedia: { instagram: form.bride.socialMedia.instagram || undefined, facebook: form.bride.socialMedia.facebook || undefined }, imageUrls: form.bride.imageUrls.filter(Boolean) },
          cover: { imageUrls: form.cover.imageUrls.filter(Boolean) },
          quote: { text: form.quote.text || undefined, source: form.quote.source || undefined, imageUrls: form.quote.imageUrls.filter(Boolean) },
          gallery: { imageUrls: form.gallery.imageUrls.filter(Boolean) },
          events: form.events.map((e: any) => ({ ...e, date: e.date ? new Date(`${e.date}T00:00:00.000Z`).toISOString() : e.date })),
          gifts: form.gifts,
          loveStories: form.loveStories.map((s: any) => ({ ...s, date: s.date ? new Date(`${s.date}T00:00:00.000Z`).toISOString() : s.date })),
          loveStoryVideos: form.loveStoryVideos.filter((v: any) => v.url),
          closing: { message: form.closing.message || undefined, imageUrls: form.closing.imageUrls.filter(Boolean) }
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Gagal menyimpan perubahan');
      submitSuccess = true;
      savedSnapshot = formSnapshot();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) { submitError = err.message; }
    finally { submitting = false; }
  }

  onMount(() => {
    loadTemplates();
    loadSongs();
    loadInvitation();
  });

</script>

<svelte:head><title>Edit Undangan — {slug}</title></svelte:head>

<div class="min-h-screen bg-gray-50 py-10">
  <div class="mx-auto max-w-6xl px-4">
    <div class="lg:flex lg:gap-6">
      <div class="flex-1 min-w-0">
    <div class="mb-8">
      <a
        href="/wedding/{slug}"
        class="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Lihat undangan
      </a>
      <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h1 class="text-2xl font-bold text-gray-900">Edit Undangan</h1>
        {#if savedSnapshot}
          <span class="inline-flex items-center gap-1.5 text-xs {hasUnsavedChanges ? 'text-amber-700' : 'text-green-700'}">
            <span class="h-1.5 w-1.5 rounded-full {hasUnsavedChanges ? 'bg-amber-500' : 'bg-green-500'}"></span>
            {hasUnsavedChanges ? 'Perubahan belum disimpan' : 'Semua perubahan tersimpan'}
          </span>
        {/if}
      </div>
      <p class="mt-1 text-sm text-gray-500">Perbarui data undangan pernikahan Anda.</p>
    </div>

    {#if templateChangeNotice}
      <div class="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
        <h2 class="font-semibold">Penyesuaian template: {templateChangeNotice.nextName}</h2>
        <p class="mt-1 leading-relaxed">Data Anda tidak akan dihapus. Template baru hanya dapat menyembunyikan section yang tidak digunakan.</p>
        {#if templateChangeNotice.hiddenSections.length}
          <p class="mt-3"><strong>Disimpan tetapi tidak tampil:</strong> {templateChangeNotice.hiddenSections.join(', ')}.</p>
        {/if}
        {#if templateChangeNotice.requiredSections.length}
          <p class="mt-2"><strong>Perlu dilengkapi sebelum disimpan:</strong> {templateChangeNotice.requiredSections.join(', ')}.</p>
        {/if}
        {#if templateChangeNotice.excessSections.length}
          <p class="mt-2"><strong>Perlu dirapikan:</strong> {templateChangeNotice.excessSections.join(', ')}. Data tetap disimpan sampai Anda memilih foto yang ingin dipakai.</p>
        {/if}
        {#if !templateChangeNotice.hiddenSections.length && !templateChangeNotice.requiredSections.length && !templateChangeNotice.excessSections.length}
          <p class="mt-3">Konten lama Anda kompatibel dengan template baru.</p>
        {/if}
        <div class="mt-4 flex flex-wrap gap-2">
          <button type="button" onclick={() => (templateChangeNotice = null)} class="rounded-lg bg-amber-900 px-4 py-2 text-xs font-semibold text-white">Lanjutkan</button>
          <button type="button" onclick={cancelTemplateChange} class="rounded-lg border border-amber-300 px-4 py-2 text-xs font-semibold text-amber-900">Batalkan ganti template</button>
        </div>
      </div>
    {/if}

    {#if Object.keys(formErrors).length}
      <div class="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
        <p class="font-semibold">Masih ada informasi yang perlu dilengkapi.</p>
        <p class="mt-1 text-xs text-red-700">Kami sudah membawamu ke bagian pertama yang perlu diperiksa.</p>
      </div>
    {/if}

    {#if loadingData}
      <div class="flex items-center justify-center gap-3 py-24 text-gray-400">
        <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        Memuat data undangan…
      </div>
    {:else if loadError}
      <div class="rounded-2xl bg-red-50 p-8 text-center">
        <p class="font-medium text-red-700">{loadError}</p>
        <button
          type="button"
          onclick={loadInvitation}
          class="mt-4 text-sm text-red-500 hover:underline"
        >
          Coba lagi
        </button>
      </div>
    {:else}
      {#if submitSuccess}
        <div class="mb-4 flex items-center gap-3 rounded-2xl bg-green-50 px-5 py-4 text-sm text-green-700 shadow-sm">
          <svg class="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span>Perubahan berhasil disimpan!</span>
          <a
            href="/wedding/{form.slug}"
            target="_blank"
            class="ml-auto font-medium underline hover:no-underline"
          >
            Lihat undangan ↗
          </a>
        </div>
      {/if}

      <div class="mb-4 rounded-2xl bg-white p-3 shadow-sm">
        <div class="mb-2 flex items-center gap-2">
          <span class="text-xs text-gray-500">
            {completedCount}/{ALL_TABS.length} selesai
          </span>
          <div class="h-1 flex-1 rounded-full bg-gray-100">
            <div
              class="h-1 rounded-full bg-green-500 transition-all"
              style="width: {(completedCount / ALL_TABS.length) * 100}%"
            ></div>
          </div>
        </div>
        <div class="flex overflow-x-auto gap-1">
          {#each ALL_TABS as tab}
            <button
              type="button"
              class="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium whitespace-nowrap transition {activeTab === tab.id
                ? 'bg-gray-900 text-white shadow'
                : 'text-gray-500 hover:bg-gray-100'}"
              onclick={() => (activeTab = tab.id)}
            >
              {#if isTabComplete(tab.id)}
                <svg class="h-3.5 w-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              {/if}
              {tab.label}
            </button>
          {/each}
        </div>
      </div>

      {#if activeTab === 'basic'}
        <div class="mb-4 rounded-2xl bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-base font-semibold text-gray-900">Informasi Dasar</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label for="slug" class="mb-1 block text-sm font-medium text-gray-700">Slug URL</label>
              <input
                id="slug"
                bind:value={form.slug}
                type="text"
                readonly
                class="w-full cursor-default rounded-xl border-0 bg-gray-100 px-3 py-2 text-sm text-gray-500 outline-none"
              />
              <p class="mt-1 text-xs text-gray-400">/wedding/{form.slug}</p>
            </div>
            <div class="sm:col-span-2">
              <p class="mb-1 text-sm font-medium text-gray-700">Template *</p>
              <p class="mb-3 text-xs text-gray-400">Pilih desain untuk undangan Anda. Foto dan data lama tetap aman saat berpindah template.</p>
              <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {#each templates as t}
                  <button
                    type="button"
                    onclick={() => {
                      if (form.templateId === t.id) return;
                      form.templateId = t.id;
                      onTemplateChange();
                    }}
                    class="group overflow-hidden rounded-xl border-2 text-left transition {form.templateId === t.id ? 'border-gray-900 bg-gray-50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-300'}"
                    aria-pressed={form.templateId === t.id}
                  >
                    <div class="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      {#if t.imageUrl}
                        <img src={t.imageUrl} alt="Preview template {t.name}" class="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                      {:else}
                        <div class="flex h-full items-center justify-center text-2xl font-semibold text-gray-300">{t.name.slice(0, 1)}</div>
                      {/if}
                      {#if form.templateId === t.id}
                        <span class="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs text-white">✓</span>
                      {/if}
                    </div>
                    <span class="block truncate px-3 py-2 text-sm font-medium text-gray-800">{t.name}</span>
                  </button>
                {/each}
              </div>
            </div>
            <div class="sm:col-span-2">
              <label for="song" class="mb-1 block text-sm font-medium text-gray-700">Lagu Latar (opsional)</label>
              <select
                id="song"
                bind:value={form.songUrl}
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
              >
                <option value="">— Tidak ada lagu —</option>
                {#each songs as s}
                  <option value={s.url}>{s.title}</option>
                {/each}
              </select>
            </div>
          </div>
        </div>
      {/if}

      {#if activeTab === 'groom'}
        {@const r = rule('groom')}
        <GroomForm
          bind:name={form.groom.name}
          bind:father={form.groom.father}
          bind:mother={form.groom.mother}
          bind:notes={form.groom.notes}
          bind:instagram={form.groom.socialMedia.instagram}
          bind:facebook={form.groom.socialMedia.facebook}
          bind:imageUrls={form.groom.imageUrls}
          maxImages={r?.maxImages ?? null}
          minImages={r?.minImages ?? null}
          multipleImage={r?.multipleImage ?? true}
          hasImage={r === null || r.hasImage || form.groom.imageUrls.some(Boolean)}
          bind:errors={groomErrors}
        />
      {/if}

      {#if activeTab === 'bride'}
        {@const r = rule('bride')}
        <BrideForm
          bind:name={form.bride.name}
          bind:father={form.bride.father}
          bind:mother={form.bride.mother}
          bind:notes={form.bride.notes}
          bind:instagram={form.bride.socialMedia.instagram}
          bind:facebook={form.bride.socialMedia.facebook}
          bind:imageUrls={form.bride.imageUrls}
          maxImages={r?.maxImages ?? null}
          minImages={r?.minImages ?? null}
          multipleImage={r?.multipleImage ?? true}
          hasImage={r === null || r.hasImage || form.bride.imageUrls.some(Boolean)}
          bind:errors={brideErrors}
        />
      {/if}

      {#if activeTab === 'media'}
        {@const coverRule = rule('cover')}
        {@const quoteRule = rule('quote')}
        {@const galleryRule = rule('gallery')}
        <MediaForm
          bind:coverImages={form.cover.imageUrls}
          bind:quoteText={form.quote.text}
          bind:quoteSource={form.quote.source}
          bind:quoteImages={form.quote.imageUrls}
          bind:galleryImages={form.gallery.imageUrls}
          coverMax={coverRule?.maxImages ?? null}
          coverMin={coverRule?.minImages ?? null}
          coverMultiple={coverRule?.multipleImage ?? true}
          quoteMax={quoteRule?.maxImages ?? null}
          quoteMin={quoteRule?.minImages ?? null}
          quoteMultiple={quoteRule?.multipleImage ?? true}
          galleryMax={galleryRule?.maxImages ?? null}
          galleryMin={galleryRule?.minImages ?? null}
          galleryMultiple={galleryRule?.multipleImage ?? true}
          hasCover={coverRule === null || coverRule.hasImage}
          hasQuote={quoteRule === null || quoteRule.hasImage}
          hasGallery={galleryRule === null || galleryRule.hasImage}
          bind:errors={mediaErrors}
        />
      {/if}

      {#if activeTab === 'events'}
        {@const eventsRule = rule('events')}
        {@const giftsRule = rule('gifts')}
        <EventsForm
          bind:events={form.events}
          maxImages={eventsRule?.maxImages ?? null}
          minImages={eventsRule?.minImages ?? null}
          multipleImage={eventsRule?.multipleImage ?? true}
          hasImages={eventsRule === null || eventsRule.hasImage}
        />
        <GiftsForm
          bind:gifts={form.gifts}
          maxImages={giftsRule?.maxImages ?? null}
          minImages={giftsRule?.minImages ?? null}
          multipleImage={giftsRule?.multipleImage ?? true}
          hasImages={giftsRule === null || giftsRule.hasImage}
        />
      {/if}

      {#if activeTab === 'story'}
        {@const loveStoryRule = rule('loveStory')}
        <LoveStoryForm
          bind:stories={form.loveStories}
          hasImage={loveStoryRule === null || loveStoryRule.hasImage}
          maxImages={loveStoryRule?.maxImages ?? null}
          minImages={loveStoryRule?.minImages ?? null}
        />
      {/if}

      {#if activeTab === 'closing'}
        {@const closingRule = rule('closing')}
        <ClosingForm
          bind:closingMessage={form.closing.message}
          bind:closingImages={form.closing.imageUrls}
          maxImages={closingRule?.maxImages ?? null}
          minImages={closingRule?.minImages ?? null}
          multipleImage={closingRule?.multipleImage ?? true}
          hasImage={closingRule === null || closingRule.hasImage}
        />
      {/if}

      <div class="mb-4 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
        <button
          type="button"
          onclick={goToPreviousTab}
          disabled={currentTabIndex === 0}
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Sebelumnya
        </button>
        <span class="text-xs text-gray-400">
          Tab {currentTabIndex + 1} dari {ALL_TABS.length}
        </span>
        <button
          type="button"
          onclick={goToNextTab}
          disabled={currentTabIndex === ALL_TABS.length - 1}
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Selanjutnya →
        </button>
      </div>

      <div class="rounded-2xl bg-white p-4 shadow-sm">
        {#if submitError}
          <div class="mb-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {submitError}
          </div>
        {/if}
        <div class="flex items-center justify-between gap-4">
          <div class="text-sm text-gray-500">
            Slug: <span class="font-mono font-medium text-gray-800">{form.slug}</span>
            {#if form.templateSlug}
              · <span class="capitalize">{form.templateSlug}</span>
            {/if}
          </div>
          <button
            type="button"
            onclick={handleSubmit}
            disabled={submitting || !form.groom.name || !form.bride.name}
            class="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? 'Menyimpan…' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    {/if}
      </div>
      <!-- Desktop layout: form + preview button -->
      <div class="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-3 mt-8">
        <p class="text-xs text-gray-400">Lihat hasil undanganmu</p>
        <button type="button" onclick={() => (showPreview = true)} class="rounded-lg border border-gray-300 px-5 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 hover:border-gray-400">
          👁 Preview Undangan
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Mobile preview button -->
<div class="lg:hidden fixed bottom-6 right-6 z-40">
  <button type="button" onclick={() => (showPreview = true)} aria-label="Preview undangan" class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition hover:bg-gray-800 active:scale-95">
    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
  </button>
</div>

<PreviewModal bind:open={showPreview} {form} templateSlug={templates.find(t => t.id === form.templateId)?.slug ?? ''} />
