import { memoBy } from '@codeleap/utils'
import { Button, ButtonProps } from '../../Button'

export const SelectDefaultItem = (props: ButtonProps) => {
  console.log('RE RENDER', props?.text)

  const text = props?.selected ? 'Selected - ' + props?.text : props?.text

  return <Button {...props} text={text} />
}

export const MemoizedSelectDefaultItem = memoBy(SelectDefaultItem, 'selected')
