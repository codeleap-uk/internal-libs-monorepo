import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const BASE_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
const BASE_URL_DETAILS = 'https://maps.googleapis.com/maps/api/place/details/json'
const BASE_URL_GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json'

const latLngRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/

type Params = {
  input?: string
  key?: string
  showDetails?: boolean
}

export const retrievePlaceDetails = async (placeId: string, apiKey: string) => {
  const response = await axios.get(BASE_URL_DETAILS, {
    params: {
      place_id: placeId,
      key: apiKey,
    },
  })

  return response?.data?.result
}

export const retrievePlaces = async (params: Params) => {
  let response
  const inputWithoutSpaces = params?.input?.replace(/\s/g, '')
  const isLatLng = latLngRegex?.test(inputWithoutSpaces)

  if (isLatLng) {
    response = await axios?.get(BASE_URL_GEOCODING, { params: { latlng: params?.input, key: params?.key } })
  } else {
    response = await axios?.get(BASE_URL, { params })
  }

  let places = response?.data?.results || response?.data?.predictions

  if (params?.showDetails) {
    const apiKey = params?.key
    places = await Promise.all(
      places?.map(async (place) => {
        const placeId = place?.place_id
        const details = await retrievePlaceDetails(placeId, apiKey)
        return { ...place, details }
      }),
    )
  }

  return places
}

export type UsePlacesParams = Params

export const usePlaces = (params: Params) => {
  const places = useQuery({
    queryKey: ['places', params],
    queryFn: () => retrievePlaces(params),
  })

  return places
}
