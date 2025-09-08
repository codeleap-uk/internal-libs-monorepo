import React from 'react'
import { useCompositionStyles } from '@codeleap/styles'
import { EmptyPlaceholderButtonProps } from '../types'
import { useEmptyPlaceholderContext } from '../context'
import { Button } from '../../Button'
import { TypeGuards } from '@codeleap/types'

export const EmptyPlaceholderButton = (props: EmptyPlaceholderButtonProps) => {
  const { styles, buttonText, text, onPress, ...buttonProps } = useEmptyPlaceholderContext(props)

  const buttonStyles = useCompositionStyles('button', styles)

  const displayText = text || buttonText

  if (!TypeGuards.isFunction(onPress)) return null

  return (
    <Button
      {...buttonProps}
      onPress={onPress}
      debugName={`emptyPlaceholderButton:${buttonText}`}
      style={buttonStyles}
      text={displayText}
    />
  )
}
