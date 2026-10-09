// Ekspor Cover secara eksplisit (karena butuh event handling)
export { default as Cover } from './sections/Cover.svelte';

// // Ekspor section lain sebagai objek
export const sections = {
  Quotes: () => import('./sections/Quotes.svelte'),
  Couple: () => import('./sections/Couple.svelte'),
  Galery: () => import('./sections/Gallery.svelte'),
  Time: () => import('./sections/Time.svelte'),
  Gift: () => import('./sections/Gift.svelte'),
  Story: () => import('./sections/Story.svelte'),
  RSVP: () => import('./sections/RSVP.svelte'),
  Closing: () => import('./sections/Closing.svelte')
};
