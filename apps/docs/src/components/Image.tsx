import React from 'react'
import { graphql } from 'gatsby'
import { FormTypes, StylesOf, TypeGuards } from '@codeleap/common'
import { CSSInterpolation } from '@emotion/serialize'

type CommonProps = {
  source: string | FormTypes.AnyFile
  css?: CSSInterpolation | CSSInterpolation[]
  alt?: string
  objectFit?: Exclude<React.CSSProperties['objectFit'], React.CSSProperties['objectFit'][]>
  style?: CSSInterpolation
}

type StaticImageProps = {
  type?: 'static'
}

type DynamicImageProps = {
  type?: 'dynamic'
}

export type ImageProps = (StaticImageProps | DynamicImageProps) & CommonProps

export const Image:React.FC<ImageProps> = (imageProps) => {
  const {
    source,
    type = 'static',
    objectFit,
    style = {},
    ...props
  } = imageProps

  const imageFit = TypeGuards.isString(objectFit) && { objectFit }

  return (
    <img
      {...props}
      src={source as HTMLImageElement['src']}
      css={[imageFit, style]}
    />
  )
}

const query = graphql`
  query {
    allFile(filter: { internal: { mediaType: { regex: "/images/" } } }) {
      nodes {
        childImageSharp {
          gatsbyImageData
        }
        relativePath
      }
    }
  }
`
