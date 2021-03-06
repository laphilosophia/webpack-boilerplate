export default (element: any) => {
  let top = 0;
  let left = 0;

  do {
    top += element.offsetTop  || 0;
    left += element.offsetLeft || 0;

    element = element.offsetParent;
  } while(element);

  return {
    top: top,
    left: left
  };
}
