export default function detectOutsideClick (
  selector: HTMLElement,
  callback: Function
) {
  if (typeof callback !== 'function') return

  document.addEventListener('click', event => {
    const target = event.target

    return !(selector as any).contains(target) && callback()
  })
}
