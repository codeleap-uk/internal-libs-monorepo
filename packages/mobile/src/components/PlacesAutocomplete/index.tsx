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

  // console.log('printing item item item details true true', JSON.stringify(item, null, 2))

  if (item?.content) {
    return item.content
  }

  const isLatLng = !!item?.formatted_address

  const mainTitle = isLatLng ? item?.formatted_address : item?.description

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
    ...rest
  } = props

  const [address, setAddress] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)

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
    setAddress(address)
    onPress?.(address)
  }

  const handleClearAddress = () => {
    setAddress('')
    onValueChange?.('')
  }

  const PlaceRow = renderPlaceRow || DefaultPlaceRow

  const _showEmptyPlaceholder = address && data?.length === 0 && !isTyping && showEmptyPlaceholder

  console.log('address', address)
  console.log('data?.length', data?.length)

  const _showClearIcon = showClearIcon && !!address?.trim?.()
  const hasRightIcon = !!textInputProps?.rightIcon

  const rightIcon = _showClearIcon && hasRightIcon ? {
    name: clearIcon,
    onPress: handleClearAddress,
  } : textInputProps?.rightIcon

  const _data = !!customData && address ? [...customData, ...data] : data
  // console.log('data', data)

  const renderItem = useCallback((props) => {
    return (
      placeRow ? placeRow : <PlaceRow onPress={handlePressAddress} {...props} />
    )
  }, [placeRow])

  return (
    <View style={['fullWidth']} {...rest}>
      <TextInput
        style={compositionStyles.input}
        onChangeText={(value) => {
          setIsTyping(true)
          handleChangeAddress(value)
        }}
        // value={address}
        {...textInputProps}
        value={address}
        rightIcon={rightIcon}
      />
      {isTyping ? (
        // TODO - put this into the stylesheet
        <View style={['alignCenter', 'justifyCenter']}>
          <ActivityIndicator {...activityIndicatorProps} />
        </View>
      ) : (
        <List
          data={_data}
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
      )}

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
