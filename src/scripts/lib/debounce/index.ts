export default (func: any, delay: number) => {
  let inDebounce: any;

  return function () {
    // @ts-ignore
    const context = this;
    const args = arguments;

    clearTimeout(inDebounce);

    inDebounce = setTimeout(() => func.apply(context, args), delay);
  }
}
