// components/AvatarInitials.tsx
import React from 'react'
import { useAvatarContext } from '../context'
import { Text } from '../../Text'

export const AvatarInitials = () => {
  const { text, name = '', firstNameOnly = true, styles } = useAvatarContext()

  const initials = React.useMemo(() => {
    if (text) return text

    const safeName = Array.isArray(name) ? name : typeof name === 'string' ? name.trim() : ''
    const [first = '', last = ''] = Array.isArray(safeName) ? safeName : safeName.split(/\s+/)

    const chars = [first.charAt(0) || '']
    if (!firstNameOnly) chars.push(last.charAt(0) || '')

    return chars.join(' ').toUpperCase()
  }, [name, firstNameOnly, text])

  return <Text text={initials} style={styles.initials} />
}
