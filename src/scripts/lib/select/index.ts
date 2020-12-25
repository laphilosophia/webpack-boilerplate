export default function Select(options: { elem: any; bubbles?: any; }) {
  const elem = typeof options.elem === 'string' ? document.getElementById(options.elem) : options.elem;

  if (!options.elem || !elem) return

  const bubbles = typeof options.bubbles === 'boolean' ? true : false;
  const mainClass = 'zm-select';
  const titleClass = 'zm-select__title';
  const listClass = 'zm-select__list';
  const optgroupClass = 'zm-select__optgroup';
  const selectedClass = 'is-selected';
  const openClass = 'is-open';
  const selectOpgroups = elem.getElementsByTagName('optgroup');
  const selectOptions = elem.options;
  const optionsLength = selectOptions.length;
  let index = 0;

  const selectContainer = document.createElement('div');

  selectContainer.className = mainClass;

  if (elem.id) {
    selectContainer.id = 'zm-' + elem.id;
  }

  const button = document.createElement('button');

  button.className = titleClass;
  button.textContent = selectOptions[0].textContent;

  const ul = document.createElement('ul');
  ul.className = listClass;

  if (selectOpgroups.length) {
    for (let i = 0; i < selectOpgroups.length; i++) {
      const div = document.createElement('div');
      div.innerText = selectOpgroups[i].label;
      div.classList.add(optgroupClass);

      ul.appendChild(div);
      generateOptions(selectOpgroups[i].getElementsByTagName('option'));
    }
  } else {
    generateOptions(selectOptions);
  }

  selectContainer.appendChild(button);
  selectContainer.appendChild(ul);

  selectContainer.addEventListener('click', onClick);

  elem.parentNode.insertBefore(selectContainer, elem);
  elem.style.display = 'none';

  function generateOptions(options: string | any[]) {
    for (var i = 0; i < options.length; i++) {
      var li = document.createElement('li');

      li.innerText = options[i].textContent;
      li.setAttribute('data-value', options[i].value);
      li.setAttribute('data-index', `${index++}`);

      if (selectOptions[elem.selectedIndex].textContent === options[i].textContent) {
        li.classList.add(selectedClass);
        button.textContent = options[i].textContent;
      }

      ul.appendChild(li);
    }
  }

  document.addEventListener('click', e => {
    if (!selectContainer.contains((e as any).target)) close();
  });

  function onClick (e: { preventDefault: () => void; target: any; }) {
    e.preventDefault();

    const t = e.target;

    if (t.className === titleClass) {
      toggle();
    }

    if (t.tagName === 'LI') {
      const selectContainerElem: HTMLElement | null = selectContainer.querySelector('.' + titleClass);

      selectContainerElem!.innerText = t.innerText;
      elem.options.selectedIndex = t.getAttribute('data-index');

      const evt = bubbles ? 
        new CustomEvent('change', { bubbles: true }) : 
        new CustomEvent('change');

      elem.dispatchEvent(evt);

      for (var i = 0; i < optionsLength; i++) {
        ul.querySelectorAll('li')[i].classList.remove(selectedClass);
      }

      t.classList.add(selectedClass);

      close();
    }
  }

  const toggle = () => selectContainer.classList.toggle(openClass);
  const open = () => selectContainer.classList.add(openClass);
  const close = () => selectContainer.classList.remove(openClass);

  return {
    toggle: toggle,
    close: close,
    open: open,
  };
}
