<script lang="ts">
  import { quintOut } from 'svelte/easing';
  import { fade, scale, slide } from 'svelte/transition';

  export let invitation: any;

  const bankAccounts = (invitation.gifts || [])
    .filter((g: any) => g.type === 'bank' || g.type === 'eWallet')
    .map((g: any) => ({
      bank: g.name || g.platform || '',
      number: g.accountNumber || '',
      name: g.accountHolder || ''
    }));

  const physicalGift = (invitation.gifts || []).find((g: any) => g.type === 'physical');
  const giftAddress: string = physicalGift?.description || '';

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

  let showGiftInfo = false;

  function toggleGiftInfo() {
    showGiftInfo = !showGiftInfo;
  }
</script>

<section
  class="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden py-30"
>
  <img src="/assets/earth/cloud.svg" alt="" class="absolute -top-10" />
  <img src="/assets/earth/banana-leaf-2.svg" alt="" class="absolute -top-25 -left-15 scale-70" />
  <img src="/assets/earth/banana-leaf.svg" alt="" class="absolute -top-20 -right-20 scale-70" />

  <img src="/assets/earth/mountain.svg" alt="" class="absolute bottom-0 scale-105" />

  <div
    class="relative w-11/12 overflow-hidden rounded-4xl border-6 border-[#719F34] bg-white py-4 text-center text-4xl"
  >
    <div class="relative">
      <h1 class="font-script">Wedding Gift</h1>
      <p class="mt-6 text-base">
        Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih
        untuk kami, dapat melalui :
      </p>
      <button
        class="mt-4 rounded-full border border-[#719F34] px-6 py-3 text-sm font-medium text-[#719F34]
         transition-colors duration-200
         hover:bg-blue-50 active:bg-blue-100"
        on:click={toggleGiftInfo}
      >
        Click Here
      </button>
    </div>
  </div>
  {#if showGiftInfo && bankAccounts.length > 0}
    <div
      class="z-20 mt-8 w-10/12 space-y-4 font-jomolhari text-white"
      in:slide={{ duration: 400, easing: quintOut }}
      out:fade={{ duration: 200 }}
    >
      {#each bankAccounts as account}
        <div
          class="flex items-center justify-between
               gap-4 rounded-2xl border
               border-[#D6E3F3] bg-[#719F34] px-5 py-4"
          in:scale={{ start: 0.95, duration: 300, easing: quintOut }}
        >
          <div class="text-left">
            <p class="text-xs tracking-widest uppercase">{account.bank}</p>
            <p class="mt-1 text-base font-medium tracking-wide">
              {account.number}
            </p>
            <p class="mt-0.5 text-xs">a.n. {account.name}</p>
          </div>

          <button
            type="button"
            class="shrink-0 rounded-full
                 border border-[#EAF3FF]
                 px-4 py-1.5 text-xs font-medium
                 transition hover:bg-blue-50 active:bg-blue-100"
            on:click={() => copyToClipboard(account.number)}
          >
            Salin
          </button>
        </div>
      {/each}
    </div>
  {/if}

  {#if showGiftInfo && giftAddress}
    <div
      class="z-20 mt-10 w-10/12
             rounded-2xl border
             border-[#D6E3F3] bg-white/80 px-6 py-5 text-center font-jomolhari"
      in:fade={{ duration: 400 }}
      out:fade={{ duration: 200 }}
    >
      <p class="text-xs tracking-widest uppercase">Alamat Pengiriman Kado</p>

      <p class="mt-3 text-sm leading-relaxed" style="white-space: pre-line;">
        {giftAddress}
      </p>
    </div>
  {/if}
</section>
