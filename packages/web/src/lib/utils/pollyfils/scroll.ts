// native smooth scrolling for Chrome, Firefox & Opera
// @see: https://caniuse.com/#feat=css-scroll-behavior
const nativeSmoothScrollTo = (elem, pad = 0) => {
  if (!window) return
  window.scroll({
    behavior: 'smooth',
    left: 0,
    top: elem.getBoundingClientRect().top + window.pageYOffset + pad,
  })
}

// polyfilled smooth scrolling for IE, Edge & Safari
const smoothScrollTo = (to, duration) => {
  if (!document) return
  const element = document.scrollingElement || document.documentElement,
    start = element.scrollTop,
    change = to - start,
    startDate = +new Date()

  // t = current time
  // b = start value
  // c = change in value
  // d = duration
  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  }

  const animateScroll = () => {
    const currentDate = +new Date()
    const currentTime = currentDate - startDate
    element.scrollTop = parseInt(
      easeInOutQuad(currentTime, start, change, duration),
    )
    if (currentTime < duration) {
      requestAnimationFrame(animateScroll)
    } else {
      element.scrollTop = to
    }
  }
  animateScroll()
}

// detect support for the behavior property in ScrollOptions

// smooth scrolling stub
export const scrollToElem = (elemSelector, padOffsets = [0, 0]) => {
  if (!document) return
  const supportsNativeSmoothScroll =
    'scrollBehavior' in document.documentElement.style || {}
  if (!elemSelector) {
    return
  }

  const elem = document.querySelector(elemSelector)
  if (elem) {
    if (supportsNativeSmoothScroll) {
      nativeSmoothScrollTo(elem, padOffsets[0])
    } else {
      smoothScrollTo(elem.offsetTop + padOffsets[0], 600)
    }
  }
}
