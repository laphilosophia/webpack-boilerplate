import { detectOutsideClick } from '../../utils'

export default class Dropdown {
  #namespace: string = 'data-dropdown'
  #active: string = 'data-dropdown-active'
  #element: NodeListOf<HTMLElement> = document.querySelectorAll(`[${this.#namespace}]`)

  private toggle (element: HTMLElement, target: HTMLElement) {
    target.setAttribute(this.#active, 'false')

    element.addEventListener('click', () => {
      if (target.getAttribute(this.#active) === 'true') {
        target.setAttribute(this.#active, 'false')
        element.setAttribute('aria-expanded', 'false')
      } else {
        target.setAttribute(this.#active, 'true')
        element.setAttribute('aria-expanded', 'true')
      }
    })
  }

  private outsideClick (selector: HTMLElement, target: HTMLElement) {
    detectOutsideClick(selector, () => {
      target.setAttribute(this.#active, 'false')
        selector
          .querySelector('button')!
          .setAttribute('aria-expanded', 'false')
    })
  }

  private async setPlaceholder (element: HTMLElement, placeholder: HTMLElement) {
    for await (const child of element.children) {
      child.addEventListener('click', (event: Event) => {
        const flag = (event as any).target.cloneNode(true)

        placeholder.querySelector('span')?.remove()
        placeholder.appendChild(flag)

        placeholder.setAttribute('aria-expanded', 'false')
        element.setAttribute(this.#active, 'false')
      })
    }
  }

  private bind (element: HTMLElement) {
    const target = element.getAttribute(this.#namespace)
    const button = <HTMLElement>element.children[0]
    const menu = <HTMLElement>element.querySelector(`#${target}`)

    this.toggle(button, menu)
    this.outsideClick(element, menu)
    this.setPlaceholder(menu, button)
  }

  public mount () {
    for (const element of this.#element) {
      this.bind(element)
    }
  }
}
