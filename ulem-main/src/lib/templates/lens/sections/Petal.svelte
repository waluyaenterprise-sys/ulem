<script lang="ts">
  import FlowerIcon from './FlowerIcon.svelte';

  let petals: Array<{
    x: number;
    size: number;
    dur: number;
    delay: number;
    rot: number;
  }> = [];

  for (let i = 0; i < 15; i++) {
    petals.push({
      x: Math.random() * 100,
      size: 14 + Math.random() * 16,
      dur: 14 + Math.random() * 10,
      delay: Math.random() * 18,
      rot: Math.random() * 360,
    });
  }
</script>

<div class="petals-container pointer-events-none absolute inset-0 overflow-hidden">
  {#each petals as p}
    <div
      class="petal"
      style="
        left: {p.x}%;
        rotate: {p.rot}deg;
        animation-duration: {p.dur}s;
        animation-delay: {p.delay}s;
      "
    >
      <FlowerIcon size={p.size} opacity={0.35} />
    </div>
  {/each}
</div>

<style>
  .petals-container {
    z-index: 1;
  }

  .petal {
    position: absolute;
    top: -10%;
    will-change: transform, opacity;
    animation-name: petal-fall;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
    opacity: 0.06;
  }

  @keyframes petal-fall {
    0% {
      transform: translateY(-5vh) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 0.35;
    }
    33% {
      transform: translateY(33vh) translateX(20px);
    }
    50% {
      opacity: 0.25;
    }
    66% {
      transform: translateY(66vh) translateX(-15px);
    }
    90% {
      opacity: 0.15;
    }
    100% {
      transform: translateY(115vh) translateX(10px);
      opacity: 0;
    }
  }
</style>