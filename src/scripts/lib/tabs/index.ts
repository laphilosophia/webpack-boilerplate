export default class Tabs {
  #tabs: string = 'data-zm-tabs="tabs"';
  #nav: string = 'data-zm-tabs="nav"';
  #content: string = 'data-zm-tabs="content"';
  #activeTab: HTMLElement | null = null;
  #activeContent: HTMLElement | null = null;
  #callbacks: Function = () => {};

  private addEvent (target: HTMLElement, callback: (event: Event) => void) {
    target.addEventListener('click', callback)
  }

  private removeEvent (target: HTMLElement, callback: (event: Event) => void) {
    target.removeEventListener('click', callback)
  }

  private addClass (target: HTMLElement, token: string | string[]) {
    if (Array.isArray(token)) {
      for (const key in token) {
        const cls = token[key];
        target.classList.add(cls);
      }
    } else {
      target.classList.add(token);
    }

    return target;
  }

  private removeClass (target: HTMLElement, token: string | string[]) {
    if (Array.isArray(token)) {
      for (const key in token) {
        const cls = token[key];
        target.classList.remove(cls);
      }
    } else {
      target.classList.remove(token);
    }

    return target;
  }

  private siblings (el: HTMLElement, callback: any) {
    return Array.prototype.filter.call(el.parentNode!.children, child => {
      if (child !== el) callback(child)
    })
  }

  private setCallbacks(callback: any) {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (callback) {
          resolve(callback);
        } else {
          reject(new Error("Error!"));
        }
      }, 0);
    });

    if (callback && typeof callback === 'function') {
      promise.then(
        callback.bind(null, {
          tab: this.#activeTab,
          content: this.#activeContent
        }),
        callback
      );
    }

    return promise;
  }

  private setTab (tab: HTMLElement) {
    const navItem = tab.querySelector(`[${this.#nav}]`)!.children;
    const contentItem = tab.querySelector(`[${this.#content}]`)!.children;

    if (navItem?.length) {
      for (let i = 0; i < navItem.length; i++) {
        const bind = async () => {
          this.addClass(<HTMLElement>navItem[i], 'tab-item--active');
          this.siblings(<HTMLElement>navItem[i], (el: any) => {
            this.removeClass(el, 'tab-item--active');
          });

          this.addClass(<HTMLElement>contentItem[i], 'tab-content--active');
          this.siblings(<HTMLElement>contentItem[i], (el: any) => {
            this.removeClass(el, 'tab-content--active');
          });

          if (navItem[i].classList.contains('tab-item--active')){
            this.#activeTab = <HTMLElement>navItem[i];
          }

          if (contentItem[i].classList.contains('tab-content--active')) {
            this.#activeContent = <HTMLElement>contentItem[i];
          }

          await this.setCallbacks(this.#callbacks);
        };

        this.addEvent(<HTMLElement>navItem[i], () => {
          bind();

          this.removeEvent(<HTMLElement>navItem[i], bind);
        });
      }
    }
  }
  

  public mount (callback?: any) {
    const tabs = [...document.querySelectorAll(`[${this.#tabs}]`)];

    if (callback) {
      this.#callbacks = callback;
    }

    for (const tab of tabs) {
      this.setTab(<HTMLElement>tab);
    }
  }
}
