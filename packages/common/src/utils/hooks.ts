/* eslint-disable max-lines */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-restricted-imports */
import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  useMemo,
  useCallback,
  useContext,
  useLayoutEffect,
  useDebugValue,
  useReducer,
  useId as useReactId,
} from 'react'
import { deepMerge } from './object'
import { AnyFunction, DeepPartial, StylesOf } from '../types'
import { getNestedStylesByKey } from './misc'
import { useCodeleapContext } from '../styles/StyleProvider'
import { TypeGuards } from '.'
import type { SetStateAction, Dispatch } from 'react'

export { default as useUnmount } from 'react-use/lib/useUnmount'
export {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  useMemo,
  useCallback,
  useContext,
  useLayoutEffect,
  useDebugValue,
  useReducer,
}

