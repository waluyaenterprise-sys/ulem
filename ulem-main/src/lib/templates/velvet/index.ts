export { default as Cover } from './sections/Cover.svelte';

export const sections: Record<string, () => Promise<any>> = {
  Quotes: () => import('./sections/Quotes.svelte'),
  Couple: () => import('./sections/Couple.svelte'),
  Event: () => import('./sections/Event.svelte'),
  Story: () => import('./sections/Story.svelte'),
  Gallery: () => import('./sections/Gallery.svelte'),
  Gift: () => import('./sections/Gift.svelte'),
  RSVP: () => import('./sections/RSVP.svelte'),
  Closing: () => import('./sections/Closing.svelte')
};
