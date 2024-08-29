import React from 'react'
import { AnyRecord, ICSS, IJSX, StyledComponentProps } from '@codeleap/styles'
import { useStylesFor } from '../../hooks'
import { Text } from '../Text'
import { View } from '../View'
import { PlacesAutocompleteProps } from './types'
import { MobileStyleRegistry } from '../../Registry'
import { GooglePlacesAutocomplete, GooglePlaceData } from 'react-native-google-places-autocomplete'
import { PlacesAutocompleteComposition } from './styles'

type PlaceRowProps = {
  item?: GooglePlaceData
  styles?: Record<PlacesAutocompleteComposition, ICSS>
}

const PlaceRow = (props: PlaceRowProps) => {
  const { item, styles } = props

  console.log('item', item)

  const primaryText = item?.structured_formatting?.secondary_text ? `${item?.structured_formatting?.main_text},` : item?.structured_formatting?.main_text
  const secondaryText = item?.structured_formatting?.secondary_text ? `${item?.structured_formatting?.secondary_text}` : ''
  const mainTitle = `${primaryText} ${secondaryText}`

  const _title = mainTitle || item?.formatted_address

  return (
    <View style={['fullWidth', 'wrap', styles.row]} >
      <Text text={`${_title}`} style={['color:neutral8']} />
    </View>
  )
}

export const PlacesAutocomplete = (props: PlacesAutocompleteProps) => {
  const {
    style,
    ...rest
  } = props

  const styles = useStylesFor(PlacesAutocomplete.styleRegistryName, style)

  return (
    // <View style={styles.wrapper}>
    <View>
      <GooglePlacesAutocomplete
        renderRow={(item) => <PlaceRow item={item} styles={styles} />}
        {...rest}
      />
    </View>
  )
}

PlacesAutocomplete.styleRegistryName = 'PlacesAutocomplete'
PlacesAutocomplete.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return PlacesAutocomplete as (props: StyledComponentProps<PlacesAutocompleteProps, typeof styles>) => IJSX
}

MobileStyleRegistry.registerComponent(PlacesAutocomplete)
