import { AppIcon } from '@codeleap/styles'
import { useTabContext } from './Context'
import { memoBy } from '@codeleap/utils'
import { TabPropsWithCtx } from './types'
import { Touchable } from '../Touchable'
import { Icon } from '../Icon'
import { Text } from '../Text'

type TabProps = {
  value: string
  text?: string
  icon?: AppIcon
  disabled?: boolean
}

const TabMemoized = memoBy((props: TabPropsWithCtx<TabProps>) => {
  const {
    value,
    text,
    icon,
    active,
    setValue,
    styles,
    disabled
  } = props

  return (
    <Touchable
      style={[
        styles?.tabWrapper,
        active && styles?.['tabWrapper:active'],
        disabled && styles?.['tabWrapper:disabled']
      ]}
      onPress={() => setValue(value)}
      debugName={`tabs:${value}`}
    >
      <Icon
        style={[
          styles?.tabIcon,
          active && styles?.['tabIcon:active'],
          disabled && styles?.['tabIcon:disabled']
        ]}
        name={icon}
      />

      <Text
        style={[
          styles?.tabText,
          active && styles?.['tabText:active'],
          disabled && styles?.['tabText:disabled']
        ]}
        text={text}
      />
    </Touchable>
  )
}, ['icon', 'text', 'active', 'styles', 'disabled'])

export const Tab = (props: TabProps) => {
  const { value, setValue, styles } = useTabContext()

  const active = value === props.value

  return <TabMemoized
    {...props}
    active={active}
    setValue={setValue}
    styles={styles}
  />
}