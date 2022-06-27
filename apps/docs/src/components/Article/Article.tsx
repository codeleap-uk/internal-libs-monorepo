import { View } from '@/app'

export const Article:React.FC = ({ children }) => {
  return <View variants={['column', 'flex', 'padding:5', 'alignStart', 'gap:2']} responsiveVariants={{
    mid: ['padding:1'],
  }}>
    {children}
  </View>
}
