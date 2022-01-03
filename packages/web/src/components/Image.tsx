/** @jsx jsx */
import { jsx } from '@emotion/react'
import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import { ComponentVariants, ImageComposition, ImageStyles, parseSourceUrl, StylesOf, useComponentStyle, useStyle } from '@codeleap/common'

import { CSSProperties } from '@emotion/serialize'

const dynamicAssetPrefixes = ['http', 'https', 'blob']
type ImageProps = {
  source: string
  
  alt?: string
  img?: string
  objectFit?: Exclude<CSSProperties['objectFit'], CSSProperties['objectFit'][]>
  styles?:StylesOf<ImageComposition>
}  & ComponentVariants<typeof ImageStyles>


export const Image:React.FC<ImageProps> = (imgProps) => {
//   const {variants = [], responsiveVariants = {}, styles, ...props } = imgProps

  //   const {Settings, logger} = useStyle()
  //   const data = useStaticQuery(query)
  //   const source = parseSourceUrl(props, Settings)
  //   const fileNode = data.allFile.nodes.find(i => source.includes(i.relativePath))

  //   logger.log('render image', { fileNode, data, props, source }, 'Component')

  //   if (!props.alt) {
  //     logger.log('missing alt property in img', { source }, 'Component')
  //   }

  //   const alt = props.alt || 'image'

  //   const isStatic = !props.img && dynamicAssetPrefixes.filter((i) => source?.startsWith(i)).length < 1

  //   const variantStyles = useComponentStyle('Image', {
  //     responsiveVariants, variants, styles,
  //   })

  //   if (isStatic) {
  //     const image = getImage(fileNode)
  //     logger.log('isStatic', { props, source, image }, 'Component')
  //     return (
  //       <GatsbyImage
  //         {...props}
  //         image={image}
  //         css={variantStyles.wrapper}
  //         alt={alt}
  //       />
  //     )
  //   } else {
  //     logger.log('not static', { props, source }, 'Component')
  //     return (
  //       <img
  //         {...props}
  //         style={null}
  //         src={source}
  //         css={variantStyles.wrapper}
  //       />
  //     )
  //   }
  return null
}





