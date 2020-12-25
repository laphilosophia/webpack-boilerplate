export default class SelectColor {
  #elements: NodeListOf<HTMLElement> = document.querySelectorAll('[data-zm-selectcolor]')
  #configs: {
    title: string,
    default: string,
    items: Array<{name: string, code: string}>,
  } = {
    title: '',
    default: '',
    items: []
  }

  private createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  private siblings (el: HTMLElement, callback: (child: HTMLElement) => void) {
    return Array.prototype.filter.call((el as any).parentNode.children, child => {
      if (child !== el) callback(child)
    })
  }

  private async createInputs() {
    let items = []
    const guid = this.createGuid()

    for await (const item of this.#configs.items) {
      const checkbox = document.createElement('input')
      const label = document.createElement('label')

      checkbox.type = 'radio'
      checkbox.id = item.name
      checkbox.name = guid
      checkbox.value = item.name

      if (this.#configs.default.includes(item.name)) {
        checkbox.checked = true
      }

      label.className = 'zm-select-color__items--item'
      label.htmlFor = item.name
      label.setAttribute('style', `background-color: ${item.code};`)

      label.append(checkbox)

      items.push(label)
    }

    return items
  }

  private async createTitle(element: HTMLElement) {
    const title = document.createElement('div')
    const selected = document.createElement('span')

    title.className = 'zm-select-color__title'
    selected.className = 'zm-select-color__title--selected'

    title.insertAdjacentText('afterbegin', `${this.#configs.title}:`)

    title?.append(selected)
    element?.append(title)
  }

  private setSelected(element: HTMLElement, content: string) {
    const span = element?.querySelector('.zm-select-color__title--selected')
    span!.innerHTML = content
  }

  private async setCheckboxes(element: HTMLElement) {
    const wrapper = document.createElement('div')
    wrapper.className = 'zm-select-color__items'

    const checkboxes = await this.createInputs()

    for await (const checkbox of checkboxes) {
      wrapper?.append(checkbox)
    }

    element?.append(wrapper);
  }

  private async addChangeEvent(element: HTMLElement) {
    const _this = this
    const checkboxes = element.querySelectorAll('input')

    this.setSelected(element, this.#configs.default)

    for await (const checkbox of checkboxes) {
      
      if (checkbox.value === this.#configs.default) {
        (checkbox as any).parentNode.classList.add('is-checked')
      }

      checkbox.addEventListener('change', function () {
        _this.setSelected(element, this.value)

        if (!checkbox.classList.contains('is-checked')) {
          (checkbox as any).parentNode.classList.add('is-checked')
        }

        _this.siblings((checkbox as any).parentNode, self => self.classList.remove('is-checked'))
      })
    }
  }

  private async bind(element: HTMLElement) {
    await this.createTitle(element)
    await this.setCheckboxes(element)
    await this.addChangeEvent(element)

    element.className = 'zm-select-color'
    element.removeAttribute('data-zm-selectcolor')
  }

  public async mount() {
    for await (const element of this.#elements) {
      if (element.getAttribute('data-zm-selectcolor')) {
        this.#configs = JSON.parse(element.dataset.zmSelectcolor as any)
        await this.bind(element)
      } else {
        throw Error('no attribute defined')
      }
    }
  }
} 
