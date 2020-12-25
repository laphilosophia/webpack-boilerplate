const renderElem = ({ tagName, attrs, children }: any) => {
  const $el = document.createElement(tagName)

  for (const [k, v] of Object.entries(attrs)) {
    $el.setAttribute(k, v)
  }

  for (const child of children) {
    const $child = render(child)
    $el.appendChild($child)
  }

  return $el
}

const render = (vNode: any) => {
  if (typeof vNode === 'string') {
    return document.createTextNode(vNode)
  }

  return renderElem(vNode)
}


export default render
