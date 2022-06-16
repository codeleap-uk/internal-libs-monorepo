import React from 'react'
import { useCodeleapContext } from '@codeleap/common'
import { View, ViewProps } from './View'

type GapProps = ViewProps & {
    value: number

    defaultProps?: any
}

export const Gap:React.FC<GapProps> = ({ children, value, defaultProps = {}, ...props }) => {
  const { Theme } = useCodeleapContext()
  const horizontal = props.variants?.includes('row')
  return (
    <View {...props}>
      {
        React.Children.toArray(children).map((Element, idx, childArr) => {
          if (React.isValidElement(Element)) {
            const props = { ...Element.props, ...defaultProps }

            let spacingFunction = horizontal ? 'marginHorizontal' : 'marginVertical'
            switch (idx) {
              case 0:
                spacingFunction = horizontal ? 'marginRight' : 'marginBottom'
                break
              case childArr.length - 1:
                spacingFunction = horizontal ? 'marginLeft' : 'marginTop'
                break
              default:
                break
            }
            props.style = [props.style, Theme.spacing[spacingFunction](value / 2)]
            return React.cloneElement(Element, props)
          }
          return Element
        })
      }
    </View>
  )
}
