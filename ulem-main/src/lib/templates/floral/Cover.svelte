<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { getAdaptiveNameStyle } from '$lib/utils/adaptiveName';

  export let invitation: any;

  const brideName = (invitation.bride?.name || 'BRIDE').split(' ')[0];
  const groomName = (invitation.groom?.name || 'GROOM').split(' ')[0];
  const guestName = invitation.guestName || 'Tamu Undangan';
  const groomNameStyle = getAdaptiveNameStyle(groomName, { maxRem: 3.75, minRem: 2.1, endAt: 14 });
  const brideNameStyle = getAdaptiveNameStyle(brideName, { maxRem: 3.75, minRem: 2.1, endAt: 14 });
  const dispatch = createEventDispatcher();
  let shown = false;

  onMount(() => (shown = true));
</script>

{#if shown}
  <section class="floral-cover" in:fade={{ duration: 700 }}>
    <img class="top-floral" src="/images/floral/floral-top-new.png" alt="" in:fly={{ y: -25, duration: 800, easing: cubicOut }} />
    <img class="cover-butterfly" src="/images/watercolor/butterfly.png" alt="" in:fly={{ x: 24, y: -8, delay: 350, duration: 800, easing: cubicOut }} />
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
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Great+Vibes&family=Montserrat:wght@400;500;600&display=swap');
  .floral-cover { position:relative; min-height:100dvh; overflow:hidden; display:flex; align-items:center; justify-content:center; background:#fffefa; color:#645f35; font-family:Montserrat,sans-serif; isolation:isolate; }
  .floral-cover::before { content:''; position:absolute; inset:0; opacity:.38; background-image:radial-gradient(#d8d2b4 0.7px,transparent .7px); background-size:12px 12px; z-index:-1; }
  .top-floral { position:absolute; z-index:1; top:-2px; left:50%; width:min(112%,560px); transform:translateX(-50%); }
  .bottom-floral { position:absolute; z-index:1; bottom:-1px; left:50%; width:min(125%,620px); transform:translateX(-50%); }
  .cover-butterfly { position:absolute; z-index:2; width:54px; right:8%; top:25%; animation: flutter 4.2s ease-in-out infinite; }
  .cover-content { position:relative; z-index:3; width:100%; margin-top:3.5rem; display:flex; flex-direction:column; align-items:center; text-align:center; }
  .eyebrow { margin:0; font-size:13px; letter-spacing:.04em; color:#626262; }
  .names { margin-top:1.15rem; line-height:.86; font-family:'Great Vibes',cursive; color:#706c3e; text-shadow:0 1px 0 #fff; }
  .names p { margin:0; }
  .names span { display:block; margin:.45rem 0 .15rem; font-family:'Cormorant Garamond',serif; font-size:1.6rem; }
  .guest { margin-top:2.55rem; font-size:11px; line-height:1.6; color:#5d5a52; }
  .guest p { margin:0; }
  .guest strong { display:block; margin-top:.25rem; font-size:13px; color:#716d3e; }
  button { margin-top:1.7rem; border:0; border-radius:999px; padding:.75rem 1.35rem; background:#777543; color:#fff; box-shadow:0 7px 18px rgba(92,88,39,.2); font:500 11px Montserrat,sans-serif; cursor:pointer; transition:.25s ease; }
  button:hover { background:#5f5d34; transform:translateY(-2px); }
  @keyframes flutter { 50% { transform:translateY(-10px) rotate(5deg); } }
</style>
