export default class Accordion {
  #parent: string = 'data-zm-accordion'
  #child: string = 'data-accordion-item'
  #active: string = 'data-accordion-active'

  #accordions: NodeListOf<HTMLElement> = document.querySelectorAll(`[${this.#parent}]`)

  private events (element: Element | null, listener: any) {
    (element ? element : document).addEventListener('click', listener, false)
  }

  private toggle (button: HTMLButtonElement | null, parent: HTMLElement | null) {
    if (!button && !parent) return

    this.events(button, () => {
      if (parent?.getAttribute(this.#active) === 'true') {
        parent?.setAttribute(this.#active, 'false')
        button?.setAttribute('aria-expanded', 'false')
      } else {
        parent?.setAttribute(this.#active, 'true')
        button?.setAttribute('aria-expanded', 'true')
      }
    })
  }

  private async bind (accordion: HTMLElement) {
    const panel: NodeListOf<HTMLElement> = accordion.querySelectorAll(`[${this.#child}]`)

    if (!panel.length) return

    for await (const pane of panel) {
      const panelButton = pane?.querySelector('button')

      this.toggle(panelButton, pane)
    }
  }

  public async mount () {
    for await (const accordion of this.#accordions) {
      this.bind(accordion)
    }
  }
}
