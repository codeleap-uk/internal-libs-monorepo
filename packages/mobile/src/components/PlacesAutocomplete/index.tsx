import React, { useCallback } from 'react'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps, useCompositionStyles } from '@codeleap/styles'
import { useStylesFor } from '../../hooks'
import { Text } from '../Text'
import { View } from '../View'
import { PlaceItem, PlacesAutocompleteProps } from './types'
import { MobileStyleRegistry } from '../../Registry'
import { TextInput } from '../TextInput'
import { List } from '../List'
import { Touchable } from '../Touchable'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { ActivityIndicator } from '../ActivityIndicator'
import { usePlacesAutocompleteUtils } from '@codeleap/hooks'

export * from './styles'
export * from './types'

const DefaultPlaceRow: PlacesAutocompleteProps['renderPlaceRow'] = (props) => {
  const { item, onPress, styles } = props

  if (item?.content) {
    return item?.content
  }

  const isLatLng = !!item?.formatted_address

  const mainTitle = isLatLng ? item?.formatted_address : item?.description

  return (
    <Touchable onPress={() => onPress(mainTitle, item)} debugName={`PlaceRow ${item?.place_id}`} style={styles.placeRowWrapper}>
      <Text text={`${mainTitle}`} style={styles.placeRowText} />
    </Touchable>
  )
}

export const PlacesAutocomplete = (props: PlacesAutocompleteProps) => {
  const {
    style,
    itemRow,
    data = [],
    customData = [],
    onPress,
    onValueChange,
    showClearIcon,
    showEmptyPlaceholder,
    clearIcon,
    textInputProps,
    listProps,
    emptyPlaceholderProps,
    placeRow = null,
    renderPlaceRow: PlaceRow,
    activityIndicatorProps,
    debounce,
    isLoading,
    persistResultsOnBlur,
    ...rest
  } = props

  const [isFocused, setIsFocused] = React.useState(false)

  const styles = useStylesFor(PlacesAutocomplete.styleRegistryName, style)
  const compositionStyles = useCompositionStyles(['input', 'list', 'loader'], styles)

  const hasCustomValue = !!textInputProps?.value

  const {
    handleChangeAddress,
    handlePressAddress,
    handleClearAddress,
    address,
    isTyping,
    setIsTyping,
  } = usePlacesAutocompleteUtils<PlaceItem>({
    onValueChange,
    onPress,
    debounce: hasCustomValue ? null : 250
  })

  const _showEmptyPlaceholder = !!address && !isTyping && showEmptyPlaceholder && !isLoading

  const showResults = isFocused || persistResultsOnBlur

  const _showClearIcon = showClearIcon && !!address?.trim?.()

  const rightIcon = _showClearIcon ? {
    name: clearIcon,
    onPress: handleClearAddress,
  } : textInputProps?.rightIcon

  const _data = customData?.length > 0 && address ? [...customData, ...data] : data

  const renderItem = useCallback((props) => {
    return (
      placeRow ? placeRow : <PlaceRow onPress={handlePressAddress} styles={styles} {...props} />
    )
  }, [placeRow])

  return (
    <View style={styles.wrapper} {...rest}>
      <TextInput
        style={compositionStyles.input}
        onBlur={() => {
          setIsFocused(false)
        }}
        onFocus={() => {
          setIsFocused(true)
        }}
        {...textInputProps}
        value={hasCustomValue ? textInputProps?.value : address}
        onValueChange={(value) => {
          setIsTyping(true)
          handleChangeAddress(value)
        }}
        rightIcon={rightIcon}
      />
      {isTyping ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator style={compositionStyles.loader} {...activityIndicatorProps} />
        </View>
      ) : (
        showResults ? (
          <List
            data={_data}
            renderItem={renderItem}
            ListEmptyComponent={
              _showEmptyPlaceholder ? <EmptyPlaceholder {...emptyPlaceholderProps} /> : null
            }
            style={compositionStyles.list}
            separators
            {...listProps}
          />
        ) : null
      )
      }
    </View>
  )
}

PlacesAutocomplete.styleRegistryName = 'PlacesAutocomplete'
PlacesAutocomplete.elements = ['wrapper', 'input', 'list', 'loader', 'placeRow', 'loadingWrapper']
PlacesAutocomplete.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return PlacesAutocomplete as (props: StyledComponentProps<PlacesAutocompleteProps, typeof styles>) => IJSX
}

PlacesAutocomplete.defaultProps = {
  showClearIcon: false,
  showEmptyPlaceholder: true,
  clearIcon: 'x' as AppIcon,
  placeRowComponent: DefaultPlaceRow,
  renderPlaceRow: DefaultPlaceRow,
  debounce: 250,
}

MobileStyleRegistry.registerComponent(PlacesAutocomplete)
