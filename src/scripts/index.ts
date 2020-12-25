import { DOMLoad } from './lib'

async function dynamicImport() {
  const {
    PreventEmptyLink: preventEmptyLink,
    mediaQuery,
    Redirect: redirect,
  } = await import(/* webpackPreload: true */ './utils');
  const {
    Dropdown,
    Inputs,
    FocusEvent,
    Tabs,
    Select,
    Collapse,
    Modal,
    ColorChanger,
    StarRating,
    Accordion,
    MobileAccordion,
    Draggable,
    SelectColor,
    Spinner,
    PlayAudio,
    YoutubeLoader,
    Range,
    Videos,
    Swipable
  } = await import(/* webpackPreload: true */ './lib');
  const {
    sliders: initSliders,
    Navigation: navigation,
    shops: zuhalShops,
    Filters: categoryFilters,
    InStock: instock,
    OnlyExist: onlyexist,
    Pagination: pagination,
    ProductGallery: productGallery,
    QuickCart: quickCart
  } = await import(/* webpackPreload: true */ './components');

  return {
    preventEmptyLink,
    mediaQuery,
    redirect,
    Dropdown,
    Inputs,
    FocusEvent,
    Tabs,
    Select,
    Collapse,
    Modal,
    ColorChanger,
    StarRating,
    Accordion,
    MobileAccordion,
    Draggable,
    SelectColor,
    Spinner,
    PlayAudio,
    YoutubeLoader,
    Range,
    Videos,
    Swipable,
    initSliders,
    navigation,
    zuhalShops,
    categoryFilters,
    instock,
    onlyexist,
    pagination,
    productGallery,
    quickCart
  };
}

DOMLoad(() => {
  dynamicImport()
  .then(module => {
    // module.preventEmptyLink()

    const dropdowns = new module.Dropdown()
    const inputs = new module.Inputs()
    const focusEvents = new module.FocusEvent({
      selector: document.querySelectorAll('[data-zm-focus]')
    })
    const hometabs = new module.Tabs()

    const footerCollapse = new module.Collapse('[data-zm-collapse="mobile"]')
    const commentsCollapse = new module.Collapse('[data-zm-collapse="comments"]')

    const categoryFilter = new module.categoryFilters()
    const selectColors = new module.SelectColor()
    const spinner = new module.Spinner()
    const playButton = module.PlayAudio()
    const youtubeLoader = new module.YoutubeLoader()
    const commentRanges = new module.Range()
    const productVideos = new module.Videos()
    const authSwipeContent = new module.Swipable()

    const allModals = module.Modal({
      onShow: modal => console.info(`${modal!.id} is shown`),
      onClose: modal => console.info(`${modal!.id} is hidden`),
      disableScroll: true,
      disableFocus: true,
      awaitOpenAnimation: false,
      awaitCloseAnimation: false,
      debugMode: true
    })

    const accordions = new module.Accordion()
    const mobileAccordions = new module.MobileAccordion()
    const quickCart = new module.quickCart()
    // const shopSelection = new module.zuhalShops()

    module.navigation()

    dropdowns.mount()
    inputs.watch()
    focusEvents.mount()
    hometabs.mount()
    quickCart.mount()
    categoryFilter.mount()
    allModals.init()
    accordions.mount()
    selectColors.mount()
    spinner.mount()
    playButton.bind()
    youtubeLoader.mount()
    commentRanges.mount()
    productVideos.mount()
    authSwipeContent.mount()

    module.initSliders()
    module.ColorChanger()

    module.instock()
    module.onlyexist()
    module.StarRating()
    module.pagination(350)
    module.redirect()

    module.productGallery()

    module.mediaQuery(1024, true) && mobileAccordions.mount()
    module.mediaQuery(1024, true) && footerCollapse.mount()
    module.mediaQuery(1024, false) && commentsCollapse.mount()
    module.mediaQuery(1024, false) && module.Draggable()

    const selectList = [
      'shops-select-city',
      'shops-select-shop',
      'product-orders'
    ]

    for (let s = 0; s < selectList.length; s++) {
      module.Select({ elem: selectList[s] })
    }
    // shopSelection.mount()
  })
  .then(() => {
    const marquee = document.querySelector('.zm-marquee')
    marquee?.classList.add('marquee--active')
  })
})
