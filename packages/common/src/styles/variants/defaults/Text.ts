import { Fonts, TypographyStyle } from '../..';
import { includePresets } from '../../presets';
import { createDefaultVariantFactory } from '../createDefaults';

export type TextComposition = 'text';
const createTextStyle = createDefaultVariantFactory<TextComposition>();

const presets = includePresets((styles) => createTextStyle(() => ({ text: styles })),
);
function createClampExpression(values: TypographyStyle, baseSize: number) {
  const { max, min, multiplier, viewport } = values.size;
  const add =
    typeof multiplier == 'string' ? multiplier : `${baseSize * multiplier}px`;
  const s = `max(${min}px, min(calc(${add} + ${viewport}vw), ${max}px))`;
  // const s = `clamp(${min}px, calc(${add} + ${viewport}vw), ${max}px)`
  return s;
}
export function assignTextStyle(name: Fonts, add = {}) {
  return createTextStyle((theme) => {
    const style = theme.typography.styles[name];

    if (theme.IsBrowser) {
      return {
        text: {
          fontWeight: style.weigth.toString(),
          fontSize: createClampExpression(style, theme.typography.baseFontSize),
          lineHeigth: style.lineHeight,
          ...add,
        },
      };
    }
    return {
      text: {
        fontWeight: style.weigth.toString(),
        fontSize: style.size.multiplier * theme.typography.baseFontSize,
        // lineHeight: style.lineHeight,
        ...add,
      },
    };
  });
}

export const TextStyles = {
  ...presets,
  default: createTextStyle((theme) => ({
    text: {
      fontFamily: theme.typography.fontFamily,
      ...assignTextStyle('p1')(theme).text,
    },
  })),
  h1: assignTextStyle('h1'),
  h2: assignTextStyle('h2'),
  h3: assignTextStyle('h3'),
  h4: assignTextStyle('h4'),
  h5: assignTextStyle('h5'),
  h6: assignTextStyle('h6'),
  p1: assignTextStyle('p1'),
  p2: assignTextStyle('p2'),
  p3: assignTextStyle('p3'),
  p4: assignTextStyle('p4'),
  link: assignTextStyle('p1'),
};
