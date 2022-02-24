import { Button, React, View } from '@/app'
import { SceneNavigationProps } from '../Scenes'
import { FSBackground, Logo } from '@/components'
import rocketImage from '@/images/rocket.jpeg'

export const Auth: React.FC<SceneNavigationProps> = ({ navigation }) => {

  return (
    <>
      <FSBackground source={rocketImage}/>
      <View variants={['justifySpaceAround', 'padding:2', 'fullHeight']}>
        <Logo switchServerOnPress/>
        <View>
          <Button
            variants={['marginTop:2']}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
            text='Log in'
            debugName={'Go to Login page'}
          />
          <Button
            variants={['marginTop:2']}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Signup' }] })}
            text='Sign up'
            debugName={'Go to Sign up page'}
          />
        </View>
      </View>
    </>
  )
}

export default Auth
