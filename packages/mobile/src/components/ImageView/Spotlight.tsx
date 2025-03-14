import React, { useContext, useState } from 'react'
import { ReactState, TypeGuards } from '@codeleap/types'
import { onUpdate, usePrevious, useUnmount } from '@codeleap/hooks'
import { deepEqual } from '@codeleap/utils'
import uuid from 'react-native-uuid'
import { ImageView, ImageViewProps } from './component'
import { ImageProps } from '../Image'
import { ImageURISource, ImageRequireSource } from 'react-native'
import { View } from '../View'
import { Text } from '../Text'

type ImageSource = ImageURISource | ImageRequireSource

type TImage = {
  source: ImageSource
  created: number
  id: string

}
type ImageList = Record<string, TImage>

type SpotlightState = ReactState<Record<string, ImageList>>
type IndexState = ReactState<Record<string, number>>
type TSpotlightCtx = {
  spotlights: SpotlightState[0]
  setSpotlights: SpotlightState[1]
  indexes: IndexState[0]
  setIndexes: IndexState[1]
}

const SpotlightCtx = React.createContext({} as TSpotlightCtx)

export const SpotlightProvider: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
  const [spotlights, setSpotlights] = useState<TSpotlightCtx['spotlights']>({})
  const [indexes, setIndexes] = useState<TSpotlightCtx['indexes']>({})
  const ctxValue: TSpotlightCtx = {
    spotlights,
    setSpotlights,
    indexes,
    setIndexes,
  }

  return <SpotlightCtx.Provider value={ctxValue}>
    {children}
  </SpotlightCtx.Provider>
}

export function useSpotlight(name: string) {
  const ctx = useContext(SpotlightCtx)

  const imList =
    Object.values(ctx.spotlights[name] || {})

  return {
    images: imList,
    currentIndex: ctx.indexes[name],
    set(img: ImageSource, id?: string) {
      const newId = id || uuid.v4() as string
      ctx.setSpotlights((prev) => {
        const images = { ...prev[name] }

        if (id !== null) {
          images[id] = {
            ...images[id],
            source: img,
          }
        } else {
          const now = Date.now()

          images[newId] = {
            created: now,
            id: newId,
            source: img,
          }
        }

        return {
          ...prev,
          [name]: images,
        }
      })

      return newId
    },
    remove(id: string) {
      ctx.setSpotlights((prev) => {
        const images = { ...prev[name] }
        delete images[id]
        return {
          ...prev,
          [name]: images,
        }
      })
    },
    open(id: string) {
      const newIdx = imList.findIndex(x => x.id === id)
      ctx.setIndexes((prev) => ({
        ...prev,
        [name]: newIdx,
      }))
    },
    close() {

      ctx.setIndexes((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    },
    clear() {
      ctx.setIndexes((prev) => ({
        ...prev,
        [name]: undefined,
      }))
      ctx.setSpotlights((prev) => {

        return {
          ...prev,
          [name]: {},
        }
      })
    },
  }
}

export const useImageSpotlight = (name: string | null, src: ImageProps['source']) => {
  const [id, setId] = useState(null)
  const spotlight = useSpotlight(name)
  const imSource = TypeGuards.isString(src) ? { uri: src } : src as TImage['source']
  const prevSource = usePrevious(imSource)

  onUpdate(() => {
    if (!name) return
    if (deepEqual(prevSource, imSource)) return
    setId(spotlight.set(imSource, id))
  }, [src, id])

  useUnmount(() => {
    if (!name) return
    spotlight.remove(id)
  })

  return {
    onImagePressed: () => {
      spotlight.open(id)
    },
  }
}

export type SpotlightHeaderComponent = {
  imageIndex: number
  spotlight: ReturnType<typeof useSpotlight>
}

export type SpootlightFooterComponent = React.ComponentType<{
  imageIndex: number
  imagesLength: number
  spotlight: ReturnType<typeof useSpotlight>
}>

type FooterComponentProps = SpotlightHeaderComponent

export type SpotlightProps = {
  name?: string
  HeaderComponent?: (props: SpotlightHeaderComponent) => JSX.Element
  FooterComponent?: (props: FooterComponentProps) => JSX.Element
  showFooter?: boolean
} & ImageViewProps

const DefaultFooterComponent: SpootlightFooterComponent = ({ imageIndex, imagesLength }) => (
  <View><Text text={imageIndex + 1 + '/' + imagesLength} /></View>
)

export const Spotlight = (props: SpotlightProps) => {
  const { name, HeaderComponent, showFooter, FooterComponent, ...rest } = props
  const spotlight = useSpotlight(name)

  useUnmount(() => {
    spotlight.clear()
  })

  const Footer = showFooter ? FooterComponent || DefaultFooterComponent : (() => null)
  return <ImageView
    imageIndex={spotlight.currentIndex}
    images={spotlight.images.map(x => x.source)}
    keyExtractor={(_, index) => index.toString()}
    onRequestClose={spotlight.close}
    visible={typeof spotlight.currentIndex !== 'undefined'}
    {...rest}
    FooterComponent={({ imageIndex }) => <Footer imageIndex={imageIndex} spotlight={spotlight} imagesLength={spotlight.images.length} />}
    HeaderComponent={!!HeaderComponent ? ({ imageIndex }) => <HeaderComponent spotlight={spotlight} imageIndex={imageIndex} /> : undefined}
  />
}
