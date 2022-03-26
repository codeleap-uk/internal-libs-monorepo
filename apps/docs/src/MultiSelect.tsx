import { Button, Icon, Select, Text, Touchable } from '@/app'
import { SelectProps } from '@codeleap/web'
import { useMemo } from 'react'

type MultiSelectProps<T extends string|number> = Omit<SelectProps<T>, 'value' | 'onValueChange'> & {
  value: T[]
  onValueChange:(val:T[])=>any
}

export const MultiSelect:React.FC<MultiSelectProps<any>> = ({ value, onValueChange, options, ...props }) => {
  const optionLabelsByValue = useMemo(() => {
    return Object.fromEntries(options.map(o => [o.value, o.label]))
  }, [options])

  function handleChange(val) {
    if (value.includes(val)) {
      onValueChange(value.filter(v => v !== val))
    } else {
      onValueChange([...value, val])
    }
  }

  function remove(item) {
    return () => {
      onValueChange(value.filter(i => i !== item))
    }
  }

  return (
    <Select
      value={options[0].value}
      autoClose={false}
      options={options}
      renderItem={(props) => {
        const isSelected = value.includes(props.value)

        return <Touchable onPress={props.onPress} propagate={false} css={props.styles.itemWrapper}>
          {
            isSelected && <Icon name='checkmark' />
          }
          <Text text={props.label}/>
        </Touchable>
      }}
      onValueChange={handleChange}
      renderCurrentlySelected={(props) => (
        <Touchable
          onPress={props.onPress}
          css={props.styles.buttonWrapper}
        >
          {
            value.length ? (
              value.map(item => <Button variants={['small']} onPress={remove(item)} rightIcon={'close'} text={optionLabelsByValue[item]}/>)
            ) : <Text text={'Select'}/>
          }
        </Touchable>
      )}
      {...props}
    />
  )
}
