<script lang="ts">
  export let size: number = 32;
  export let opacity: number = 0.6;
  export let color: string = 'white';
</script>

<span class="flower-icon" style="color: {color}; opacity: {opacity}; width: {size}px; height: {size}px;">
  <svg
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    fill="currentColor"
  >
    <path d="M32,32 C20,20 22,4 32,4 C42,4 44,20 32,32Z" />
    <path d="M32,32 C20,20 22,4 32,4 C42,4 44,20 32,32Z" transform="rotate(72 32 32)" />
    <path d="M32,32 C20,20 22,4 32,4 C42,4 44,20 32,32Z" transform="rotate(144 32 32)" />
    <path d="M32,32 C20,20 22,4 32,4 C42,4 44,20 32,32Z" transform="rotate(216 32 32)" />
    <path d="M32,32 C20,20 22,4 32,4 C42,4 44,20 32,32Z" transform="rotate(288 32 32)" />
    <circle cx="32" cy="32" r="3.5" opacity="0.7" />
    <circle cx="32" cy="32" r="1.5" opacity="0.9" />
  </svg>
</span>

<style>
  .flower-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
</style>