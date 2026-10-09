<script lang="ts">
  import ImageUploader from './ImageUploader.svelte';

  interface GiftItem {
    type: 'bank' | 'eWallet' | 'physical';
    name: string;
    accountNumber: string;
    accountHolder: string;
    description: string;
    imageUrls: string[];
  }

  let {
    gifts = $bindable([] as GiftItem[]),
    maxImages = null as number | null,
    minImages = null as number | null,
    multipleImage = true as boolean,
    hasImages = true
  } = $props();

  function addGift(type: GiftItem['type']) {
    gifts = [
      ...gifts,
      { type, name: '', accountNumber: '', accountHolder: '', description: '', imageUrls: [] }
    ];
  }

  function removeGift(i: number) {
    if (confirm('Hapus hadiah ini?')) {
      gifts = gifts.filter((_, x) => x !== i);
    }
  }
</script>

<div class="mb-4 rounded-2xl bg-white p-6 shadow-sm">
  <div class="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
    <h2 class="text-base font-semibold text-gray-900">Hadiah</h2>
    <div class="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto">
      <button
        type="button"
        onclick={() => addGift('bank')}
        class="rounded-lg border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 sm:px-3 sm:py-1.5"
        >+ Bank</button
      >
      <button
        type="button"
        onclick={() => addGift('eWallet')}
        class="rounded-lg border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 sm:px-3 sm:py-1.5"
        >+ eWallet</button
      >
      <button
        type="button"
        onclick={() => addGift('physical')}
        class="rounded-lg border border-gray-300 px-2 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 sm:px-3 sm:py-1.5"
        >+ Fisik</button
      >
    </div>
  </div>
  {#if gifts.length === 0}
    <p class="text-sm text-gray-400">
      Belum ada hadiah. Tambahkan rekening bank atau alamat pengiriman.
    </p>
  {/if}
  {#each gifts as gift, i}
    <div class="mb-4 rounded-xl border border-gray-200 p-4">
      <div class="mb-3 flex items-center justify-between">
        <span
          class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 capitalize"
          >{gift.type}</span
        >
        <button
          type="button"
          onclick={() => removeGift(i)}
          class="text-xs text-red-500 hover:underline">Hapus</button
        >
      </div>
      {#if gift.type === 'bank' || gift.type === 'eWallet'}
        <div class="grid gap-3 sm:grid-cols-3">
          <div>
            <label for="gift-name-{i}" class="mb-1 block text-sm font-medium text-gray-700"
              >{gift.type === 'bank' ? 'Nama Bank' : 'Platform'}</label
            >
            <input
              id="gift-name-{i}"
              bind:value={gift.name}
              type="text"
              placeholder={gift.type === 'bank' ? 'mis. BCA' : 'mis. GoPay'}
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label for="gift-num-{i}" class="mb-1 block text-sm font-medium text-gray-700"
              >Nomor Rekening</label
            >
            <input
              id="gift-num-{i}"
              bind:value={gift.accountNumber}
              type="text"
              placeholder="0123456789"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label for="gift-holder-{i}" class="mb-1 block text-sm font-medium text-gray-700"
              >Atas Nama</label
            >
            <input
              id="gift-holder-{i}"
              bind:value={gift.accountHolder}
              type="text"
              placeholder="Nama pemilik rekening"
              class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      {:else}
        <div class="mb-3">
          <label for="gift-desc-{i}" class="mb-1 block text-sm font-medium text-gray-700"
            >Deskripsi / Alamat</label
          >
          <textarea
            id="gift-desc-{i}"
            bind:value={gift.description}
            rows="3"
            placeholder="Alamat pengiriman hadiah…"
            class="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition focus:border-gray-400 focus:bg-white focus:outline-none"
          ></textarea>
        </div>
        {#if hasImages}
          <div class="mt-3">
            <ImageUploader
              bind:images={gift.imageUrls}
              folder="gifts"
              maxImages={maxImages ?? undefined}
              minImages={minImages ?? undefined}
              multipleImage={multipleImage ?? undefined}
              label="Gambar (opsional)"
            />
          </div>
        {/if}
      {/if}
    </div>
  {/each}
</div>
