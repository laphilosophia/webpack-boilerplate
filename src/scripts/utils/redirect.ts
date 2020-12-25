export default function Redirect () {
  const namespace: string = 'data-zm-click';
  const elements: NodeListOf<HTMLElement> = document.querySelectorAll(`[${namespace}]`);

  function getUrl(element: HTMLElement) {
    const URL: string | null = element.getAttribute(namespace);

    if (typeof URL === null) return null;

    return URL
  }

  async function setUrl (url: string | null) {
    const location: Location = window.location;
    const currentURL: any = location.pathname;

    if (url && !currentURL.includes(url!)) {
      location.href = url
    }
  }

  function set (element: HTMLElement) {
    const URL = getUrl(element);

    if (typeof URL !== null) {
      element.addEventListener('click', () => {
        setUrl(URL)
      })
    } else {
      return null
    }
  }

  async function bind () {
    for await (const element of elements) {
      set(element)
    }
  }

  return bind()
}
