export default class FocusEvent {
  #inputs: NodeListOf<HTMLInputElement> | never[] = []
  #active: string = 'input--active'
  #focus: string = 'input--focus'
  #disabled: string = 'input--disabled'
  constructor ({ selector }: { selector: NodeListOf<HTMLInputElement> | never[] }) {
    this.#inputs = selector
  }

  private addEvent (element: any, type: string, listener: any) {
    element.addEventListener(type, listener)
  }

  private removeEvent (element: any, type: string, listener: any) {
    element.removeEventListener(type, listener)
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

  private setEvent (input: HTMLInputElement | never) {
    if (!input) return;
    const inputElement = input.querySelector('input')

    if (inputElement?.disabled) {
      this.addClass(input, this.#disabled)
      inputElement.removeAttribute('disabled')
    } else {
      this.addEvent(inputElement, 'click', (event: Event) => {
        if ((event as any).target.checked) {
          this.addClass(input, this.#active)
        } else {
          this.removeClass(input, this.#active)
        }
      });

      this.addEvent(inputElement, 'focus', (event: Event) => {
        if (!(event as any).target.checked) {
          this.addClass(input, this.#focus)
        }
      });

      this.addEvent(inputElement, 'blur', (event: Event) => {
        this.removeClass(input, this.#focus)
      });
    }
  }

  public async mount () {
    for await (const input of this.#inputs) {
      this.setEvent(input)
    }
  }
}
