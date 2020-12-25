import {
  create,
  render,
  mount,
  diff
} from '../../vdom'
import '../../utils/delegation'

export default class Videos {
  #elements: NodeListOf<HTMLElement> = document.querySelectorAll('[data-zm-videos]')
  #options: {
    poster: string,
    videoId: string
  } = {
    poster: '',
    videoId: ''
  }

  private events (element: HTMLElement) {
    const button = element.querySelector('.zm-videos__button')

    const oldApp = this.createWrapper()
    const newApp = this.createVideo()
    const patch = diff(oldApp, newApp)

    window.SWA(button).on('click', () => {
      patch(element)

      window.SWA(button).off('click')
    })
  }

  private createVideo () {
    const app = create('div', {
      attrs: { class: 'zm-videos' },
      children: [
        create('figure', {
          attrs: {  class: 'zm-videos__poster' },
          children: [
            create('iframe', {
              attrs: {
                width: '100%',
                height: '100%',
                src: `https://www.youtube.com/embed/${this.#options.videoId}?rel=0&showinfo=0`,
                frameborder: 0,
                allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                allowfullscreen: true
              }
            })
          ]
        })
      ]
    })

    return app
  }

  private createWrapper () {
    const app = create('div', {
      attrs: {  class: 'zm-videos' },
      children: [
        create('figure', {
          attrs: {  class: 'zm-videos__poster' },
          children: [
            create('button', {
              attrs: { class: 'zm-videos__button' },
              children: [
                create('i', { attrs: { class: 'icon-play' } })
              ]
            }),
            create('img', {
              attrs: {
                class: 'lazyload',
                'data-src': this.#options.poster,
                alt: 'Zuhal Müzik Videos'
              }
            })
          ]
        })
      ]
    })
    return app
  }

  private bind (element: HTMLElement) {
    const videoWrapper = this.createWrapper()
    const videoElement = render(videoWrapper)

    mount(videoElement, element)

    element.removeAttribute('data-zm-videos')

    if (videoElement) {
      this.events(videoElement)
    }
  }

  public async mount() {
    for await (const element of this.#elements) {
      const attr = element.getAttribute('data-zm-videos')
      const options = JSON.parse(attr!)

      this.#options = options
      this.bind(element)
    }
  }
}
