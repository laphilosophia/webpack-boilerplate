export default class Inputs {
  #namespace: string = "data-zm-input='input'"
  #inputs: NodeListOf<HTMLElement> = document.querySelectorAll(`[${this.#namespace}]`)

  #active: string = 'input--active'
  #focus: string = 'input--focus'
  #disabled: string = 'input--disabled'

  private addEvent (
    element: any,
    type: string,
    listener: any,
    options?: boolean | AddEventListenerOptions | undefined
  ) {
    element.addEventListener(type, listener, options)
  }

  private removeEvent (
    element: any,
    type: string,
    listener: any,
    options?: boolean | AddEventListenerOptions | undefined
  ) {
    element.removeEventListener(type, listener, options)
  }

  private addClass (element: any, className: string) {
    if (!element.classList.contains(className)) {
      element.classList.add(className)
    }
  }

  private removeClass (element: any, className: string) {
    if (element.classList.contains(className)) {
      element.classList.remove(className)
    }
  }

  private clearInput (element: HTMLElement) {
    if (!element) return;

    const input = element.querySelector('input');

    if (input!.value.length > 0) {
      input!.value = '';

      this.removeClearButton(element)

      this.removeClass(element, this.#focus)
      this.removeClass(element, this.#active)
    }
  }

  private addClearButton (element: any) {
    if (element.querySelector('.input--clear') === null) {
      const button = document.createElement('button')
      button.classList.add('input--clear')

      element.append(button)
      this.addEvent(button, 'click', () => this.clearInput(element))
    }
  }

  private addVisibleButton(element: any) {
    const input = element.querySelector('input')

    if (element.querySelector('.input--visible') === null) {
      const button = document.createElement('span')
      button.classList.add('input--visible')
      button.textContent = 'Göster';

      element.append(button)

      this.addEvent(button, 'click', () => {
        if (input.type === 'password') {
          button.textContent = 'Gizle';
          input?.setAttribute('type', 'text');
        } else {
          button.textContent = 'Göster';
          input?.setAttribute('type', 'password');
        }
      })
    }
  }

  private removeClearButton (element: any) {
    if (element.querySelector('.input--clear') !== null) {
      const button = element.querySelector('.input--clear')
      this.removeEvent(button, 'click', () => this.clearInput(element))
      button.parentNode.removeChild(button)
    }
  }

  private bindEvent (element: HTMLElement) {
    if (typeof element !== undefined) {
      const input = element.querySelector('input')

      if (input?.disabled) {
        this.addClass(element, this.#disabled)
        input.removeAttribute('disabled')
      } else {
        this.addEvent(input, 'focus', () => {
          this.addClass(element, this.#active)
          this.addClass(element, this.#focus)
        })

        this.addEvent(input, 'blur', () => {
          this.removeClass(element, this.#focus)

          if (input?.value.length) {
            this.addClass(element, this.#active)
          } else {
            this.removeClass(element, this.#active)
          }
        })

        this.addEvent(input, 'keyup', (event: Event) => {
          const len = (event as any).target.value.length

          if (len) {
            this.addClearButton(element)
          } else {
            this.removeClearButton(element)
          }
        })
      }

      if (input?.type === 'password') {
        this.addVisibleButton(element)
      }
    }
  }

  public async watch () {
    for await (const input of this.#inputs) {
      this.bindEvent(input)
    }
  }
}
