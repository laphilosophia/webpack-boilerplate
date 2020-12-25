export default function PreventEmptyLink () {
  const emptyLinks = document.getElementsByTagName('a')

  if (!emptyLinks.length) return;

  for (let link = 0; link < emptyLinks.length; link++) {
    const href = emptyLinks[link].getAttribute('href')

    if (href || href === '#') {
      emptyLinks[link].onclick = listener
    }
  }

  function listener (this: any, event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation()

    // for tracking dead links
    this.classList.add('link--empty')
  }
}
