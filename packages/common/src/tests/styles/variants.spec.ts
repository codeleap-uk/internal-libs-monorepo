import { expect } from 'chai'
import { createTheme, VariantProvider } from '../..'


const theme = createTheme({
  breakpoints: {
    xs: 576,
    xxs: 10,
  },
  colors: {
    primary: 'red',
  },
  spacing: 10,
  baseFontSize: 16,
  borderRadius: 10,
  fontFamily: 'Arial, sans-serif',

}, {
  screenSize: () => screenSize,
})
const variantProvider = new VariantProvider(theme)

const screenSize = [400, 500]

const defaultStyles = variantProvider.getDefaultVariants()

const createButtonVariant = variantProvider.createVariantFactory<'text' | 'wrapper' | 'innerWrapper'>()

const ButtonStyles = {
  ...defaultStyles.Button,
  outline: createButtonVariant({
    ...defaultStyles.Button.centerRow,
    wrapper: {
      ...defaultStyles.Button.whole.inner,
      color: 'green',
    },
  }),
  fill: createButtonVariant({
    text: {},
    innerWrapper: {},
    wrapper: {
      color: 'blue',
      ...theme.spacing.margin(3),
    },
  }),
}


describe('Variants', () => {


  it('should say the color is green', () => {
    const styles = variantProvider.getStyles(ButtonStyles, ['outline'], 'wrapper')
    console.log('outline', styles)
    expect(styles.wrapper.color).to.eq('green')
  })

  it('should use fill variant due to screen size', () => {
    const styles = variantProvider.getStyles(ButtonStyles, ['outline', 'marginBottom:1', 'marginBottom:11'], 'wrapper', {
      xs: ['fill'],
    })
    console.log('fill', styles)
    expect(styles.wrapper.color).to.eq('blue')
  })

  it('should work with string', () => {
    const styles = variantProvider.getStyles(ButtonStyles, 'outline marginBottom:2.5', 'wrapper', {
      xs: 'fill',
    })
    console.log('fill', styles)
    expect(styles.wrapper.color).to.eq('blue')
  })

  it('should accept variant from presets', () => {
    const styles = variantProvider.getStyles(ButtonStyles, ['alignStart'], 'wrapper', {
      xs: 'fill',
    })
    console.log(styles.wrapper)
    expect(styles.wrapper.alignItems).to.eq('flex-start')
  })
})
