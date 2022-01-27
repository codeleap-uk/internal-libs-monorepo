import * as React from 'react'
import { ComponentVariants, ImageStyles, useComponentStyle } from "@codeleap/common"
import { ComponentPropsWithoutRef } from "react"
import { Image as NativeImage } from 'react-native'

export type ImageProps = ComponentPropsWithoutRef<typeof NativeImage> & {
    variants?: ComponentVariants<typeof ImageStyles>['variants']
}

export const Image:React.FC<ImageProps> = (props) => {
    const {
        variants,
        style,
        ...imageProps
    } = props
    
    const variantStyles = useComponentStyle('Image', {variants})

    const styles = [variantStyles.wrapper, style]

    return <NativeImage 
        style={styles}
        {...imageProps}
    />
}