import RCSlider, { SliderProps as RCSliderProps } from 'rc-slider'

type SliderProps = RCSliderProps & {}

export const Slider: React.FC<SliderProps> = (sliderProps) => {
  const { ...props } = sliderProps

  return <RCSlider {...props} />
}
