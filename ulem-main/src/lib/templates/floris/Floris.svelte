<script lang="ts">
  import Floral from '../floral/Floral.svelte';
  export let invitation: any;
</script>

<div class="floris-template">
  <Floral {invitation} />
</div>

<style>
  .floris-template {
    background: linear-gradient(180deg, #fffdfd 0%, #fef7f5 22%, #f6efe7 100%);
    color: #694f49;
  }

  .floris-template :global(.floral-main) {
    background: linear-gradient(180deg, #fffdfd 0%, #fef7f4 24%, #f8f0eb 100%);
    color: #694f49;
  }

  .floris-template :global(.floral-main .quote) {
    background: rgba(255, 255, 255, 0.52);
    backdrop-filter: blur(1px);
  }

  .floris-template :global(.floral-main .quote-inner) {
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(163, 126, 113, 0.18);
    box-shadow: 0 22px 40px rgba(165, 118, 103, 0.08);
  }

  .floris-template :global(.floral-main .quote-welcome),
  .floris-template :global(.floral-main .kicker),
  .floris-template :global(.floral-main h2),
  .floris-template :global(.floral-main h3),
  .floris-template :global(.floral-main .person-role) {
    color: #7c574f;
  }

  .floris-template :global(.floral-main .event-detail),
  .floris-template :global(.floral-main .story-card),
  .floris-template :global(.floral-main .gallery-item),
  .floris-template :global(.floral-main .gift-card),
  .floris-template :global(.floral-main .rsvp-card),
  .floris-template :global(.floral-main .closing-box) {
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(182, 146, 133, 0.22);
    box-shadow: 0 18px 40px rgba(159, 118, 101, 0.08);
  }

  .floris-template :global(.floral-main .outline-button),
  .floris-template :global(.floral-main .primary-button),
  .floris-template :global(.floral-main button[type='submit']) {
    background: linear-gradient(135deg, #b78066 0%, #d7a48a 100%);
    border: none;
    box-shadow: 0 14px 30px rgba(167, 123, 105, 0.24);
    color: #fff;
  }

  .floris-template :global(.floral-main .person-parent),
  .floris-template :global(.floral-main .person-sibling),
  .floris-template :global(.floral-main .event-date),
  .floris-template :global(.floral-main .story-meta),
  .floris-template :global(.floral-main .gift-title),
  .floris-template :global(.floral-main .closing-copy) {
    color: #8a706a;
  }

  .floris-template :global(.floral-main .instagram svg) {
    background: #f3e4db;
    color: #815d53;
  }
</style>
