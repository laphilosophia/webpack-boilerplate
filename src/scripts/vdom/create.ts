export default (tagName: any, {
  attrs = {},
  children = []
}: any = {}) => {
  return {
    tagName,
    attrs,
    children
  }
}
