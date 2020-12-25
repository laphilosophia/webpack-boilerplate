export default function PlayAudio () {
  const namespace: string = 'data-zm-audio'
  const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(`[${namespace}]`)

  function event (button: HTMLButtonElement) {
    button.addEventListener('click', () => {
      play(button, button.dataset.zmAudio)
      button.classList.add('has-playing')
    })
  }

  function play (button: HTMLButtonElement, url: string | undefined) {
    if (url === undefined) return

    const audio = new Audio(url)

    audio.addEventListener('canplaythrough', () => audio.play())

    audio.addEventListener('ended', () => {
      if (button.classList.contains('has-playing')) {
        button.classList.remove('has-playing')
      }
    })
  }

  return {
    bind: async function bind () {
      if (!buttons.length) return
  
      for await (const button of buttons) {
        event(button)
      }
    }
  }
}
