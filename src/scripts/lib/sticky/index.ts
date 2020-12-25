import throttle from '../throttle';

export default class Sticky {
  #namespace: string = 'data-sticky';
  #element: HTMLElement | null = document?.querySelector(`[${this.#namespace}]`);
  #offset: number = 0;

  #up: string = 'zm-scroll-up';
  #down: string = 'zm-scroll-down';

  #last: number = 0;

  private getOffset () {
    const _offset = this.#element?.getAttribute(this.#namespace);
    const _offsetValues = _offset?.split(':');
    const _offsetValue = parseInt(_offsetValues![1].trim(), 10);

    this.#offset = _offsetValue;
  }

  private setClass () {
    const className = 'zm-scroll';
    this.#element?.classList.add(className);
  }

  private bindEvent () {
    const cls: DOMTokenList | undefined = this.#element?.classList;

    this.getOffset();
    this.setClass();

    window.addEventListener('scroll', throttle(() => {
      let currentScroll = Math.round(window.pageYOffset);

      if (currentScroll == 0) {
        cls?.remove(this.#up);
        return;
      }

      if (currentScroll > this.#last && !cls?.contains(this.#down)) {
        cls?.remove(this.#up);
        cls?.add(this.#down);
      } else if (currentScroll < this.#last && cls?.contains(this.#down)) {
        cls?.remove(this.#down);
        cls?.add(this.#up);
      }

      this.#last = currentScroll;
    }, 300));
  }

  public mount () {
    this.bindEvent();
  }
}
