
import RInputMask from 'react-input-mask'

type beforeMaskedValueChangeArgs = {
  state: {
    value: string | undefined
    selection: {
      start: number
      end: number
      length?: number
    }
  }
  userInput: null | string
}

export type InputMaskProps = {
  mask?: string
  maskChar?: string
  maskFormatChars?: Record<string, `[${string}]`>
  alwaysShowMask?: boolean
  beforeMaskedValueChange?: (
    newState: beforeMaskedValueChangeArgs['state'], 
    oldState: beforeMaskedValueChangeArgs['state'], 
    userInput: beforeMaskedValueChangeArgs['userInput']
  ) => beforeMaskedValueChangeArgs['state']
}

const InputMask = ({ maskFormatChars = null, ...rest }: HTMLInputElement & InputMaskProps) => (
  <RInputMask {...rest} formatChars={maskFormatChars} />
)

export {
  InputMask,
}
