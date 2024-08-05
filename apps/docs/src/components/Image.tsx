import React from 'react'
import { graphql } from 'gatsby'
import { FormTypes, TypeGuards } from '@codeleap/common'
import { CSSInterpolation } from '@emotion/serialize'

export type ImageProps = {
  source: string | FormTypes.AnyFile
  css?: CSSInterpolation | CSSInterpolation[]
  alt?: string
  objectFit?: Exclude<React.CSSProperties['objectFit'], React.CSSProperties['objectFit'][]>
  style?: CSSInterpolation
  type?: 'static' | 'dynamic'
}

export const Image = (imageProps: ImageProps) => {
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
