import React from 'react'
import { AnyRecord, ICSS, IJSX, StyledComponentProps, useCompositionStyles } from '@codeleap/styles'
import { useStylesFor } from '../../hooks'
import { Text } from '../Text'
import { View } from '../View'
import { PlacesAutocompleteProps, Predictions } from './types'
import { MobileStyleRegistry } from '../../Registry'
import { PlacesAutocompleteComposition } from './styles'
import { TextInput } from '../TextInput'
import { List } from '../List'
import { Touchable } from '../Touchable'

type PlaceRowProps = {
  // TODO - type this later
  item?: Predictions
  styles?: Record<PlacesAutocompleteComposition, ICSS>
  onPress?: PlacesAutocompleteProps['onPress']
}

const _PlaceRow = (props: PlaceRowProps) => {
  const { item, onPress, styles } = props

  const primaryText = item?.structured_formatting?.secondary_text ? `${item?.structured_formatting?.main_text},` : item?.structured_formatting?.main_text
  const secondaryText = item?.structured_formatting?.secondary_text ? `${item?.structured_formatting?.secondary_text}` : ''
  const mainTitle = `${primaryText} ${secondaryText}`

  return (
    <Touchable onPress={() => onPress(mainTitle)} debugName={`PlaceRow ${item?.place_id}`}>
      {/* TODO - stylesheet */}
      <Text text={`${mainTitle}`} style={['color:neutral8', 'wrap', 'padding:1.5']} />
    </Touchable>
  )
}

// TODO - add default props
export const PlacesAutocomplete = (props: PlacesAutocompleteProps) => {
  const {
    style,
    itemRow,
    textInputProps,
    listProps,
    data,
    onPress,
    onValueChange,
    // TODO - default prop
    showClearIcon = false,
    ...rest
  } = props

  const [address, setAddress] = React.useState('')

  const styles = useStylesFor(PlacesAutocomplete.styleRegistryName, style)
  const compositionStyles = useCompositionStyles(['input', 'list'], styles)

  const handleChangeAddress = (address: string) => {
    setAddress(address)
    onValueChange?.(address)
  }

  const handlePressAddress = (address: string) => {
    setAddress(address)
    onPress?.(address)
  }

  const handleClearAddress = () => {
    setAddress('')
    onValueChange?.('')
  }

  const PlaceRow = _PlaceRow

  return (
    // <View style={styles.wrapper}>
    <View style={['fullWidth']} {...rest}>
      <TextInput
        style={compositionStyles.input}
        // TODO - change this
        rightIcon={showClearIcon && !!address?.trim?.() && !textInputProps?.rightIcon ? {
          name: 'x',
          onPress: handleClearAddress,
        } : {
          ...textInputProps?.rightIcon,
        }}
        onChangeText={(value) => handleChangeAddress(value)}
        value={address}
        {...textInputProps}
      />
      {/* TODO - mudar o comportamento, tipo se fosse uma lista flutuante */}
      {/* TODO - esquema do usuário conseguir alterar o componente, talvez dê pra fazer pra trocar por um select */}
      <List
        data={data}
        // TODO - change this to render outside components
        renderItem={(props) => {
          const { item } = props
          console.log('printing everything', props)

          return (
            <PlaceRow onPress={handlePressAddress} item={item} />
          )
        }}
        // TODO - change this to a better way to handle empty lists
        ListEmptyComponent={() => null}
        // style={compositionStyles.list}
        // TODO - put this into the stylesheet
        style={[{ flexGrow: 0 }]}
        separators
        {...listProps}
      />
    </View>
  )
}

PlacesAutocomplete.styleRegistryName = 'PlacesAutocomplete'
PlacesAutocomplete.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return PlacesAutocomplete as (props: StyledComponentProps<PlacesAutocompleteProps, typeof styles>) => IJSX
}

MobileStyleRegistry.registerComponent(PlacesAutocomplete)
