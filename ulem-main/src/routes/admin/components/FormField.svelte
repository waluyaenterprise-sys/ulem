<script lang="ts">
  let { 
    id,
    label,
    error = '',
    required = false,
    children
  } = $props();
</script>

<div>
  <label for={id} class="mb-1 block text-sm font-medium text-gray-700">
    {label}{#if required} <span class="text-red-500">*</span>{/if}
  </label>
  {@render children()}
  {#if error}
    <p class="mt-1 text-xs text-red-500">{error}</p>
  {/if}
</div>
