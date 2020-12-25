export default (node: any, target: { replaceWith: (arg0: any) => void }) => {
  target.replaceWith(node)
  return node
}
