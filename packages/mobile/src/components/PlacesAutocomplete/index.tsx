import React, { useCallback } from 'react'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps, useCompositionStyles } from '@codeleap/styles'
import { useStylesFor } from '../../hooks'
import { Text } from '../Text'
import { View } from '../View'
import { PlacesAutocompleteProps } from './types'
import { MobileStyleRegistry } from '../../Registry'
import { TextInput } from '../TextInput'
import { List } from '../List'
import { Touchable } from '../Touchable'
import { EmptyPlaceholder } from '../EmptyPlaceholder'

const DefaultPlaceRow: PlacesAutocompleteProps['renderPlaceRow'] = (props) => {
  const { item, onPress, styles } = props

  console.log('item', item)

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

export const PlacesAutocomplete = (props: PlacesAutocompleteProps) => {
  const {
    style,
    itemRow,
    data = [],
    onPress,
    onValueChange,
    showClearIcon,
    showEmptyPlaceholder,
    clearIcon,
    textInputProps,
    listProps,
    emptyPlaceholderProps,
    placeRow = null,
    renderPlaceRow,
    ...rest
  } = props

  const [address, setAddress] = React.useState('')

  // console.log('teste', teste)

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

  const PlaceRow = renderPlaceRow || DefaultPlaceRow

  const _showEmptyPlaceholder = address && data?.length === 0 && showEmptyPlaceholder
  const _showClearIcon = showClearIcon && !!address?.trim?.()
  const hasRightIcon = !!textInputProps?.rightIcon

  const rightIcon = _showClearIcon && hasRightIcon ? {
    name: clearIcon,
    onPress: handleClearAddress,
  } : textInputProps?.rightIcon

  const renderItem = useCallback((props) => {
    return (
      placeRow ? placeRow : <PlaceRow onPress={handlePressAddress} {...props} />
    )
  }, [placeRow])

  return (
    // <View style={styles.wrapper}>
    <View style={['fullWidth']} {...rest}>
      {/* TODO - mudar isso para poder aceitar vários componentes, tipo um select */}
      <TextInput
        style={compositionStyles.input}
        // TODO - change this
        onChangeText={(value) => handleChangeAddress(value)}
        value={address}
        {...textInputProps}
        rightIcon={rightIcon}

      />
      {/* TODO - mudar o comportamento, tipo se fosse uma lista flutuante */}
      {/* TODO - esquema do usuário conseguir alterar o componente, talvez dê pra fazer pra trocar por um select */}
      <List
        data={data}
        renderItem={renderItem}
        ListEmptyComponent={
          _showEmptyPlaceholder ? <EmptyPlaceholder {...emptyPlaceholderProps} /> : null
        }
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
PlacesAutocomplete.defaultProps = {
  showClearIcon: false,
  showEmptyPlaceholder: true,
  clearIcon: 'x' as AppIcon,
  placeRowComponent: DefaultPlaceRow,
}

MobileStyleRegistry.registerComponent(PlacesAutocomplete)
