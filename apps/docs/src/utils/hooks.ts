import { useScrollEffect } from '@codeleap/web'

export function useIsInViewport(id:string, cb:(is:boolean) => any) {
  useScrollEffect(() => {
    const myElement = document.getElementById(id)
    const bounding = myElement.getBoundingClientRect()

    if (bounding.top >= 0 &&
       bounding.left >= 0 &&
       bounding.right <= window.innerWidth &&
       bounding.bottom <= window.innerHeight
    ) {

      cb(true)
    } else {
      cb(false)
    }

  }, 0, [id])
}
