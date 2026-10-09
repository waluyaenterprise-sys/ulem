// Ekspor Cover secara eksplisit (karena butuh event handling)
export { default as Cover } from './sections/Cover.svelte';

// Ekspor section lain sebagai objek
export const sections = {
  Quotes: () => import('./sections/Quotes.svelte'),
  Bride: () => import('./sections/Bride.svelte'),
  Groom: () => import('./sections/Groom.svelte'),
  Journey: () => import('./sections/Journey.svelte'),
  Galery: () => import('./sections/Galery.svelte'),
  Dates: () => import('./sections/Dates.svelte'),
  Reservation: () => import('./sections/Reservation.svelte'),
  Wishes: () => import('./sections/Wishes.svelte'),
  Gift: () => import('./sections/Gift.svelte'),
  Closing: () => import('./sections/Closing.svelte')
};
