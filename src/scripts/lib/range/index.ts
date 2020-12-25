export default class Range {
  #elements: NodeListOf<HTMLElement> = document.querySelectorAll('[data-zm-range]')

  private create (element: HTMLElement, value: string | null) {
    const wrapper: HTMLDivElement = document.createElement('div')
    const seeker: HTMLDivElement = document.createElement('div')
    const result: HTMLSpanElement = document.createElement('span')

    wrapper.className = 'zm-ranges__wrapper'
    seeker.className = 'zm-ranges__seeker'
    result.className = 'zm-ranges__result'

    seeker.style.width = `${value ? value : 0}%`
    result.textContent = `${value ? value : 0}%`

    wrapper.append(seeker)
    wrapper.append(result)
    element.append(wrapper)

    element.removeAttribute('data-zm-range')
  }

  private bind (element: HTMLElement) {
    const value = element.getAttribute('data-zm-range')

    this.create(element, value)
  }

  public async mount () {
    for await (const element of this.#elements) {
      this.bind(element)
    }
  }
}
