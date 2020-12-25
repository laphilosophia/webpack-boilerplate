export default function Draggable () {
  const elements: NodeListOf<HTMLElement> = document.querySelectorAll('[data-zm-draggable]')
  const activeClass: string = 'is-draggable'

  const multiplier: number = 1.5;
  let isDown: boolean = false;
  let startX: number;
  let scrollLeft: number;

  function bind (element: HTMLElement) {
    element.addEventListener('mousedown', e => {
      isDown = true;
      element.classList.add(activeClass);

      startX = e.pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    });

    element.addEventListener('mouseleave', () => {
      isDown = false;
      element.classList.remove(activeClass);
    });

    element.addEventListener('mouseup', () => {
      isDown = false;
      element.classList.remove(activeClass);
    });

    element.addEventListener('mousemove', e => {
      if (!isDown) return;

      e.preventDefault();

      const x = e.pageX - element.offsetLeft;
      const walk = (x - startX) * multiplier;

      element.scrollLeft = scrollLeft - walk;
    });
  }

  for (const element of elements) {
    bind(element);
  }
}
