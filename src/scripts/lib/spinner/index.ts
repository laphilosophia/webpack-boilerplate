import '../../utils/delegation'

export default class Spinner {
  #elements: NodeListOf<HTMLElement> = document.querySelectorAll('[data-zm-spinner]')
  #config: {
    title: string,
    max: number,
    min: number,
    value?: number
  } = {
    title: 'ADET',
    max: 10,
    min: 0,
    value: 1
  }

  #classnames: {
    element: string,
    title: string,
    wrapper: string,
    minus: string,
    plus: string,
    input: string,
  } = {
    element: 'zm-spinner',
    title: 'zm-spinner__title',
    wrapper: 'zm-spinner__wrapper',
    minus: 'zm-spinner__button zm-spinner__button--minus',
    plus: 'zm-spinner__button zm-spinner__button--plus',
    input: 'zm-spinner__input',
  }

  private setConfigs (element: HTMLElement) {
    const attr = element.dataset.zmSpinner
    this.#config = JSON.parse(attr!)
  }

  private async createLayout (element: HTMLElement) {
    const wrapper = document.createElement('div')
    const input = document.createElement('input')
    const minus = document.createElement('button')
    const plus = document.createElement('button')

    const inputAttrs: {
      [keys: string]: any
    } = {
      type: 'text',
      class: this.#classnames.input,
      name: this.#classnames.element,
      value: this.#config.min,
      disabled: true,
      readonly: true
    }

    element.className = this.#classnames.element
    wrapper.className = this.#classnames.wrapper
    minus.className = this.#classnames.minus
    plus.className = this.#classnames.plus

    minus.insertAdjacentText('afterbegin', '-')
    plus.insertAdjacentText('afterbegin', '+')

    for (let key in inputAttrs) {
      if (inputAttrs.hasOwnProperty(key)) {
        input.setAttribute(key, inputAttrs[key])
      }
    }

    wrapper?.append(minus)
    wrapper?.append(input)
    wrapper?.append(plus)

    if (this.#config.value || this.#config.value !== undefined) {
      input.setAttribute('value', `${this.#config.value}`)
    }

    if (this.#config.title || this.#config.title !== undefined) {
      const title = document.createElement('p')
      title.className = this.#classnames.title

      title.insertAdjacentText('afterbegin', this.#config.title)
      element?.append(title)
    }

    element?.append(wrapper)
    element.removeAttribute('data-zm-spinner')
  }

  private increaseHandler (input: Element | null, settings: { max: number }) {
    if (!input) return;

    if ((input as any).value < settings?.max) {
      let value = parseInt((input as any).value, 10)

      value = isNaN(value) ? 0 : value
      value++

      (input as any).value = String(value)
    }
  }

  private decreaseHandler (input: Element | null, settings: { min: number }) {
    if ((input as any).value > settings?.min) {
      let value = parseInt((input as any).value, 10)

      value = isNaN(value) ? 0 : value
      value--

      (input as any).value = String(value)
    }
  }

  private checkValues (
    input: any,
    button: {
      setAttribute: (arg0: string, arg1: string) => void;
      removeAttribute: (arg0: string) => void
    } | null,
    compare: any) {
    if ((input as any)?.value == compare) {
      button?.setAttribute('disabled', 'true')
    } else {
      button?.removeAttribute('disabled')
    }
  }

  private async bind (element: HTMLElement) {
    await this.createLayout(element);

    const minus = element.querySelector('.zm-spinner__button--minus')
    const plus = element.querySelector('.zm-spinner__button--plus')
    const input = element.querySelector('.zm-spinner__input')

    plus ? window.SWA(plus).on('click', () => {
      this.increaseHandler(input, this.#config);
      this.checkValues(input, plus, this.#config.max)
      this.checkValues(input, minus, this.#config.min)
    }, false) : null

    minus ? window.SWA(minus).on('click', () => {
      this.decreaseHandler(input, this.#config);
      this.checkValues(input, plus, this.#config.max)
      this.checkValues(input, minus, this.#config.min)
    }, false) : null

    this.checkValues(input, plus, this.#config.max)
    this.checkValues(input, minus, this.#config.min)
  }

  public async mount () {
    for await (const element of this.#elements) {
      this.setConfigs(element)
      this.bind(element)
    }
  }
}
