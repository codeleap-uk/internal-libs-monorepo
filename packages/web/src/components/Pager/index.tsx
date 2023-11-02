import React from 'react'
import { AnyFunction, ComponentVariants, StylesOf, useDefaultComponentStyle, useRef, useState } from '@codeleap/common'
import { PagerComposition, PagerPresets } from './styles'
import { View } from '../View'
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
    footer?: React.ReactElement
  }

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
  }, [pageRef.current, page])

  const dragControls = useDragControls()

  const childArray = React.Children.toArray(children)

  const isFirst = page <= 0
  const isLast = page >= (childArray?.length - 1)

  const next = () => {
    setCurrentPage(isLast ? currentPage : currentPage + 1)
  }

  const previous = () => {
    setCurrentPage(isFirst ? currentPage : currentPage - 1)
  }

  return (
    <View css={[variantStyles.wrapper, style, { overflow: 'hidden' }]}>
      <View style={{ display: 'flex', flexDirection: 'row', position: 'relative', height: pageSize?.height, width: pageSize?.width }}>
        <AnimatePresence initial={false} custom={currentPage}>
          <motion.div
            key={currentPage}
            custom={currentPage}
            animate={{
              x: 0,
            }}
            initial={{
              x: pageSize.width,
            }}
            exit={{
              x: -pageSize.width,
            }}
            transition={{ type: 'tween', duration: 0.25 }}
            style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
            drag='x'
            dragControls={dragControls}
            dragElastic={0.2}
            dragConstraints={{
              left: isLast ? 0 : -30,
              right: isFirst ? 0 : 30,
            }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 0) {
                previous()
              } else if (info.offset.x < 0) {
                next()
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
