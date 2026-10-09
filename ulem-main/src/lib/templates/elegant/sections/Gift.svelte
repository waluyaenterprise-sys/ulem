<script lang="ts">
  // Props
  export let invitation;
  // ambil semua gift
  const gifts = invitation?.gifts ?? [];

  // filter berdasarkan type
  const bankAccounts = gifts.filter((g: any) => g.type === 'bank');
  const physicalGifts = gifts.filter((g: any) => g.type === 'physical');

  // Fungsi salin ke clipboard
  function copyToClipboard(text: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch((err) => {
        console.warn('Gagal menyalin:', err);
        // Fallback jika clipboard tidak didukung
        fallbackCopyTextToClipboard(text);
      });
    } else {
      fallbackCopyTextToClipboard(text);
    }
  }

  // Fallback untuk browser lama
  function fallbackCopyTextToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.warn('Fallback copy gagal:', err);
    }
    document.body.removeChild(textArea);
  }
</script>

<!-- Wedding Gift -->
<section class="relative overflow-hidden bg-[#f0f1ec] py-20">
  <div class="absolute inset-0 flex">
    <div class="flex-1 bg-[#e2dfd8]"></div>
    <div class="flex-1 bg-[#d8d5ce]"></div>
  </div>
  <div class="relative z-10 mx-auto max-w-lg px-5">
    <div class="rounded-2xl bg-white p-6 shadow-sm">
      <h2 class="mb-2 text-center font-script text-4xl">Wedding Gift</h2>

      <p class="mb-10 text-center text-sm leading-relaxed text-gray-600">
        Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun apabila berkenan
        memberikan tanda kasih, dapat melalui informasi berikut:
      </p>

      <!-- Rekening Dinamis -->
      {#if bankAccounts.length > 0}
        <div class="space-y-5">
          {#each bankAccounts as account}
            <div
              class="flex items-center justify-between rounded-xl border border-gray-200 bg-[#f9f9f6] px-5 py-4"
            >
              <div>
                <p class="text-sm font-medium tracking-wide text-gray-800">{account.bank}</p>
                <p class="mt-1 text-sm text-gray-600">{account.number}</p>
                <p class="text-xs text-gray-400">a.n. {account.name}</p>
              </div>

              <button
                type="button"
                class="rounded-full border border-gray-300 px-4 py-1.5 text-xs text-gray-600 transition hover:bg-gray-100"
                on:click={() => copyToClipboard(account.number)}
              >
                Salin
              </button>
            </div>
          {/each}
        </div>
      {/if}

      <!-- Divider hanya muncul jika ada rekening DAN alamat -->
      {#if bankAccounts.length > 0 && physicalGifts}
        <div class="my-10 h-px bg-gray-200"></div>
      {/if}

      <!-- Alamat Kado -->
      {#if physicalGifts}
        <div class="text-center">
          <p class="mb-2 text-sm tracking-wide text-gray-700">Alamat Pengiriman Kado</p>
          <p class="text-sm leading-relaxed text-gray-600" style="white-space: pre-line;">
            {physicalGifts.map((g: any) => `${g.name}\n${g.address}`).join('\n\n')}
          </p>
        </div>
      {/if}
    </div>
  </div>
</section>
