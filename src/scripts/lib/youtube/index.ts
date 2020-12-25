import '../../utils/delegation'

// <button class="zm-video-gallery__videos--close" data-zm-youtube-close="video">KAPAT</button>

export default class YoutubeLoader {
  #template = ({ id, width, height }: { id: string, width: string, height: string }) => `
    <iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/${id}?rel=0&showinfo=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `
  #elements: NodeListOf<HTMLElement> = document.querySelectorAll('[data-zm-youtube]')

  private async bindClose (template: any) {
    const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('[data-zm-youtube-close="video"]')

    for await (const button of buttons) {
      if (template && typeof template !== undefined) {
        window.SWA(button).on('click', () => {
          (button as any).parentElement.innerHTML = template
          window.SWA(button).off('click')
        })
      }
    }
  }

  private event (element: HTMLElement) {
    const attr = element.getAttribute('data-zm-youtube')

    const options = JSON.parse(attr!)
    const html = this.#template(options)
    // const prevHtml = (element as any).parentElement.innerHTML

    window.SWA(element).on('click', () => {
      (element as any).parentElement.innerHTML = html

      window.SWA(element).off('click')
      // this.bindClose(prevHtml)
    })
  }

  public async mount () {
    for await (const element of this.#elements) {
      this.event(element)
    }
  }
}
