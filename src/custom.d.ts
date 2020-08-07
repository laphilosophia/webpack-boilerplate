import jQuery from '@types/jquery'

declare module "*.svg" {
  const content: any
  export default content
}

declare global {
  interface Window {
    jQuery: typeof jQuery
    $: typeof jQuery
  }
}
