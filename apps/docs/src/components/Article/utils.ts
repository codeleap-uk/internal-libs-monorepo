import { capitalize, TypeGuards, usePrevious, useRef } from '@codeleap/common'
import { MdxMetadata } from 'types/mdx'

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
      const properties = inferProperties(edge.node.internal.contentFilePath)
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
      if(TypeGuards.isArray(pageContext.order)){


        const pageArr = []
        const flatData = []

        pageContext.order.forEach(i => {
          const name = capitalize(i.name)
          const pageData = pages[name]
          const subPageList = pageData.sort((a,b) => {
            const idxA = i.items.indexOf(a.filename)
            const idxB = i.items.indexOf(b.filename)
            
            return idxA - idxB
          })

          flatData.push(...subPageList)
          pageArr.push(
            [
              name,
              subPageList
            ]
          )
        })
        const currentIdx = flatData.findIndex(({ path }) => path === pageContext.pagePath)
  
        
        result.current.current = flatData[currentIdx]
        result.current.next = flatData[currentIdx + 1]
        result.current.previous = flatData[currentIdx - 1]
  
        pages = pageArr
        
      }else{
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

      }

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

