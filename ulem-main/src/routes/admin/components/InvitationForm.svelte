<script lang="ts">
  import ImageUpload from './ImageUpload.svelte';
  import { authHeaders } from '$lib/auth';
  import { PUBLIC_API_URL } from '$env/static/public';

  interface Props {
    invitationId?: string;
    initialData?: Record<string, any>;
  }

  let { invitationId = undefined, initialData = undefined }: Props = $props();

  const CX = {
    card: 'mb-4 rounded-2xl bg-white p-6 shadow-sm',
    input:
      'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none',
    label: 'mb-1 block text-sm font-medium text-gray-700',
    sublabel: 'mb-2 text-sm font-medium text-gray-600',
    actionBtn:
      'rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50',
    addImgBtn:
      'flex h-24 w-24 items-center justify-center rounded-xl border border-dashed border-gray-300 text-2xl text-gray-400 transition hover:border-gray-400 hover:bg-gray-50',
    removeBtn: 'text-xs text-red-500 hover:underline'
  };

  interface PersonForm {
    name: string;
    father: string;
    mother: string;
    notes: string;
    socialMedia: { instagram: string; facebook: string };
    imageUrls: string[];
  }
  interface EventForm {
    type: 'akad' | 'reception' | 'other';
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    locationUrl: string;
    imageUrls: string[];
  }
  interface GiftForm {
    type: 'bank' | 'physical' | 'eWallet';
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

  function buildForm(d?: Record<string, any>) {
    const sm = (src: any) => ({
      instagram: src?.instagram ?? '',
      facebook: src?.facebook ?? ''
    });
    // Konversi UTC ISO ke WIB (UTC+7) untuk ditampilkan di datetime-local input
    const toDateLocalWIB = (iso?: string) => {
      if (!iso) return '';
      const wib = new Date(new Date(iso).getTime() + 7 * 60 * 60 * 1000);
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${wib.getUTCFullYear()}-${pad(wib.getUTCMonth() + 1)}-${pad(wib.getUTCDate())}T${pad(wib.getUTCHours())}:${pad(wib.getUTCMinutes())}`;
    };
    const toDateLocal = (iso?: string) => (iso ? new Date(iso).toISOString().slice(0, 16) : '');
    const toEventDateLocal = (event: any) => {
      const localDate = toDateLocalWIB(event?.date);
      if (!localDate) return '';
      const day = localDate.slice(0, 10);
      const time = event?.startTime || localDate.slice(11, 16) || '00:00';
      return `${day}T${time}`;
    };
    return {
      slug: d?.slug ?? '',
      templateSlug: d?.template?.slug ?? 'lumiere',
      songUrl: d?.songUrl ?? '',
      groom: {
        name: d?.groom?.name ?? '',
        father: d?.groom?.father ?? '',
        mother: d?.groom?.mother ?? '',
        notes: d?.groom?.notes ?? '',
        socialMedia: sm(d?.groom?.socialMedia),
        imageUrls: (d?.groom?.imageUrls ?? []) as string[]
      } as PersonForm,
      bride: {
        name: d?.bride?.name ?? '',
        father: d?.bride?.father ?? '',
        mother: d?.bride?.mother ?? '',
        notes: d?.bride?.notes ?? '',
        socialMedia: sm(d?.bride?.socialMedia),
        imageUrls: (d?.bride?.imageUrls ?? []) as string[]
      } as PersonForm,
      cover: { imageUrls: (d?.cover?.imageUrls ?? []) as string[] },
      quote: { text: d?.quote?.text ?? '', source: d?.quote?.source ?? '', imageUrls: (d?.quote?.imageUrls ?? []) as string[] },
      gallery: { imageUrls: (d?.gallery?.imageUrls ?? []) as string[] },
      events: (d?.events ?? []).map((e: any) => ({
        type: e.type,
        title: e.title,
        date: toEventDateLocal(e),
        startTime: e.startTime ?? '',
        endTime: e.endTime ?? '',
        location: e.location,
        locationUrl: e.locationUrl ?? '',
        imageUrls: e.imageUrls ?? []
      })) as EventForm[],
      gifts: (d?.gifts ?? []).map((g: any) => ({
        type: g.type,
        name: g.name ?? '',
        accountNumber: g.accountNumber ?? '',
        accountHolder: g.accountHolder ?? '',
        description: g.description ?? '',
        imageUrls: g.imageUrls ?? []
      })) as GiftForm[],
      loveStories: (d?.loveStories ?? []).map((s: any) => ({
        title: s.title,
        date: toDateLocal(s.date),
        description: s.description ?? '',
        imageUrl: s.imageUrl
      })) as LoveStoryForm[],
      loveStoryVideos: (d?.loveStoryVideos ?? []).map((v: any) => ({ url: v.url })) as {
        url: string;
      }[],
      closing: {
        message: d?.closing?.message ?? '',
        imageUrls: (d?.closing?.imageUrls ?? []) as string[]
      }
    };
  }

  let form = $state(buildForm(initialData));

  const parseChildInfo = (notes: string, label: 'Putra' | 'Putri') => {
    const match = notes.match(new RegExp(`${label} ke-(\\d+) dari (\\d+) bersaudara`, 'i'));
    return match ? { child: Number(match[1]), siblings: Number(match[2]) } : null;
  };
  const groomInfo = parseChildInfo(initialData?.groom?.notes ?? '', 'Putra');
  const brideInfo = parseChildInfo(initialData?.bride?.notes ?? '', 'Putri');
  let groomChildNum = $state<number | null>(groomInfo?.child ?? null);
  let groomSiblingCount = $state<number | null>(groomInfo?.siblings ?? null);
  let brideChildNum = $state<number | null>(brideInfo?.child ?? null);
  let brideSiblingCount = $state<number | null>(brideInfo?.siblings ?? null);
  let groomChildInfoTouched = $state(false);
  let brideChildInfoTouched = $state(false);

  type Tab = 'basic' | 'groom' | 'bride' | 'media' | 'events' | 'story' | 'closing';
  let activeTab = $state<Tab>('basic');
  const TABS: { id: Tab; label: string }[] = [
    { id: 'basic', label: 'Basic' },
    { id: 'groom', label: 'Mempelai Pria' },
    { id: 'bride', label: 'Mempelai Wanita' },
    { id: 'media', label: 'Media' },
    { id: 'events', label: 'Acara & Hadiah' },
    { id: 'story', label: 'Love Story' },
    { id: 'closing', label: 'Penutup' }
  ];
  interface Template {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string | null;
  }

  interface Song {
    id: string;
    title: string;
    url: string;
  }

  let templates = $state<Template[]>([]);
  let songs = $state<Song[]>([]);

  async function loadTemplates() {
    try {
      const res = await fetch(`${PUBLIC_API_URL}/templates`);
      if (res.ok) templates = await res.json();
    } catch {}
  }

  async function loadSongs() {
    try {
      const res = await fetch(`${PUBLIC_API_URL}/songs`);
      if (res.ok) songs = await res.json();
    } catch {}
  }

  loadTemplates();
  loadSongs();

  // Auto-format notes from number inputs
  $effect(() => {
    if (groomChildNum != null && groomSiblingCount != null) {
      form.groom.notes = `Putra ke-${groomChildNum} dari ${groomSiblingCount} bersaudara`;
    } else if (groomChildInfoTouched) {
      form.groom.notes = '';
    }
  });
  $effect(() => {
    if (brideChildNum != null && brideSiblingCount != null) {
      form.bride.notes = `Putri ke-${brideChildNum} dari ${brideSiblingCount} bersaudara`;
    } else if (brideChildInfoTouched) {
      form.bride.notes = '';
    }
  });

  function updateInvitationChildInfo(
    target: EventTarget | null,
    field: 'groomChild' | 'groomSiblings' | 'brideChild' | 'brideSiblings'
  ) {
    const value = (target as HTMLInputElement)?.value ?? '';
    const parsed = value === '' ? null : Number(value);
    if (field.startsWith('groom')) groomChildInfoTouched = true;
    else brideChildInfoTouched = true;
    if (field === 'groomChild') groomChildNum = parsed;
    if (field === 'groomSiblings') groomSiblingCount = parsed;
    if (field === 'brideChild') brideChildNum = parsed;
    if (field === 'brideSiblings') brideSiblingCount = parsed;
  }

  let submitting = $state(false);
  let submitError = $state('');
  let submitSuccess = $state('');

  async function handleSubmit() {
    submitting = true;
    submitError = '';
    submitSuccess = '';
    const isEdit = !!invitationId;
    try {
      const url = isEdit
        ? `${PUBLIC_API_URL}/invitations/${invitationId}`
        : `${PUBLIC_API_URL}/invitations`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
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
            // Store the calendar date separately; event hours use start/endTime.
            date: e.date ? new Date(`${e.date.slice(0, 10)}T00:00:00.000Z`).toISOString() : e.date,
            startTime: e.startTime || e.date?.slice(11, 16) || '',
            endTime: e.endTime || undefined
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
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.message ?? 'Gagal menyimpan');
      }
      const data = await res.json();
      submitSuccess = isEdit
        ? `Undangan berhasil diperbarui! Preview: /wedding/${data.slug}`
        : `Undangan berhasil dibuat! Preview: /wedding/${data.slug}`;
    } catch (err: any) {
      submitError = err.message;
    } finally {
      submitting = false;
    }
  }

  function addEvent() {
    form.events = [
      ...form.events,
      { type: 'akad', title: '', date: '', startTime: '', endTime: '', location: '', locationUrl: '', imageUrls: [] }
    ];
  }
  function removeEvent(i: number) {
    form.events = form.events.filter((_, x) => x !== i);
  }
  function addEventImage(ei: number) {
    form.events[ei].imageUrls = [...form.events[ei].imageUrls, ''];
    form.events = [...form.events];
  }
  function removeEventImage(ei: number, ii: number) {
    form.events[ei].imageUrls = form.events[ei].imageUrls.filter((_, x) => x !== ii);
    form.events = [...form.events];
  }

  function addGift(type: GiftForm['type']) {
    form.gifts = [
      ...form.gifts,
      { type, name: '', accountNumber: '', accountHolder: '', description: '', imageUrls: [] }
    ];
  }
  function removeGift(i: number) {
    form.gifts = form.gifts.filter((_, x) => x !== i);
  }
  function addGiftImage(gi: number) {
    form.gifts[gi].imageUrls = [...form.gifts[gi].imageUrls, ''];
    form.gifts = [...form.gifts];
  }
  function removeGiftImage(gi: number, ii: number) {
    form.gifts[gi].imageUrls = form.gifts[gi].imageUrls.filter((_, x) => x !== ii);
    form.gifts = [...form.gifts];
  }

  function addLoveStory() {
    form.loveStories = [
      ...form.loveStories,
      { title: '', date: '', description: '', imageUrl: '' }
    ];
  }
  function removeLoveStory(i: number) {
    form.loveStories = form.loveStories.filter((_, x) => x !== i);
  }
  function addVideo() {
    form.loveStoryVideos = [...form.loveStoryVideos, { url: '' }];
  }
  function removeVideo(i: number) {
    form.loveStoryVideos = form.loveStoryVideos.filter((_, x) => x !== i);
  }
</script>

<!-- Tab nav -->
<div class="mb-6 flex flex-wrap gap-1 rounded-2xl bg-white p-1.5 shadow-sm">
  {#each TABS as tab}
    <button
      type="button"
      class="rounded-xl px-4 py-1.5 text-sm font-medium transition {activeTab === tab.id
        ? 'bg-gray-900 text-white shadow'
        : 'text-gray-500 hover:bg-gray-100'}"
      onclick={() => (activeTab = tab.id)}>{tab.label}</button
    >
  {/each}
</div>

<!-- ═══════ BASIC ═══════ -->
{#if activeTab === 'basic'}
  <div class={CX.card}>
    <h2 class="mb-4 text-base font-semibold text-gray-900">Informasi Dasar</h2>
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="sm:col-span-2">
        <label for="slug" class={CX.label}>Slug *</label>
        <input
          id="slug"
          bind:value={form.slug}
          type="text"
          placeholder="mis. john-dan-jane"
          class={CX.input}
        />
        <p class="mt-1 text-xs text-gray-400">Dapat diakses di /wedding/{form.slug || '…'}</p>
      </div>
      <div>
        <label for="template" class={CX.label}>Template *</label>
        <select id="template" bind:value={form.templateSlug} class={CX.input}>
          {#each templates as t}
            <option value={t.slug}>{t.name}</option>
          {/each}
        </select>
      </div>
      <div>
        <label for="song" class={CX.label}>Lagu</label>
        <select id="song" bind:value={form.songUrl} class={CX.input}>
          <option value="">— Pilih lagu —</option>
          {#each songs as s}
            <option value={s.url}>{s.title}</option>
          {/each}
        </select>
        {#if songs.length === 0}
          <p class="mt-1 text-xs text-gray-400">
            Belum ada lagu. <a href="/admin/songs" class="underline">Upload lagu</a> terlebih dahulu.
          </p>
        {/if}
      </div>
    </div>
  </div>
{/if}

<!-- ═══════ GROOM ═══════ -->
{#if activeTab === 'groom'}
  <div class={CX.card}>
    <h2 class="mb-4 text-base font-semibold text-gray-900">Mempelai Pria</h2>
    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label for="groom-name" class={CX.label}>Nama Lengkap *</label>
        <input
          id="groom-name"
          bind:value={form.groom.name}
          type="text"
          placeholder="Nama lengkap"
          class={CX.input}
        />
      </div>
      <div>
        <label for="groom-father" class={CX.label}>Nama Ayah *</label>
        <input
          id="groom-father"
          bind:value={form.groom.father}
          type="text"
          placeholder="Nama ayah"
          class={CX.input}
        />
      </div>
      <div>
        <label for="groom-mother" class={CX.label}>Nama Ibu *</label>
        <input
          id="groom-mother"
          bind:value={form.groom.mother}
          type="text"
          placeholder="Nama ibu"
          class={CX.input}
        />
      </div>
      <div>
        <label class={CX.label}>Putra ke- (opsional)</label>
        <div class="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max="15"
            bind:value={groomChildNum}
            oninput={(event) => updateInvitationChildInfo(event.currentTarget, 'groomChild')}
            placeholder="1"
            class="w-16 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-center text-sm outline-none focus:border-gray-400"
          />
          <span class="text-sm text-gray-400">dari</span>
          <input
            type="number"
            min="1"
            max="15"
            bind:value={groomSiblingCount}
            oninput={(event) => updateInvitationChildInfo(event.currentTarget, 'groomSiblings')}
            placeholder="1"
            class="w-16 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-center text-sm outline-none focus:border-gray-400"
          />
          <span class="text-sm text-gray-400">bersaudara</span>
        </div>
      </div>
      <div>
        <label for="groom-ig" class={CX.label}>Instagram (opsional)</label>
        <input
          id="groom-ig"
          bind:value={form.groom.socialMedia.instagram}
          type="text"
          placeholder="https://instagram.com/…"
          class={CX.input}
        />
      </div>
      <div>
        <label for="groom-fb" class={CX.label}>Facebook (opsional)</label>
        <input
          id="groom-fb"
          bind:value={form.groom.socialMedia.facebook}
          type="text"
          placeholder="https://facebook.com/…"
          class={CX.input}
        />
      </div>
    </div>
    <div class="mt-4">
      <p class={CX.sublabel}>Foto Profil</p>
      <div class="flex flex-wrap gap-3">
        {#each form.groom.imageUrls as _, i}
          <div class="flex flex-col items-start gap-1">
            <ImageUpload folder="groom" bind:value={form.groom.imageUrls[i]} />
            <button
              type="button"
              onclick={() => {
                form.groom.imageUrls = form.groom.imageUrls.filter((_, x) => x !== i);
              }}
              class={CX.removeBtn}>Hapus</button
            >
          </div>
        {/each}
        <button
          type="button"
          onclick={() => {
            form.groom.imageUrls = [...form.groom.imageUrls, ''];
          }}
          class={CX.addImgBtn}>+</button
        >
      </div>
    </div>
  </div>
{/if}

<!-- ═══════ BRIDE ═══════ -->
{#if activeTab === 'bride'}
  <div class={CX.card}>
    <h2 class="mb-4 text-base font-semibold text-gray-900">Mempelai Wanita</h2>
    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label for="bride-name" class={CX.label}>Nama Lengkap *</label>
        <input
          id="bride-name"
          bind:value={form.bride.name}
          type="text"
          placeholder="Nama lengkap"
          class={CX.input}
        />
      </div>
      <div>
        <label for="bride-father" class={CX.label}>Nama Ayah *</label>
        <input
          id="bride-father"
          bind:value={form.bride.father}
          type="text"
          placeholder="Nama ayah"
          class={CX.input}
        />
      </div>
      <div>
        <label for="bride-mother" class={CX.label}>Nama Ibu *</label>
        <input
          id="bride-mother"
          bind:value={form.bride.mother}
          type="text"
          placeholder="Nama ibu"
          class={CX.input}
        />
      </div>
      <div>
        <label class={CX.label}>Putri ke- (opsional)</label>
        <div class="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max="15"
            bind:value={brideChildNum}
            oninput={(event) => updateInvitationChildInfo(event.currentTarget, 'brideChild')}
            placeholder="1"
            class="w-16 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-center text-sm outline-none focus:border-gray-400"
          />
          <span class="text-sm text-gray-400">dari</span>
          <input
            type="number"
            min="1"
            max="15"
            bind:value={brideSiblingCount}
            oninput={(event) => updateInvitationChildInfo(event.currentTarget, 'brideSiblings')}
            placeholder="1"
            class="w-16 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-center text-sm outline-none focus:border-gray-400"
          />
          <span class="text-sm text-gray-400">bersaudara</span>
        </div>
      </div>
      <div>
        <label for="bride-ig" class={CX.label}>Instagram (opsional)</label>
        <input
          id="bride-ig"
          bind:value={form.bride.socialMedia.instagram}
          type="text"
          placeholder="https://instagram.com/…"
          class={CX.input}
        />
      </div>
      <div>
        <label for="bride-fb" class={CX.label}>Facebook (opsional)</label>
        <input
          id="bride-fb"
          bind:value={form.bride.socialMedia.facebook}
          type="text"
          placeholder="https://facebook.com/…"
          class={CX.input}
        />
      </div>
    </div>
    <div class="mt-4">
      <p class={CX.sublabel}>Foto Profil</p>
      <div class="flex flex-wrap gap-3">
        {#each form.bride.imageUrls as _, i}
          <div class="flex flex-col items-start gap-1">
            <ImageUpload folder="bride" bind:value={form.bride.imageUrls[i]} />
            <button
              type="button"
              onclick={() => {
                form.bride.imageUrls = form.bride.imageUrls.filter((_, x) => x !== i);
              }}
              class={CX.removeBtn}>Hapus</button
            >
          </div>
        {/each}
        <button
          type="button"
          onclick={() => {
            form.bride.imageUrls = [...form.bride.imageUrls, ''];
          }}
          class={CX.addImgBtn}>+</button
        >
      </div>
    </div>
  </div>
{/if}

<!-- ═══════ MEDIA ═══════ -->
{#if activeTab === 'media'}
  <div class={CX.card}>
    <h2 class="mb-3 text-base font-semibold text-gray-900">Cover</h2>
    <div class="flex flex-wrap gap-3">
      {#each form.cover.imageUrls as _, i}
        <div class="flex flex-col items-start gap-1">
          <ImageUpload folder="cover" bind:value={form.cover.imageUrls[i]} />
          <button
            type="button"
            onclick={() => {
              form.cover.imageUrls = form.cover.imageUrls.filter((_, x) => x !== i);
            }}
            class={CX.removeBtn}>Hapus</button
          >
        </div>
      {/each}
      <button
        type="button"
        onclick={() => {
          form.cover.imageUrls = [...form.cover.imageUrls, ''];
        }}
        class={CX.addImgBtn}>+</button
      >
    </div>
  </div>

  <div class={CX.card}>
    <h2 class="mb-3 text-base font-semibold text-gray-900">Quote</h2>
    <div class="mb-4">
      <label for="quote-text" class={CX.label}>Teks Quote (opsional)</label>
      <textarea
        id="quote-text"
        bind:value={form.quote.text}
        rows="3"
        placeholder="Ayat atau kata-kata bermakna…"
        class={CX.input}
      ></textarea>
      <label for="quote-source" class={CX.label}>Pengutip / Sumber Quote (opsional)</label>
      <input id="quote-source" bind:value={form.quote.source} type="text" placeholder="Contoh: QS. Ar-Rum: 21 atau Rumi" class={CX.input} />
    </div>
    <p class={CX.sublabel}>Gambar Quote</p>
    <div class="flex flex-wrap gap-3">
      {#each form.quote.imageUrls as _, i}
        <div class="flex flex-col items-start gap-1">
          <ImageUpload folder="quote" bind:value={form.quote.imageUrls[i]} />
          <button
            type="button"
            onclick={() => {
              form.quote.imageUrls = form.quote.imageUrls.filter((_, x) => x !== i);
            }}
            class={CX.removeBtn}>Hapus</button
          >
        </div>
      {/each}
      <button
        type="button"
        onclick={() => {
          form.quote.imageUrls = [...form.quote.imageUrls, ''];
        }}
        class={CX.addImgBtn}>+</button
      >
    </div>
  </div>

  <div class={CX.card}>
    <h2 class="mb-3 text-base font-semibold text-gray-900">Galeri</h2>
    <div class="flex flex-wrap gap-3">
      {#each form.gallery.imageUrls as _, i}
        <div class="flex flex-col items-start gap-1">
          <ImageUpload folder="gallery" bind:value={form.gallery.imageUrls[i]} />
          <button
            type="button"
            onclick={() => {
              form.gallery.imageUrls = form.gallery.imageUrls.filter((_, x) => x !== i);
            }}
            class={CX.removeBtn}>Hapus</button
          >
        </div>
      {/each}
      <button
        type="button"
        onclick={() => {
          form.gallery.imageUrls = [...form.gallery.imageUrls, ''];
        }}
        class={CX.addImgBtn}>+</button
      >
    </div>
  </div>
{/if}

<!-- ═══════ EVENTS & GIFTS ═══════ -->
{#if activeTab === 'events'}
  <div class={CX.card}>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-base font-semibold text-gray-900">Acara</h2>
      <button type="button" onclick={addEvent} class={CX.actionBtn}>+ Tambah Acara</button>
    </div>
    {#if form.events.length === 0}
      <p class="text-sm text-gray-400">Belum ada acara. Tambahkan akad nikah dan resepsi.</p>
    {/if}
    {#each form.events as event, i}
      <div class="mb-4 rounded-xl border border-gray-200 p-4">
        <div class="mb-3 flex items-center justify-between">
          <span class="text-sm font-semibold text-gray-700">Acara {i + 1}</span>
          <button type="button" onclick={() => removeEvent(i)} class={CX.removeBtn}>Hapus</button>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <label for="ev-type-{i}" class={CX.label}>Jenis</label>
            <select id="ev-type-{i}" bind:value={event.type} class={CX.input}>
              <option value="akad">Akad Nikah</option>
              <option value="reception">Resepsi</option>
              <option value="other">Lainnya</option>
            </select>
          </div>
          <div>
            <label for="ev-title-{i}" class={CX.label}>Judul</label>
            <input
              id="ev-title-{i}"
              bind:value={event.title}
              type="text"
              placeholder="mis. Akad Nikah"
              class={CX.input}
            />
          </div>
          <div>
            <label for="ev-date-{i}" class={CX.label}>Tanggal & Waktu *</label>
            <input
              id="ev-date-{i}"
              bind:value={event.date}
              type="datetime-local"
              class={CX.input}
            />
          </div>
          <div>
            <label for="ev-loc-{i}" class={CX.label}>Lokasi *</label>
            <input
              id="ev-loc-{i}"
              bind:value={event.location}
              type="text"
              placeholder="Nama & alamat venue"
              class={CX.input}
            />
          </div>
          <div class="sm:col-span-2">
            <label for="ev-url-{i}" class={CX.label}>URL Google Maps (opsional)</label>
            <input
              id="ev-url-{i}"
              bind:value={event.locationUrl}
              type="text"
              placeholder="https://goo.gl/maps/…"
              class={CX.input}
            />
          </div>
        </div>
        <div class="mt-3">
          <p class={CX.sublabel}>Foto Acara</p>
          <div class="flex flex-wrap gap-3">
            {#each event.imageUrls as _, ii}
              <div class="flex flex-col items-start gap-1">
                <ImageUpload folder="events" bind:value={form.events[i].imageUrls[ii]} />
                <button type="button" onclick={() => removeEventImage(i, ii)} class={CX.removeBtn}
                  >Hapus</button
                >
              </div>
            {/each}
            <button type="button" onclick={() => addEventImage(i)} class={CX.addImgBtn}>+</button>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <div class={CX.card}>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-base font-semibold text-gray-900">Hadiah</h2>
      <div class="flex gap-2">
        <button type="button" onclick={() => addGift('bank')} class={CX.actionBtn}>+ Bank</button>
        <button type="button" onclick={() => addGift('eWallet')} class={CX.actionBtn}
          >+ eWallet</button
        >
        <button type="button" onclick={() => addGift('physical')} class={CX.actionBtn}
          >+ Fisik</button
        >
      </div>
    </div>
    {#if form.gifts.length === 0}
      <p class="text-sm text-gray-400">
        Belum ada hadiah. Tambahkan rekening bank atau alamat pengiriman.
      </p>
    {/if}
    {#each form.gifts as gift, i}
      <div class="mb-4 rounded-xl border border-gray-200 p-4">
        <div class="mb-3 flex items-center justify-between">
          <span
            class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 capitalize"
            >{gift.type}</span
          >
          <button type="button" onclick={() => removeGift(i)} class={CX.removeBtn}>Hapus</button>
        </div>
        {#if gift.type === 'bank' || gift.type === 'eWallet'}
          <div class="grid gap-3 sm:grid-cols-3">
            <div>
              <label for="gift-name-{i}" class={CX.label}
                >{gift.type === 'bank' ? 'Nama Bank' : 'Platform'}</label
              >
              <input
                id="gift-name-{i}"
                bind:value={gift.name}
                type="text"
                placeholder={gift.type === 'bank' ? 'mis. BCA' : 'mis. GoPay'}
                class={CX.input}
              />
            </div>
            <div>
              <label for="gift-num-{i}" class={CX.label}>Nomor Rekening</label>
              <input
                id="gift-num-{i}"
                bind:value={gift.accountNumber}
                type="text"
                placeholder="0123456789"
                class={CX.input}
              />
            </div>
            <div>
              <label for="gift-holder-{i}" class={CX.label}>Atas Nama</label>
              <input
                id="gift-holder-{i}"
                bind:value={gift.accountHolder}
                type="text"
                placeholder="Nama pemilik rekening"
                class={CX.input}
              />
            </div>
          </div>
        {:else}
          <div class="mb-3">
            <label for="gift-desc-{i}" class={CX.label}>Deskripsi / Alamat</label>
            <textarea
              id="gift-desc-{i}"
              bind:value={gift.description}
              rows="3"
              placeholder="Alamat pengiriman hadiah…"
              class={CX.input}
            ></textarea>
          </div>
          <p class={CX.sublabel}>Gambar (opsional)</p>
          <div class="flex flex-wrap gap-3">
            {#each gift.imageUrls as _, ii}
              <div class="flex flex-col items-start gap-1">
                <ImageUpload folder="gifts" bind:value={form.gifts[i].imageUrls[ii]} />
                <button type="button" onclick={() => removeGiftImage(i, ii)} class={CX.removeBtn}
                  >Hapus</button
                >
              </div>
            {/each}
            <button type="button" onclick={() => addGiftImage(i)} class={CX.addImgBtn}>+</button>
          </div>
        {/if}
      </div>
    {/each}
  </div>
{/if}

<!-- ═══════ LOVE STORY ═══════ -->
{#if activeTab === 'story'}
  <div class={CX.card}>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-base font-semibold text-gray-900">Love Story</h2>
      <button type="button" onclick={addLoveStory} class={CX.actionBtn}>+ Tambah Cerita</button>
    </div>
    {#if form.loveStories.length === 0}
      <p class="text-sm text-gray-400">Belum ada cerita.</p>
    {/if}
    {#each form.loveStories as story, i}
      <div class="mb-4 rounded-xl border border-gray-200 p-4">
        <div class="mb-3 flex items-center justify-between">
          <span class="text-sm font-semibold text-gray-700">Cerita {i + 1}</span>
          <button type="button" onclick={() => removeLoveStory(i)} class={CX.removeBtn}
            >Hapus</button
          >
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <label for="st-title-{i}" class={CX.label}>Judul *</label>
            <input
              id="st-title-{i}"
              bind:value={story.title}
              type="text"
              placeholder="mis. Pertemuan Pertama"
              class={CX.input}
            />
          </div>
          <div>
            <label for="st-date-{i}" class={CX.label}>Tanggal *</label>
            <input id="st-date-{i}" bind:value={story.date} type="date" class={CX.input} />
          </div>
          <div class="sm:col-span-2">
            <label for="st-desc-{i}" class={CX.label}>Cerita</label>
            <textarea
              id="st-desc-{i}"
              bind:value={story.description}
              rows="3"
              placeholder="Ceritakan kisahnya…"
              class={CX.input}
            ></textarea>
          </div>
        </div>
        <div class="mt-3">
          <p class={CX.sublabel}>Foto *</p>
          <ImageUpload folder="stories" bind:value={form.loveStories[i].imageUrl} />
        </div>
      </div>
    {/each}
  </div>

  <div class={CX.card}>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-base font-semibold text-gray-900">Video Love Story</h2>
      <button type="button" onclick={addVideo} class={CX.actionBtn}>+ Tambah Video</button>
    </div>
    {#if form.loveStoryVideos.length === 0}
      <p class="text-sm text-gray-400">Belum ada video.</p>
    {/if}
    {#each form.loveStoryVideos as video, i}
      <div class="mb-3 flex items-center gap-3">
        <label for="vid-{i}" class="sr-only">URL Video {i + 1}</label>
        <input
          id="vid-{i}"
          bind:value={video.url}
          type="text"
          placeholder="https://youtube.com/embed/…"
          class="{CX.input} flex-1"
        />
        <button type="button" onclick={() => removeVideo(i)} class={CX.removeBtn}>Hapus</button>
      </div>
    {/each}
  </div>
{/if}

<!-- ═══════ CLOSING ═══════ -->
{#if activeTab === 'closing'}
  <div class={CX.card}>
    <h2 class="mb-4 text-base font-semibold text-gray-900">Penutup</h2>
    <div class="mb-4">
      <label for="closing-msg" class={CX.label}>Pesan (opsional)</label>
      <textarea
        id="closing-msg"
        bind:value={form.closing.message}
        rows="4"
        placeholder="Terima kasih telah menjadi bagian dari hari istimewa kami…"
        class={CX.input}
      ></textarea>
    </div>
    <p class={CX.sublabel}>Gambar Latar</p>
    <div class="flex flex-wrap gap-3">
      {#each form.closing.imageUrls as _, i}
        <div class="flex flex-col items-start gap-1">
          <ImageUpload folder="closing" bind:value={form.closing.imageUrls[i]} />
          <button
            type="button"
            onclick={() => {
              form.closing.imageUrls = form.closing.imageUrls.filter((_, x) => x !== i);
            }}
            class={CX.removeBtn}>Hapus</button
          >
        </div>
      {/each}
      <button
        type="button"
        onclick={() => {
          form.closing.imageUrls = [...form.closing.imageUrls, ''];
        }}
        class={CX.addImgBtn}>+</button
      >
    </div>
  </div>
{/if}

<!-- ═══════ SUBMIT BAR ═══════ -->
<div class="mt-2 rounded-2xl bg-white p-4 shadow-sm">
  {#if submitError}
    <div class="mb-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{submitError}</div>
  {/if}
  {#if submitSuccess}
    <div class="mb-3 rounded-xl bg-green-50 px-4 py-2.5 text-sm text-green-700">
      {submitSuccess}
    </div>
  {/if}
  <div class="flex items-center justify-between gap-4">
    <div class="text-sm text-gray-500">
      Slug: <span class="font-mono font-medium text-gray-800">{form.slug || '—'}</span>
      · <span class="capitalize">{form.templateSlug}</span>
    </div>
    <button
      type="button"
      onclick={handleSubmit}
      disabled={submitting || !form.slug || !form.groom.name || !form.bride.name}
      class="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {submitting ? 'Menyimpan…' : invitationId ? 'Simpan Perubahan' : 'Buat Undangan'}
    </button>
  </div>
</div>
