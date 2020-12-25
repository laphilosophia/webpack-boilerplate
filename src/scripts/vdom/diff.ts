// @ts-nocheck
import render from './render'

const zip = (xs: string | any[], ys: string | any[]) => {
  const zipped = []
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]])
  }
  return zipped
}

const diffAttrs = (oldAttrs: any, newAttrs: { [s: string]: unknown } | ArrayLike<unknown>) => {
  const patches = []

  for (const [k, v] of Object.entries(newAttrs)) {
    patches.push(($node: { setAttribute: (arg0: string, arg1: unknown) => void }) => {
      $node.setAttribute(k, v)
      return $node
    })
  }

  for (const k in oldAttrs) {
    if (!(k in newAttrs)) {
      patches.push(($node: { removeAttribute: (arg0: string) => void }) => {
        $node.removeAttribute(k)
        return $node
      })
    }
  }

  return ($node: any) => {
    for (const patch of patches) {
      patch($node)
    }
    return $node
  }
}

const diffChildren = (oldVChildren: any[], newVChildren: string | any[]) => {
  const childPatches: string | any[] = []

  oldVChildren.forEach((oldVChild: any, i: string | number) => {
    childPatches.push(diff(oldVChild, newVChildren[i]))
  })

  const additionalPatches: (($node: { appendChild: (arg0: any) => void }) => { appendChild: (arg0: any) => void })[] = []

  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push(($node: { appendChild: (arg0: any) => void }) => {
      $node.appendChild(render(additionalVChild))
      return $node
    })
  }

  return ($parent: { childNodes: any }) => {
    for (const [patch, $child] of zip(childPatches, $parent.childNodes)) {
      patch($child)
    }

    for (const patch of additionalPatches) {
      patch($parent)
    }
    return $parent
  }
}

const diff = (oldVTree: { tagName: any; attrs: any; children: any }, newVTree: any) => {
  if (newVTree === undefined) {
    return ($node: { remove: () => void }) => {
      $node.remove()
      return undefined
    }
  }

  if (typeof oldVTree === 'string' || typeof newVTree === 'string') {
    // @ts-ignore
    if (oldVTree !== newVTree) {
      return ($node: { replaceWith: (arg0: any) => void }) => {
        const $newNode = render(newVTree)
        $node.replaceWith($newNode)
        return $newNode
      }
    } else {
      return ($node: any) => $node
    }
  }

  if (oldVTree.tagName !== (newVTree as any).tagName) {
    return ($node: { replaceWith: (arg0: any) => void }) => {
      const $newNode = render(newVTree)
      $node.replaceWith($newNode)
      return $newNode
    }
  }

  const patchAttrs = diffAttrs(oldVTree.attrs, (newVTree as any).attrs)
  const patchChildren = diffChildren(oldVTree.children, (newVTree as any).children)

  return ($node: any) => {
    patchAttrs($node)
    patchChildren($node)
    return $node
  }
}

export default diff
