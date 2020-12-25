export default class FluidText {
  private addEvent (
    el: any,
    type: string,
    listener: () => void
  ) {
    el.addEventListener(type, listener, false)
  }

  private bind (el: any | any[], kompressor: number, options: any) {
    const settings = Object.assign({
      minFontSize: -1/0,
      maxFontSize: 1/0
    }, options);

    const fit = (el: any) => {
      const compressor = kompressor || 1;

      const resizer = () => {
        el.style.fontSize = Math.max(
          Math.min(
            el.clientWidth / (compressor*10),
            parseFloat(settings.maxFontSize)),
            parseFloat(settings.minFontSize)
          ) + 'px';

        requestAnimationFrame(resizer);
      }

      resizer();

      window.addEventListener('resize', resizer);
      window.addEventListener('orientationchange', resizer);
    }

    if (el.length) {
      for (let i = 0; i < el.length; i++) {
        fit(el[i]);
      }
    } else {
      fit(el);
    }

    return el;
  }

  public watch (el: any, comp?: any, opt?: any) {
    if (!el) return;

    this.bind(el, comp, opt);
  }
}

/*
 * @usage
 * const fluidtext = new FluidText();
 * fluidtext.watch(HTMLElement, 1.2) -> turn the compressor up (font will shrink a bit more aggressively)
 * fluidtext.watch(HTMLElement, 0.8) -> turn the compressor down (font will shrink less aggressively)
 */
