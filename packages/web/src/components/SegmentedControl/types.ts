import { PropsOf, ComponentVariants } from '@codeleap/common'
import { StylesOf } from '../../types'
import { ActionIcon } from '../ActionIcon'
import { SegmentedControlPresets } from './styles'

export interface SegmentedControlProps {
  options?: {label: string; value: any }[]
  /**
   * Determine if the modal is visible
  */
  value?: any
  /**
   * Determine if the modal is visible
  */
  styles?: React.ReactNode
  /**
    * Determine if the modal is visible
  */
  variants?: ComponentVariants<typeof SegmentedControlPresets>['variants']

  label?: React.ReactNode
  /**
    * Determine if the modal is visible
  */
  getItemWidth?: (item:{label: string; value: any }, idx: number, arr: {label: string; value: any }[]) => number
  /**
    * Determine if the modal is visible
  */
}

