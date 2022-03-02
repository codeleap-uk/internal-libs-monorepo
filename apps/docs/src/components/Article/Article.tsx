import { View } from '@/app'

export const Article:React.FC = ({ children }) => {
  return <View variants={['column', 'flex', 'padding:5', 'alignStart', 'gap:2']}>
    {children}
  </View>
}
