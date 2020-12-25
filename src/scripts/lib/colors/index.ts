import colorStore from '../../store/product.color'

type Elements = HTMLElement | null
type Images = NodeListOf<HTMLImageElement> | undefined
type Inputs = NodeListOf<HTMLInputElement> | undefined

const colorchanger = (value: string) => `[data-zm-colorchanger="${value}"]`

export default function ColorChanger () {
  const elements: NodeListOf<HTMLElement> = document.querySelectorAll(colorchanger('card'))

  function event (element: any, type: string, callback: any) {
    element.addEventListener(type, callback)
  }

  function siblings (el: any, callback: (arg0: any) => void) {
    return Array.prototype.filter.call(el.parentNode.children, child => {
      if (child !== el) callback(child)
    })
  }

  async function bind (element: HTMLElement) {
    const inputs: Elements = element.querySelector(colorchanger('trigger'))
    const inputChildren: Inputs = inputs?.querySelectorAll('input')

    inputChildren![0].checked = true;

    (inputChildren![0].parentNode as any).classList.add('is-selected');

    for await (const input of inputChildren!) {
      const div = <HTMLElement>input.parentNode
      const color = div.getAttribute('data-color')

      div!.style.setProperty('--color-code', color)

      event(input, 'change',  (event: Event) => {
        const parent = (event as any).target.parentNode

        colorStore.dispatch(
          'setColor',
          input.value
        )

        parent.classList.add('is-selected')
        siblings(parent, self => {
          self.classList.remove('is-selected')
        })
      })
    }
  }

  async function changeImage (element: HTMLElement) {
    const images: Elements = element.querySelector(colorchanger('images'))
    const imagesChildren: Images = images?.querySelectorAll('img')

    imagesChildren![0].classList.remove('hidden');

    colorStore.subscribe(async (state: any) => {
      for await (const image of imagesChildren!) {
        console.log(state.selectedColor)

        if (image.id === state.selectedColor) {
          image.classList.remove('hidden');
        } else {
          image.classList.add('hidden');
        }
      }
    })
  }

  const loop = async () => {
    for await (const element of elements) {
      bind(element)
      // changeImage(element)
    }
  }

  loop()
}
