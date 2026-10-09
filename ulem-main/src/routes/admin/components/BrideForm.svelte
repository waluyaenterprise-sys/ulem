<script lang="ts">
  import FormField from './FormField.svelte';
  import ImageUploader from './ImageUploader.svelte';

  let {
    name = $bindable(''),
    father = $bindable(''),
    mother = $bindable(''),
    notes = $bindable(''),
    instagram = $bindable(''),
    facebook = $bindable(''),
    imageUrls = $bindable([] as string[]),
    maxImages = null as number | null,
    minImages = null as number | null,
    multipleImage = true as boolean,
    hasImage = true,
    errors = $bindable({} as Record<string, string>)
  } = $props();

  let childNum = $state<number | null>(null);
  let siblingCount = $state<number | null>(null);
  let parsedNotes = $state(false);
  let childInfoTouched = $state(false);

  $effect(() => {
    if (parsedNotes || !notes) return;
    const match = notes.match(/Putri ke-(\d+) dari (\d+) bersaudara/i);
    if (match) {
      childNum = Number(match[1]);
      siblingCount = Number(match[2]);
    }
    parsedNotes = true;
  });

  $effect(() => {
    if (childNum != null && siblingCount != null) {
      notes = `Putri ke-${childNum} dari ${siblingCount} bersaudara`;
    } else if (childInfoTouched) {
      notes = '';
    }
  });

  function updateChildInfo(target: EventTarget | null, field: 'child' | 'siblings') {
    childInfoTouched = true;
    const value = (target as HTMLInputElement)?.value ?? '';
    const parsed = value === '' ? null : Number(value);
    if (field === 'child') childNum = parsed;
    else siblingCount = parsed;
  }

  function clearError(field: string) {
    if (errors[field]) {
      const { [field]: _, ...rest } = errors;
      errors = rest;
    }
  }
</script>

<div class="rounded-2xl bg-white p-6 shadow-sm">
  <h2 class="mb-4 text-base font-semibold text-gray-900">Mempelai Wanita</h2>
  <div class="grid gap-4 sm:grid-cols-2">
    <FormField id="bride-name" label="Nama Lengkap" required error={errors.name || ''}>
      <input
        id="bride-name"
        bind:value={name}
        type="text"
        placeholder="Nama lengkap"
        class="w-full rounded-xl border bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
        class:border-red-400={!!errors.name}
        oninput={() => clearError('name')}
      />
    </FormField>
    <FormField id="bride-father" label="Nama Ayah" required error={errors.father || ''}>
      <input
        id="bride-father"
        bind:value={father}
        type="text"
        placeholder="Nama ayah"
        class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
        class:border-red-400={!!errors.father}
        oninput={() => clearError('father')}
      />
    </FormField>
    <FormField id="bride-mother" label="Nama Ibu" required error={errors.mother || ''}>
      <input
        id="bride-mother"
        bind:value={mother}
        type="text"
        placeholder="Nama ibu"
        class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
        class:border-red-400={!!errors.mother}
        oninput={() => clearError('mother')}
      />
    </FormField>
    <div class="sm:col-span-2">
      <label class="mb-1 block text-sm font-medium text-gray-700">Putri ke- (opsional)</label>
      <div class="flex flex-wrap items-center gap-2">
        <input
          type="number"
          min="1"
          max="15"
          bind:value={childNum}
          oninput={(event) => updateChildInfo(event.currentTarget, 'child')}
          placeholder="1"
          class="w-16 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-center text-sm outline-none focus:border-gray-400"
        />
        <span class="text-sm text-gray-400">dari</span>
        <input
          type="number"
          min="1"
          max="15"
          bind:value={siblingCount}
          oninput={(event) => updateChildInfo(event.currentTarget, 'siblings')}
          placeholder="1"
          class="w-16 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-center text-sm outline-none focus:border-gray-400"
        />
        <span class="text-sm text-gray-400">bersaudara</span>
      </div>
    </div>
    <FormField id="bride-ig" label="Instagram (opsional)" error={errors.instagram || ''}>
      <input
        id="bride-ig"
        bind:value={instagram}
        type="text"
        placeholder="https://instagram.com/…"
        class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
      />
    </FormField>
    <FormField id="bride-fb" label="Facebook (opsional)" error={errors.facebook || ''}>
      <input
        id="bride-fb"
        bind:value={facebook}
        type="text"
        placeholder="https://facebook.com/…"
        class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
      />
    </FormField>
  </div>

  {#if hasImage}
    <div class="mt-4">
      <ImageUploader
        bind:images={imageUrls}
        folder="bride"
        {maxImages}
        {minImages}
        {multipleImage}
        label="Foto Profil"
      />
    </div>
  {/if}
</div>
