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

    if (copy[itemData.category]) {
      copy[itemData.category].push(itemData)
    } else {
      copy[itemData.category] = [itemData]
    }

    return copy
  }, {})

  return { pages, flatData }
}
