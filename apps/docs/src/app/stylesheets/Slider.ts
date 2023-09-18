import { assignTextStyle } from './Text'
import { SliderComposition, SliderPresets  } from '@codeleap/web'
import { variantProvider } from '../theme'

const createSliderStyle = variantProvider.createVariantFactory<SliderComposition>()

const defaultStyles = SliderPresets

export const AppSliderStyles = {
  ...defaultStyles,
  default: createSliderStyle((theme) => {
    const thumbSize = theme.values.itemHeight.tiny
    const trackHeight = 4
    return {
      wrapper: {
        ...theme.presets.column,
      },
      innerWrapper: {
        ...theme.presets.column,
      },
      thumb: {
        height: thumbSize,
        width: thumbSize,
        backgroundColor: theme.colors['neutral1'],
        display: 'block',
        boxShadow: `0 1px 3px ${theme.colors['neutral5']}`,
        borderRadius: theme.borderRadius.rounded,
        cursor: 'pointer',
      },
      "thumb:disabled": {
        cursor: 'not-allowed',
      },
      selectedTrack: {
        backgroundColor: theme.colors['primary3'],
        position: 'absolute',
        borderRadius: theme.borderRadius.rounded,
        height: '100%',
      },
      track: {
        position: 'relative',
        flexGrow: 1,
        borderRadius: theme.borderRadius.rounded,
        backgroundColor: theme.colors['neutral2'],
        height: trackHeight,
      },
      label: {
        ...assignTextStyle('h5')(theme).text,
        color: theme.colors['neutral8'],
        marginBottom: theme.spacing.value(0),
      },
      description: {
        ...assignTextStyle('p3')(theme).text,
        color: theme.colors['neutral8'],
        marginBottom: theme.spacing.value(0),
      },
      labelRow: {
        ...theme.presets.row,
        ...theme.presets.alignCenter,
        ...theme.presets.justifySpaceBetween,
        ...theme.spacing.marginBottom(2),
      },
      sliderContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      },
      trackMark: {
        ...assignTextStyle('p5')(theme).text,
        color: theme.colors['neutral5'],
        textAlign: 'center',
      },
      firstTrackMark: {
        textAlign: 'left',
      },
      lastTrackMark: {
        textAlign: 'right',
      },
      trackMarkWrapper: {
        width: '100%',
        height: 'auto',
        ...theme.presets.row,
        ...theme.presets.justifySpaceBetween,
        marginTop: theme.spacing.value(2.5),
        position: 'relative',
      },
      "trackMark:disabled": {
        color: theme.colors['neutral5'],
      },
      "label:disabled": {
        color: theme.colors['neutral5'],
      },
      "description:disabled": {
        color: theme.colors['neutral5'],
      },
      "selectedTrack:disabled": {
        backgroundColor: theme.colors['neutral5'],
      },
    }
  }),
}
