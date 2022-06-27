import { useScrollEffect } from '@codeleap/web'
import { useStaticQuery } from 'gatsby'
import { MdxMetadata } from 'types/mdx'

export function useMdx(allMdx, moduleName:string) {

  const edges:any[] = allMdx.edges

  const flatData:MdxMetadata[] = []
  const pages = edges.reduce<Record<string, MdxMetadata[]>>((acc, x) => {
    const itemData:MdxMetadata = x.node.frontmatter
    flatData.push(itemData)
    if (itemData.module !== moduleName) return acc

    const copy = { ...acc }
    if (!itemData.category) {
      if (!copy._root_) copy._root_ = []
      copy._root_.push(itemData)
    } else if (copy[itemData.category]) {
      copy[itemData.category].push(itemData)
    } else {
      copy[itemData.category] = [itemData]
    }

    return copy
  }, {})

  return { pages, flatData }
}

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
