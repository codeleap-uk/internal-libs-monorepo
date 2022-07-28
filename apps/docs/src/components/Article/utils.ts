import { capitalize, usePrevious, useRef } from '@codeleap/common'
import { MdxMetadata } from 'types/mdx'

const characterReplaceMap = new Map([
  [/\s/g, '-'],
  [/\./g, '-'],
  [/[\?,’'"…]/g, ''],
  // [/\,/g, ''],
])

export function getHeadingId(content:string) {
  let sectionId = content

  characterReplaceMap.forEach((replaceWith, replace) => {
    sectionId = sectionId.replace(replace, replaceWith)
  })

  return `section-${sectionId}`
}

const { inferProperties } = require('./inferProperties')

export {
  inferProperties,
}

export function useMdx(allMdx, pageContext) {
  const moduleName:string = pageContext.module

  const result = useRef(null)
  const prevPath = usePrevious(pageContext.pagePath)
  if (!result.current || prevPath !== pageContext.pagePath) {
    result.current = {}
    let pages = {}
    const flatData = []
    allMdx.edges.forEach(edge => {
      const properties = inferProperties(edge.node.fileAbsolutePath)
      const frontMatter = edge.node.frontmatter

      const itemData:MdxMetadata = {
        ...frontMatter,
        ...properties,
      }
      flatData.push(itemData)
      if (itemData.module !== moduleName) return

      const categoryTitle = capitalize(itemData.category)

      if (!pages[categoryTitle]) {
        pages[categoryTitle] = []
      }

      pages[categoryTitle].push(itemData)
    })

    if (pageContext?.order) {
      const orderedFlatData = []
      const orderKeys = [...(pageContext.order?.__categories__ || Object.keys(pageContext.order))]
      let orderedPages = Object.entries<MdxMetadata[]>(pages).sort((a, b) => {
        const aIdx = orderKeys.indexOf(a[0])
        const bIdx = orderKeys.indexOf(b[0])
        return aIdx - bIdx
      })

      orderedPages = orderedPages.map(([category, pageList]) => {
        const order = pageContext?.order?.[category]
        if (order) {
          pageList = pageList.sort((a, b) => {
            const aIdx = order.indexOf(a.filename)
            const bIdx = order.indexOf(b.filename)
            return aIdx - bIdx
          })
        }
        orderedFlatData.push(...pageList)

        return [category, pageList]
      })
      const currentIdx = orderedFlatData.findIndex(({ path }) => path === pageContext.pagePath)

      result.current.current = orderedFlatData[currentIdx]
      result.current.next = orderedFlatData[currentIdx + 1]
      result.current.previous = orderedFlatData[currentIdx - 1]

      pages = orderedPages

    } else {
      pages = Object.entries(pages)
    }

    result.current.pages = pages
    result.current.flatData = flatData

  }

  return result.current || {
    pages: [],
    flatData: [],
  }
}

