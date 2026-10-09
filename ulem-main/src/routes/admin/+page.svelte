<script lang="ts">
  import InvitationForm from './components/InvitationForm.svelte';
</script>

<svelte:head><title>Input Undangan — Admin</title></svelte:head>

<div class="mx-auto max-w-3xl">
  <div class="mb-6">
    <h1 class="text-xl font-semibold text-gray-900">Input Data Pengantin</h1>
    <p class="mt-1 text-sm text-gray-500">
      Isi semua bagian lalu submit untuk menyimpan ke database.
    </p>
  </div>

  <InvitationForm />
</div>
