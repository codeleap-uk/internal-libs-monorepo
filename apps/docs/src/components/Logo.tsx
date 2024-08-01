import { Settings } from '@/app'
import { PropsOf } from '@codeleap/common'
import { Text, Touchable } from '@/components'
import { concatStyles } from '@codeleap/styles'

type LogoProps = PropsOf<typeof Touchable>

export function Logo(props: LogoProps) {
  const { style } = props

  const styles = concatStyles([style, ['h4', 'extraBold', 'color:neutral10']])

  return (
    <Text style={styles} text={Settings.AppName} />
  )
}
