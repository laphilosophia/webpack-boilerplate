import '../../utils/delegation'

export default class MobileAccordion {
  #namespace: string = 'data-zm-mobile-accordion'
  #elements: NodeListOf<HTMLElement> = document.querySelectorAll(`[${this.#namespace}="root"]`)

  private async bind (element: HTMLElement) {
    const items: NodeListOf<HTMLElement> = element.querySelectorAll(`[${this.#namespace}="item"]`)

    if (!items.length) return false;

    items[0]?.classList.add('is-collapsed')

    for await (const item of items) {
      const trigger = item.querySelector(`[${this.#namespace}="trigger"]`)
      
      window.SWA(trigger).on('click', () => {
        if (item?.classList.contains('is-collapsed')) {
          item?.classList.remove('is-collapsed')
        } else {
          item?.classList.add('is-collapsed')
        }
      })
    }
  }

  public async mount () {
    for await (const element of this.#elements) {
      await this.bind(element)
    }
  }
}
