export default function StarRating () {
  const defaultRate = 5
  const namespace = 'data-zm-starrating'
  const elements: NodeListOf<HTMLElement> = document.querySelectorAll(`[${namespace}]`)

  function createStars (element: HTMLElement, active: Array<number>, remain: Array<number>) {
    for (let i = 0; i < active.length; i++) {
      const star = document.createElement('i')
      star.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 22 21"><path d="M10.868 16.832L4.48 20.19l1.22-7.113L.532 8.04l7.142-1.038L10.868.53l3.194 6.472 7.142 1.038-5.168 5.037 1.22 7.113z" fill="#000" fill-rule="evenodd"/></svg>'
      star.classList.add('active')
      element.appendChild(star)
    }

    if (remain.length) {
      for (let j = 0; j < remain.length; j++) {
        const star = document.createElement('i')
        star.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 22 21"><path d="M10.868 16.832L4.48 20.19l1.22-7.113L.532 8.04l7.142-1.038L10.868.53l3.194 6.472 7.142 1.038-5.168 5.037 1.22 7.113z" fill="#D8D8D8" fill-rule="evenodd"/></svg>'
        element.appendChild(star)
      }
    }
  }

  function setStars (element: HTMLElement) {
    const rate = element.getAttribute(namespace)

    const originalRate = new Array(Number(defaultRate))
    const activeRate = originalRate.slice(0, Math.trunc(Number(rate)));
    const remainrate = originalRate.slice(Number(rate), defaultRate)

    createStars(element, activeRate, remainrate)
  }

  const loop = async () => {
    for await (const element of elements) {
      setStars(element)
    }
  }

  loop()
}
