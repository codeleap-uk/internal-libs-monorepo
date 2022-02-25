import { Checkbox, RadioInput, Text, TextInput, View } from '@/app'

import { beautifyName } from '../utils/variant'

type PropControllerProps = {
  values: Record<string, any>
  onChange(p: string, v: any): void
  controls: Record<string, any>
}

export const PropController = ({
  values,
  onChange,
  controls,
}: PropControllerProps) => {
  return (
    <View variants={['column']}>
      <Text text='Props' variants={['marginTop:2']} />
      {Object.entries(controls).map(([propName, initialValue]) => {
        const setValue = (v) => onChange(propName, v)
        const value = values[propName]
        const label = beautifyName(propName)

        let component = null

        switch (typeof initialValue) {
          case 'boolean':
            component = (
              <Checkbox
                onValueChange={setValue}
                checked={value}
                label={label}
              />
            )
            break
          case 'string':
            const isColor = initialValue.startsWith('#')
            if (isColor) {
              component = (
                <View component='label' variants={['column']}>
                  <Text text={label} variants={['marginBottom:1']} />
                  <input
                    type={'color'}
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                  />
                </View>
              )
            } else {
              component = (
                <TextInput
                  onChangeText={setValue}
                  value={value}
                  label={label}
                  debugName={label}
                  variants={['pill', 'white']}
                />
              )
            }
            break
          case 'object':
            if (Array.isArray(initialValue)) {
              component = null
            } else {
              component = (
                <RadioInput
                  label={label}
                  options={Object.entries(initialValue).map(
                    ([label, value]) => ({ label, value }),
                  )}
                  value={value}
                  onValueChange={setValue}
                />
              )
            }
            break
          default:
            component = null
            break
        }

        return (
          <View variants={['marginVertical:2', 'column']} key={propName}>
            {component}
          </View>
        )
      })}
    </View>
  )
}
