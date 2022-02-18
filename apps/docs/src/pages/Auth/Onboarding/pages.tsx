import { Text, View, React, Button, Image, Icon, AppIcon, variantProvider } from '@/app'
import { Session } from '@/redux'


type PageProps = {
  next(): void;
  previous(): void;
  goto(page: number): void;
};

const TextList = ({ texts }) => (
  <View variants={['marginVertical:1']}>
    {texts.map((text, idx) => (
      <Text
        variants={['textLeft', 'marginBottom:1']}
        text={`👉 ${text}`}
        key={idx}
      />
    ))}
  </View>
)

const OnboardingPage = (onboardingPageProps) => {
  const { variants = [], next = null, children, ...props } = onboardingPageProps
  const pageVariants = ['center', 'margin:2']
  return (
    <View {...props} variants={[...pageVariants, ...variants]}>
      {children}
      {next && <Button variants={'marginTop:2'} text={'Next'} onPress={next} />}
    </View>
  )
}

const PText = ({ variants = [], ...props }) => {
  const pVariants = ['textCenter', 'marginBottom:1']
  return <Text {...props} variants={[...pVariants, ...variants]}/>
}

const HText = ({ variants = [], ...props }) => {
  const hVariants = ['h3', 'textCenter', 'marginBottom:2']
  return <Text {...props} variants={[...hVariants, ...variants]}/>
}

const EmojiText = ({ variants = [], ...props }) => {
  const hVariants = ['h1', 'textCenter', 'marginVertical:1']
  return <Text {...props} variants={[...hVariants, ...variants]} style={styles.emoji}/>
}

const Welcome: React.FC<PageProps> = ({ next }) => {
  return (
    <OnboardingPage next={next}>
      <EmojiText text={'👋'}/>
      <HText text={`Welcome to CodeLeap's mobile template!`}/>
      <PText variants={['marginVertical:2']} text={'Are you ready to start your new app?'}/>
    </OnboardingPage>
  )
}

const Description: React.FC<PageProps> = ({ next }) => {
  return (
    <OnboardingPage next={next}>
      <EmojiText text={'🎯'}/>
      <HText text={'Purpose'}/>
      <PText text={'This was created to speed up app development and house example code for our libraries by containing a full application'}/>
      <View variants={['row']}>
        <PText variants={['bold', 'marginTop:2', 'flex', 'textLeft']} text={'The app includes:'}/>
      </View>
      <TextList
        texts={[
          'A Component playground',
          'Authentication',
          'A CRUD with the API we use on code tests',
        ]}
      />
      <TextList
        texts={[
          'A Component playground',
          'Authentication',
          'A CRUD with the API we use on code tests',
        ]}
      />
      <PText text={"You'll learn more about each in the next steps"}/>
    </OnboardingPage>
  )
}

const Components: React.FC<PageProps> = ({ next }) => {
  return (
    <OnboardingPage next={next}>
      <EmojiText text={'📦'}/>
      <HText text={'Components'}/>
      <PText text={'In the component playground you can: '}/>
      <TextList
        texts={[
          'Test new styles',
          'Test functionality',
          'Document custom components',
        ]}
      />
      <PText text={'This speeds up development for you, and those who use your code in the future'}/>
    </OnboardingPage>
  )
}

const Authentication: React.FC<PageProps> = ({ next }) => {
  return (
    <OnboardingPage next={next}>
      <EmojiText text={'🔒'}/>
      <HText text={'Authentication'}/>
      <PText text={'Authentication is included here by default, since it can be very time consuming to do it from scratch'}/>
      <PText text={'Features included here are'}/>
      <TextList
        texts={[
          'Email+password Login/Signup',
          'Social Login (Google, Apple, Facebook, Twitter)',
          'Redux Integration',
          'Backend Server Integration',
        ]}
      />
    </OnboardingPage>
  )
}

const CRUD: React.FC<PageProps> = ({ next }) => {
  return (
    <OnboardingPage next={next}>
      <EmojiText text={'🌐'}/>
      <HText text={'CRUD'}/>
      <PText text={'Crud is included here in two ways'}/>
      <TextList
        texts={[
          `Redux  
      An API client defined inside a slice (Reducer + Actions) of the redux store. 
      We can use async functions and call other actions from our slice, all while grouping state and execution.
      `,

          `useQuery  
      This hook allows you to create or use "mini slices" inside your components, while giving you error, loading and success states for each of the actions within it.`,
        ]}
      />
    </OnboardingPage>
  )
}

const Finish: React.FC<PageProps> = () => {
  return (
    <OnboardingPage>
      <EmojiText text={'🥳'}/>
      <HText text={'Done!'}/>
      <PText text={'This is all for now, go and use this stuff to make something.'} />
      <PText text={'The template is always subject to improvement, so be sure to reach out with any ideas.'}/>
      <Button
        text={'Go to app'}
        variants={['margin:1']}
        onPress={() => {
          Session.loginSuccess()
        }}
      />
    </OnboardingPage>
  )
}


const styles = variantProvider.createComponentStyle({
  emoji: {
    fontSize: 60,
  },
})


export default {
  Welcome,
  Description,
  Components,
  Authentication,
  CRUD,
  Finish,
}
