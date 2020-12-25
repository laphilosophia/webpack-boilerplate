import Splide, { SplideOptions } from '@splidejs/splide';

export default (root: string | HTMLElement, options?: SplideOptions) => {
  if (!(root instanceof HTMLElement) || typeof root !== 'string') return;

  const splide = new Splide(root, options ? options : {});
  splide.mount();

  console.log(root)
} 
