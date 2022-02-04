import * as  React from 'react'
import * as Animatable from 'react-native-animatable'
import { ComponentVariants, IconPlaceholder, OverlayComposition, OverlayStyles, useComponentStyle } from "@codeleap/common"
import { ReactNode } from "react"
import {  InputLabel } from "./TextInput"
import { Button } from './Button'

import { View,AnimatedView  } from "./View"
import { StylesOf } from "../types/utility"
import { StyleSheet, ViewProps, Pressable } from "react-native"


export type OverlayProps = ViewProps & {
    title?: ReactNode
    visible?: boolean
    showClose?: boolean
    variants?: ComponentVariants<typeof OverlayStyles>
    styles?: StylesOf<OverlayComposition>
    style?: any
    onPress?:() => void
}   

const AnimatedTouchable = Animatable.createAnimatableComponent(Pressable)

export const Overlay:React.FC<OverlayProps> = (overlayProps) => {

    const {
        showClose,
        title,
        children,
        visible,
        styles,
        style,
        variants,
        ...props
    } = overlayProps

    const variantStyles = useComponentStyle('Overlay', {
        styles,
        transform: StyleSheet.flatten,
        variants: variants as any
    })



    return <AnimatedView 
        pointerEvents={visible ? 'auto' : 'none'}
    > 
        <AnimatedTouchable      
            // @ts-ignore
            transition={'opacity'}
            style={[variantStyles.wrapper, styles.wrapper, visible && variantStyles['wrapper:visible'], visible && styles['wrapper:visible']]}
            {...props}
        >
        
            {
                (title || showClose) && (
                    <View style={variantStyles.header}>
                        <InputLabel style={variantStyles.title} label={title}/>
                        {
                            showClose && <Button variants={['icon']} icon={'close' as IconPlaceholder} style={variantStyles.closeButton}/>
                        }
                    </View>
                )
            }

        </AnimatedTouchable>
        {children}
    </AnimatedView>
}