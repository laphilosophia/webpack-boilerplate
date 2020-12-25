export default class Collapse {
  _namespace: string;
  _elements: NodeListOf<HTMLElement>;
  _active: string;

  constructor (
    namespace?: string,
    elements?: NodeListOf<HTMLElement>,
    active?: string
  ) {
    this._namespace = namespace || '[data-zm-collapse="mobile"]'
    this._elements = elements || document.querySelectorAll(this._namespace)
    this._active = active || 'is-show'
  }

  private setEvent (element: HTMLElement) {
    const title = element.querySelector('[data-zm-collapse="trigger"]')
    const _this = this;

    title?.addEventListener('click', function (event) {
      const _self = event.currentTarget

      if ((_self as any).parentElement?.classList.contains(_this._active)) {
        (_self as any).parentElement?.classList.remove(_this._active)
      } else {
        (_self as any).parentElement?.classList.add(_this._active)
      }
    })
  }

  public async mount () {
    for await (const element of this._elements) {
      this.setEvent(element)
    }
  }
}
