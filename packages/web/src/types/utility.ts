import { ICSS } from '@codeleap/styles'
import React from 'react'

export type StylesOf<C extends string> = Partial<Record<C, ICSS>>

type WithChildren<T> = T & { children?: React.ReactNode }

// You're right, this is not standard or very clean. But for some reason all the types provided by ComponentPropsWithoutRef<T> become any when imported outside the package, while this keeps working.
// It's important that the elements used are defined explicitly, otherwise typescript will throw JavascriptHeapOutOfMemory when building the package.
export type ElementMap = {
  'select': WithChildren<JSX.IntrinsicElements['select']>
  'input': WithChildren<JSX.IntrinsicElements['input']>
  'textarea': WithChildren<JSX.IntrinsicElements['textarea']>
  'button': WithChildren<JSX.IntrinsicElements['button']>
  'form': WithChildren<JSX.IntrinsicElements['form']>
  'label': WithChildren<JSX.IntrinsicElements['label']>
  'a': WithChildren<JSX.IntrinsicElements['a']>
  'img': WithChildren<JSX.IntrinsicElements['img']>
  'div': WithChildren<JSX.IntrinsicElements['div']>
  'span': WithChildren<JSX.IntrinsicElements['span']>
  'p': WithChildren<JSX.IntrinsicElements['p']>
  'section': WithChildren<JSX.IntrinsicElements['section']>
  'header': WithChildren<JSX.IntrinsicElements['header']>
  'footer': WithChildren<JSX.IntrinsicElements['footer']>
  'nav': WithChildren<JSX.IntrinsicElements['nav']>
  'article': WithChildren<JSX.IntrinsicElements['article']>
  'ul': WithChildren<JSX.IntrinsicElements['ul']>
  'ol': WithChildren<JSX.IntrinsicElements['ol']>
  'aside': WithChildren<JSX.IntrinsicElements['aside']>
}

export type NativeHTMLElement = keyof ElementMap

export type HTMLProps<T extends NativeHTMLElement> = ElementMap[T]

export type ComponentWithDefaultProps<P> = ((props: P) => JSX.Element) & { defaultProps?: Partial<P> }

export type ComponentCommonProps = {
  debugName?: string
}

export type SelectProperties<T extends Record<string | number | symbol, any>, K extends keyof T> = {
  [P in K]: T[K]
}
