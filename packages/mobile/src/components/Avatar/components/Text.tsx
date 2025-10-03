import { useAvatarContext } from '../context'
import { AvatarTextProps } from '../types'
import { Text } from '../../Text'
import { useMemo } from 'react'
import { TypeGuards } from '@codeleap/types'

export const AvatarText = (props: AvatarTextProps) => {
  const { text, name, firstNameOnly, styles } = useAvatarContext(props)

  const initials = useMemo(() => {
    const [first = '', last = ''] = TypeGuards.isString(name) ? name.split(' ') : name ?? []
    const initials = [first[0]]

    if (!firstNameOnly) initials.push(last[0])

    return initials?.join('')
  }, [name, firstNameOnly])

  if (!text && !initials) return null

  return (
    <Text text={text || initials} style={styles.text} />
  )
}
