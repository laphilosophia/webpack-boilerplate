export default function mediaQuery (size: number, max: boolean) {
  if (max || max !== false) {
    return window.matchMedia(`(max-width: ${String(size)}px)`).matches ? true : false
  } else {
    return window.matchMedia(`(min-width: ${String(size)}px)`).matches ? true : false
  }
}
