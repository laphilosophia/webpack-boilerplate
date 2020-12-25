export default class Swipable {
  #elements: NodeListOf<HTMLElement> = document.querySelectorAll('[data-zm-swipable="auth"]')

  private bind (buttons: any, panes: any) {
    const span = buttons?.querySelector('[data-zm-swipable="back"]')
    const button = buttons?.querySelectorAll('[data-zm-swipable="button"]')
    const input = buttons?.querySelectorAll('[data-zm-swipable="input"]')
    const pane = panes.querySelectorAll('[data-zm-swipable="pane"]')

    panes.style.height = `${pane[0].offsetHeight}px`

    if (input.length) {
      events(input, 'change')
    }

    if (button.length) {
      events(button, 'click')
    }

    function events (target: any, event: string) {
      let isSlide = false

      for (let i = 0; i < target.length; i++) {
        target[i].addEventListener(event, () => {
          panes.style.height = `${pane[i].offsetHeight}px`

          if (!isSlide) {
            if (span) {
              span.style.transform = 'translateX(calc(100%))'
            }

            panes.style.transform = 'translateX(calc(-50% - 15px))'
            isSlide = true
          } else {
            if (span) {
              span.style.transform = 'translateX(0%)'
            }

            panes.style.transform = 'translateX(0%)'
            isSlide = false
          }
        })
      }
    }
  }

  public async mount () {
    for await (const element of this.#elements) {
      const buttons: HTMLElement | null = element.querySelector('[data-zm-swipable="buttons"]')
      const panes: HTMLElement | null = element.querySelector('[data-zm-swipable="panes"]')

      this.bind(buttons, panes)
    }
  }
}
