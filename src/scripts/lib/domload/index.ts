export default (listener: any, options?: boolean | AddEventListenerOptions) => {
  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', listener, options);
  } else {
    listener();
  }
}
