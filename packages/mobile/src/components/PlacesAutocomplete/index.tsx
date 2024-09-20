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
import { TypeGuards } from '@codeleap/common'
import { ActivityIndicator } from '../ActivityIndicator'

const DefaultPlaceRow: PlacesAutocompleteProps['renderPlaceRow'] = (props) => {
  const { item, onPress, styles } = props

  if (item?.content) {
    return item.content
  }

  const isLatLng = !!item?.formatted_address

  const mainTitle = isLatLng ? item?.formatted_address : item?.description

  return (
    <Touchable onPress={() => onPress(mainTitle)} debugName={`PlaceRow ${item?.place_id}`} style={styles.placeRowWrapper}>
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
    renderPlaceRow,
    activityIndicatorProps,
    debounce = 250,
    isLoading,
    persistResultsOnBlur,
    ...rest
  } = props

  const [address, setAddress] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)

  const styles = useStylesFor(PlacesAutocomplete.styleRegistryName, style)
  const compositionStyles = useCompositionStyles(['input', 'list'], styles)

  const setSearchTimeout = React.useRef<NodeJS.Timeout | null>(null)

  const handleChangeAddress = (address: string) => {
    setAddress(address)

    if (TypeGuards.isNil(debounce)) {
      onValueChange?.(address)
    } else {
      if (setSearchTimeout.current) {
        clearTimeout(setSearchTimeout.current)
      }

      setSearchTimeout.current = setTimeout(() => {

        onValueChange(address)
        setIsTyping(false)
      }, debounce ?? 0)
    }
  }

  const handlePressAddress = (address: string) => {
    setAddress(textInputProps?.value ? textInputProps?.value : address)
    onPress?.(address)
  }

  const handleClearAddress = () => {
    setAddress('')
    onValueChange?.('')
  }

  const PlaceRow = renderPlaceRow || DefaultPlaceRow

  const _showEmptyPlaceholder = !!address && !isTyping && showEmptyPlaceholder && !isLoading

  const showResults = isFocused || persistResultsOnBlur

  const _showClearIcon = showClearIcon && !!address?.trim?.()
  const hasRightIcon = !!textInputProps?.rightIcon

  const rightIcon = _showClearIcon && hasRightIcon ? {
    name: clearIcon,
    onPress: handleClearAddress,
  } : textInputProps?.rightIcon

  const _data = !!customData && address ? [...customData, ...data] : data

  const renderItem = useCallback((props) => {
    return (
      placeRow ? placeRow : <PlaceRow onPress={handlePressAddress} styles={styles} {...props} />
    )
  }, [placeRow])

  return (
    <View style={styles.wrapper} {...rest}>
      <TextInput
        style={compositionStyles.input}
        onChangeText={(value) => {
          setIsTyping(true)
          handleChangeAddress(value)
        }}
        onBlur={() => {
          setIsFocused(false)
        }}
        onFocus={() => {
          setIsFocused(true)
        }}
        {...textInputProps}
        value={address}
        rightIcon={rightIcon}
      />
      {isTyping ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator {...activityIndicatorProps} />
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
