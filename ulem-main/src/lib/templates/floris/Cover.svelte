<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';

  export let invitation: any;

  const brideName = (invitation.bride?.name || 'BRIDE').split(' ')[0];
  const groomName = (invitation.groom?.name || 'GROOM').split(' ')[0];
  const guestName = invitation.guestName || 'Tamu Undangan';
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 3.9, minRem: 2.1, endAt: 14 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 3.9, minRem: 2.1, endAt: 14 });
  const dispatch = createEventDispatcher();
  let shown = false;

  onMount(() => (shown = true));
</script>

{#if shown}
  <section class="floris-cover" in:fade={{ duration: 700 }}>
    <img class="top-floral" src="/images/floral/floral-top-new.png" alt="" in:fly={{ y: -25, duration: 800, easing: cubicOut }} />
    <img class="flower-spark" src="/images/watercolor/flower-1.png" alt="" in:fly={{ x: 24, y: -8, delay: 300, duration: 800, easing: cubicOut }} />
    <img class="bottom-floral" src="/images/floral/floral-top.png" alt="" in:fly={{ y: 30, delay: 150, duration: 850, easing: cubicOut }} />

    <div class="cover-content">
      <p class="eyebrow" in:fade={{ delay: 250, duration: 650 }}>The Wedding Of</p>
      <div class="names" in:fade={{ delay: 450, duration: 800 }}>
        <p style={groomNameStyle}>{groomName}</p>
        <span>&amp;</span>
        <p style={brideNameStyle}>{brideName}</p>
      </div>
      <div class="guest" in:fade={{ delay: 750, duration: 650 }}>
        <p>Kepada Yth.</p>
        <strong>{guestName}</strong>
      </div>
      <button in:fly={{ y: 12, delay: 950, duration: 550, easing: cubicOut }} on:click={() => dispatch('open')}>
        Buka Undangan
      </button>
    </div>
  </section>
{/if}

<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Great+Vibes&family=Montserrat:wght@400;500;600;700&display=swap');

  .floris-cover {
    position: relative;
    min-height: 100dvh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #fffdfd 0%, #fdf3f6 35%, #f5ece8 100%);
    color: #6f594d;
    font-family: 'Montserrat', sans-serif;
    isolation: isolate;
  }

  .floris-cover::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.36;
    background-image: radial-gradient(#e9d8d1 0.8px, transparent 0.8px);
    background-size: 13px 13px;
    z-index: -1;
  }

  .top-floral,
  .bottom-floral {
    position: absolute;
    left: 50%;
    width: min(115%, 580px);
    transform: translateX(-50%);
    z-index: 1;
    pointer-events: none;
    opacity: 0.92;
  }

  .top-floral { top: -10px; }
  .bottom-floral { bottom: -10px; }

  .flower-spark {
    position: absolute;
    z-index: 2;
    width: 64px;
    right: 10%;
    top: 18%;
    filter: drop-shadow(0 8px 18px rgba(180, 128, 116, 0.18));
    animation: flutter 4.2s ease-in-out infinite;
  }

  .cover-content {
    position: relative;
    z-index: 3;
    width: 100%;
    margin-top: 3.8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .eyebrow {
    margin: 0;
    font-size: 13px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #8c7168;
  }

  .names {
    margin-top: 1.1rem;
    line-height: 0.85;
    font-family: 'Great Vibes', cursive;
    color: #816159;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
  }

  .names p { margin: 0; }
  .names span {
    display: block;
    margin: 0.3rem 0 0.15rem;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem;
    font-style: italic;
    color: #a47e71;
  }

  .guest {
    margin-top: 2.5rem;
    font-size: 11px;
    line-height: 1.7;
    color: #7c6660;
  }

  .guest p { margin: 0; }
  .guest strong {
    display: block;
    margin-top: 0.2rem;
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #855d52;
  }

  button {
    margin-top: 1.8rem;
    border: 0;
    border-radius: 999px;
    padding: 0.78rem 1.5rem;
    background: linear-gradient(135deg, #b78066 0%, #d7a48a 100%);
    color: #fff;
    font: 600 11px 'Montserrat', sans-serif;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 14px 28px rgba(169, 120, 103, 0.24);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 32px rgba(169, 120, 103, 0.3);
  }

  @keyframes flutter {
    50% { transform: translateY(-10px) rotate(5deg); }
  }
</style>
