<script lang="ts">
  import { onMount } from 'svelte';
  import { fetchRsvps, formatRsvpTime, type Rsvp } from '$lib/rsvp';

  export let invitation: any;

  let responses: Rsvp[] = [];
  let page = 1;
  const limit = 10;

  $: paged = responses.slice((page - 1) * limit, page * limit);
  $: totalPage = Math.max(1, Math.ceil(responses.length / limit));

  onMount(async () => {
    if (invitation?.slug) {
      responses = await fetchRsvps(invitation.slug);
    }
  });
</script>

<!-- Ucapan & Doa -->
<section class="relative bg-[#f0f1ec] py-20">
  <div
    class="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[24px_24px] opacity-30"
  ></div>
  <div class="relative z-10 mx-auto max-w-lg px-5">
    <div class="rounded-2xl bg-white p-6 shadow-sm">
      <h2 class="mb-2 text-center font-script text-4xl">Ucapan & Doa</h2>

      <p class="mb-10 text-center text-sm text-gray-600">
        Doa dan harapan terbaik dari keluarga dan sahabat
      </p>

      <!-- List Ucapan -->
      <div class="space-y-6">
        {#each paged as r (r.id)}
          <div class="border-b border-gray-200 pb-4 last:border-b-0">
            <p class="mb-1 text-sm font-medium text-gray-800">
              {r.name}
            </p>
            {#if r.message}
              <p class="text-sm leading-relaxed text-gray-600">
                {r.message}
              </p>
            {/if}
            <p class="mt-0.5 text-[10px] text-gray-400">{formatRsvpTime(r.createdAt)}</p>
          </div>
        {/each}
        {#if responses.length === 0}
          <p class="text-center text-sm text-gray-400">Belum ada ucapan.</p>
        {/if}
      </div>

      <!-- Pagination -->
      <div class="mt-8 flex items-center justify-between text-sm">
        <button
          class="rounded-full border border-gray-300 px-4 py-2 text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
          disabled={page === 1}
          on:click={() => page--}
        >
          Sebelumnya
        </button>

        <span class="text-gray-500">
          Halaman {page} / {totalPage}
        </span>

        <button
          class="rounded-full border border-gray-300 px-4 py-2 text-gray-600 transition hover:bg-gray-100 disabled:opacity-40"
          disabled={page >= totalPage}
          on:click={() => page++}
        >
          Selanjutnya
        </button>
      </div>
    </div>
  </div>
</section>
