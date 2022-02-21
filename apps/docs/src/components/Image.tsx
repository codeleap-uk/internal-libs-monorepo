/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/react'
import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import {
  ComponentVariants,
  ImageComposition,
  ImageStyles,
  parseSourceUrl,
  StylesOf,
  useDefaultComponentStyle,
  useCodeleapContext,
} from '@codeleap/common'
import { CSSProperties } from 'react'

// const dynamicAssetPrefixes = ['http', 'https', 'blob']

type CommonProps = {
  source: string;
  css?: any;
  alt?: string;
  objectFit?: Exclude<CSSProperties['objectFit'], CSSProperties['objectFit'][]>;
  styles?: StylesOf<ImageComposition>;
  style?:any
} & ComponentVariants<typeof ImageStyles>;

type StaticImageProps = {
    type?: 'static'
}
type DynamicImageProps = {
  type?: 'dynamic'
  
}

type ImageProps = (StaticImageProps | DynamicImageProps) & CommonProps 

// export const Image: React.FC<ImageProps> = (imgProps) => {
//   const {
//     variants = [],
//     responsiveVariants = {},
//     styles,
//     objectFit,
//     req,
//     ...props
//   } = imgProps


//   if (!props.alt) {
//     logger.log('missing alt property in img', { source }, 'Component')
//   }

//   const alt = props.alt || 'image'

//   const isStatic =
//     !props.img &&
//     !req &&
//     dynamicAssetPrefixes.filter((i) => source?.startsWith(i)).length < 1


//   if (isStatic) {
//     const image = getImage(fileNode)
//     logger.log('isStatic', { props, source, image }, 'Component')
//     return (
//       <GatsbyImage
//         {...props}
//         objectFit={objectFit}
//         image={image}
//         css={variantStyles.wrapper}
//         alt={alt}
//       />
//     )
//   }

//   logger.log('not static', { props, source }, 'Component')
//   return (
//     <img
//       {...props}
//       style={{ objectFit }}
//       src={source}
//       css={variantStyles.wrapper}
//     />
//   )
// }

const StaticImage = (props) => {
  const { Settings, logger } = useCodeleapContext()
  const data = useStaticQuery(query)
  const source = parseSourceUrl(props, Settings)
  const fileNode = data.allFile.nodes.find((i) => source.includes(i.relativePath),
  )

  const image = getImage(fileNode)

  return (
    <GatsbyImage
      {...props}
      image={image}
    />
  )
}

export const Image:React.FC<ImageProps> = (imageProps) => {
  const {
    source,
    type = 'static',
    variants,
    responsiveVariants,
    styles,
    objectFit,
    style,
    ...props
  } = imageProps

  const variantStyles = useDefaultComponentStyle('Image', {
    responsiveVariants,
    variants,
    styles,
  })

  if (type === 'static'){
    return (
      <StaticImage 
        source={source}
        {...props}
        objectFit={objectFit}
        css={[variantStyles.wrapper, style]}
      />
    )
  } else {
    return (
      <img
        {...props}
        style={{ objectFit }}
        src={source}
        css={[variantStyles.wrapper, style]}
      />
    )
  }
}


const query = graphql`
  query {
    allFile(filter: { internal: { mediaType: { regex: "/image/" } } }) {
      nodes {
        childImageSharp {
          gatsbyImageData
        }
        relativePath
      }
    }
  }
`
