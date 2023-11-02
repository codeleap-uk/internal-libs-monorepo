import React from 'react'
import { AnyFunction, ComponentVariants, onUpdate, StylesOf, useDefaultComponentStyle, useRef, useState } from '@codeleap/common'
import { PagerComposition, PagerPresets } from './styles'
import { View, ViewProps } from '../View'
import { ComponentCommonProps } from '../../types'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { useResize } from '../../lib/useResize'

export * from './styles'

export type PagerProps =
  ComponentCommonProps &
  ComponentVariants<typeof PagerPresets> & {
    styles?: StylesOf<PagerComposition>
    page: number
    setPage: AnyFunction
    style?: React.CSSProperties
    children: React.ReactNode
    onChange?: (page: number) => void
    footer?: React.ReactElement
  }

// type DotsProps = Pick<PagerProps, 'page' | 'dotsDisabled'> & {
//   childArray: React.ReactNode[]
//   onPress?: (index: number) => void
//   variantStyles: StylesOf<PagerComposition>
// }

// const Dots = ({ page, childArray, onPress, variantStyles, dotsDisabled }: DotsProps) => {
//   return (
//     <View style={variantStyles.dots}>
//       {childArray.map((_, index) => {
//         const isSelected = index === page
//         const css = [
//           variantStyles[isSelected ? 'dot:selected' : 'dot'],
//           dotsDisabled && variantStyles['dot:disabled'],
//         ]

//         return (
//           <Touchable
//             key={index}
//             onPress={() => onPress?.(index)}
//             css={css}
//             disabled={dotsDisabled}
//           />
//         )
//       })}
//     </View>
//   )
// }

export const Pager = (props: PagerProps) => {
  const {
    styles,
    style,
    variants,
    children,
    responsiveVariants,
    page,
    setPage,
    footer,
  } = props

  const [currentPage, setCurrentPage] = [page, setPage]
  const [pageSize, setPageSize] = useState({})
  const pageRef = useRef(null)

  const variantStyles = useDefaultComponentStyle<'u:Pager', typeof PagerPresets>('u:Pager', {
    variants,
    responsiveVariants,
    styles,
  })

  useResize(() => {
    if (pageRef.current) {
      setPageSize({
        width: pageRef.current.clientWidth,
        height: pageRef.current.clientHeight
      })
    }
  }, [pageRef.current, currentPage])

  const dragControls = useDragControls()

  const childArray = React.Children.toArray(children)

  return (
    <View css={[variantStyles.wrapper, style, { overflow: 'hidden' }]}>
      <View style={{ display: 'flex', flexDirection: 'row', position: 'relative', height: pageSize?.height, width: pageSize?.width }}>
        <AnimatePresence initial={false} custom={currentPage}>
          <motion.div
            key={currentPage}
            custom={currentPage}
            animate={{ x: 0, opacity: 1 }}
            initial={(custom) => {
              return { x: custom ? pageSize?.width : -pageSize?.width, opacity: 0 }
            }}
            exit={(custom) => {
              return { x: custom ? -pageSize?.width : pageSize?.width, opacity: 0 }
            }}
            transition={{ type: 'tween', duration: 0.3 }}
            style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
            drag='x'
            dragControls={dragControls}
            onDrag={(event, info) => {
              console.log(info)
              if (info.offset.x > 80) {
                setCurrentPage(currentPage - 1)
              } else if (info.offset.x < -80) {
                setCurrentPage(currentPage + 1)
              }
            }}
            onDragEnd={(event, info) => {
              console.log('end', info)
              if (info.offset.x > 0) {
                setCurrentPage(currentPage - 1)
              } else if (info.offset.x < 0) {
                setCurrentPage(currentPage + 1)
              }
            }}
          >
            <div ref={pageRef}>{childArray[currentPage]}</div>
          </motion.div>
        </AnimatePresence>
      </View>

      {footer}
    </View>
  )
}
