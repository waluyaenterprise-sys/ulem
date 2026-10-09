// Ekspor Cover secara eksplisit (karena butuh event handling)
export { default as Cover } from './sections/Cover.svelte';

// // Ekspor section lain sebagai objek
export const sections = {
  Quotes: () => import('./sections/Quotes.svelte'),
  Couple: () => import('./sections/Couple.svelte'),
  Time: () => import('./sections/Time.svelte'),
  Story: () => import('./sections/Story.svelte'),
  Galery: () => import('./sections/Gallery.svelte'),
  Gift: () => import('./sections/Gift.svelte'),
  RSVP: () => import('./sections/RSVP.svelte'),
  Closing: () => import('./sections/Closing.svelte')
};
