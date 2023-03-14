import React, { useRef } from 'react'
import { ComponentVariants, getNestedStylesByKey, onUpdate, useDefaultComponentStyle, useMemo } from "@codeleap/common"
import { useDynamicAnimation } from "moti"
import { StyleSheet } from "react-native"
import { StylesOf } from "../../types"
import { ActivityIndicator } from "../ActivityIndicator"
import { View } from "../View"
import { LoadingOverlayComposition, LoadingOverlayStyles } from "./styles"
import {useStaticAnimationStyles} from '../../utils'

export * from './styles'

export type LoadingOverlayProps = React.PropsWithChildren<{
    variants?: ComponentVariants<typeof LoadingOverlayStyles>['variants']
    styles?: StylesOf<LoadingOverlayComposition>
    visible?: boolean
} >


export const LoadingOverlay = (props: LoadingOverlayProps) => {
    const {
        children,
        styles,
        variants,
        visible
    } = props

    const variantStyles = useDefaultComponentStyle<'u:LoadingOverlay', typeof LoadingOverlayStyles>('u:LoadingOverlay', {
        variants,
        rootElement: 'wrapper',
        styles,
        transform: StyleSheet.flatten,
    })


    const loaderStyles = useMemo(() => getNestedStylesByKey('loader', variantStyles), [variantStyles])
    
    const wrapperAnimationStates = useStaticAnimationStyles(variantStyles, ['wrapper:hidden','wrapper:visible'])
    const wrapperAnimation = useDynamicAnimation(() => {
        return visible ? wrapperAnimationStates["wrapper:visible"] : wrapperAnimationStates["wrapper:hidden"]
    })

    onUpdate(() => {
        wrapperAnimation.animateTo(visible ? wrapperAnimationStates["wrapper:visible"] : wrapperAnimationStates["wrapper:hidden"])
    }, [visible])
    
    const transition = useRef(null)
    if(!transition.current){
        transition.current = JSON.parse(JSON.stringify(variantStyles["wrapper:transition"]))
    }
    return <View style={variantStyles.wrapper} animated state={wrapperAnimation} transition={transition.current}>
        <ActivityIndicator styles={loaderStyles}/>
        {children}
    </View>
}