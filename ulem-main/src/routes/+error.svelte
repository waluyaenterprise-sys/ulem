<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="flex min-h-svh w-full flex-col items-center justify-center px-6 text-center">
  <h1 class="font-heading text-8xl font-light tracking-tight text-gray-300">
    {$page.status}
  </h1>

  <div class="my-6 h-px w-16 bg-gray-200"></div>

  <h2 class="font-heading text-2xl text-gray-700">
    {$page.status === 404 ? 'Halaman Tidak Ditemukan' : 'Terjadi Kesalahan'}
  </h2>

  <p class="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">
    {#if $page.status === 404}
      Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
    {:else}
      Maaf, terjadi kesalahan. Silakan coba beberapa saat lagi.
    {/if}
  </p>

  <a
    href="/"
    class="mt-8 inline-block rounded-full border border-gray-300 px-8 py-3 text-sm tracking-wide text-gray-600 transition duration-200 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-800"
  >
    Kembali ke Beranda
  </a>
</div>
