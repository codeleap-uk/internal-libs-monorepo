import { TooltipPresets, TooltipComposition } from '@codeleap/web'
import { keyframes } from '@emotion/react'
import { variantProvider } from '../theme'

const createTooltipStyle = variantProvider.createVariantFactory<TooltipComposition>()

const slideUpAndFade = keyframes`
  from {
    opacity: 0;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }    
`
const slideDownAndFade = keyframes`
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`
const slideRightAndFade = keyframes`
  from {
    opacity: 0;
    transform: translateX(-2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`
const slideLeftAndFade = keyframes`
  from {
    opacity: 0;
    transform: translateX(2px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`
export const AppTooltipStyles = {
  ...TooltipPresets,
  default: createTooltipStyle((theme) => {

    const wrapperDefaultStyle = {
      position: 'relative',
      ...theme.spacing.padding(2),
      borderRadius: theme.borderRadius.tiny,
      backgroundColor: theme.colors.neutral2,
      width: '100%',
      height: '100%',
      userSelect: 'none',
      animationDuration: '400ms',
      animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      fill: theme.colors.neutral2,
    }

    return {
      wrapper: {
        ...wrapperDefaultStyle,
      },
      'wrapper:left': {
        ...wrapperDefaultStyle,
        animationName: slideRightAndFade,
      },
      'wrapper:right': {
        ...wrapperDefaultStyle,
        animationName: slideLeftAndFade,
      },
      'wrapper:top': {
        ...wrapperDefaultStyle,
        animationName: slideDownAndFade,
      },
      'wrapper:bottom': {
        ...wrapperDefaultStyle,
        animationName: slideUpAndFade,
      },
    }
  }),
  rounded: createTooltipStyle((theme) => ({
    wrapper: {
      borderRadius: theme.borderRadius.rounded,
    },
  })),
  bare: createTooltipStyle((theme) => ({
    wrapper: {
      ...theme.spacing.padding(0),
    },
  })),
  small: createTooltipStyle((theme) => ({
    wrapper: {
      ...theme.spacing.padding(1),
    },
  })),
  large: createTooltipStyle((theme) => ({
    wrapper: {
      ...theme.spacing.padding(4),
    },
  })),
}
