import * as React from 'react'
import {
  Checkbox,
  // Switch,
  TextInput,
  ContentView,
  // Image,
  RadioInput,
  Theme,
  View,
  // Scroll,
  Text,
  ActivityIndicator,
  Touchable,
  Button,
  FileInput,
  Slider,
  logger,
  Select,
} from '@/app'

import {
  createForm,
  useForm,
} from '@codeleap/common'
import * as yup from 'yup'
import { FileInputRef } from '@codeleap/web'
import img from '@/images/codeleap_logo_white.png'
import { AppStatus, useAppSelector } from '@/redux'

const options = Array(5)
  .fill(0)
  .map((_, idx) => ({ label: `Option ${idx + 1}`, value: idx + 1 }))

const testForm = createForm('Test', {
  text: {
    type: 'text',
    validate: yup
      .string()
      .min(2, 'Must be at least 2 characters long')
      .max(5, 'Must be at most 5 characters long'),
  },
  select: {
    type: 'select',
    options,
    defaultValue: 1,
  },
  radio: {
    type: 'radio',
    options,
    defaultValue: 1,
  },
  switch: {
    type: 'checkbox',
    validate: yup.boolean().isTrue('Turn it on'),
  },
  checkbox: {
    type: 'checkbox',
    validate: yup.boolean().isTrue('You must sell your soul to us'),
  },
  slider: {
    type: 'slider',
    defaultValue: 0,
    labels: ['Small', 'Medium', 'Large'],
  },
  rangeSlider: {
    type: 'range-slider',
    defaultValue: [0, 2],
    labels: ['Small', 'Medium', 'Large'],
  },
  file: {
    type: 'file',
  },
})

export const Home: React.FC = () => {
  const form = useForm(testForm, {
    output: 'multipart',
    validateOn: 'change',
    // log: ['setValue', 'validate'],  log on setValue, aka when the hook sets the form state
  })
  const [texts, setTexts] = React.useState(['It works'])

  function onRefresh() {
    setTexts((prev) => [...prev, 'It works'])
  }

  const fileInputRef = React.useRef<FileInputRef>(null)

  const network = useAppSelector(store => store.AppStatus.network)

  return (
    <>
      {/* <Scroll onRefresh={onRefresh} refreshTimeout={1000} changeData={texts} variants={['padding:2', 'paddingTop:5']}> */}
      <Button text='Modal' onPress={() => AppStatus.setModal('test')} />
      <Button text='Crashlytics' onPress={() => {
        logger.error('Bad things happened', new Error('Whoops'), 'Test')
      }} />
      <TextInput rightIcon={{ name: 'apple' }} {...form.register('text')} />

      <Image
        fast
        source={require('@/images/image.png')}
        variants={['round']}
        style={Theme.sized(20)}
      />
      {
        network && <View>
          <Text text={`Connected ${network.isConnected}`}/>
          <Text text={`Network type ${network.type}`}/>

        </View>
      }
      <Image fast source={img} variants={['round']} style={Theme.sized(20)} />
      <Switch {...form.register('switch')} />
      <Checkbox {...form.register('checkbox')} />

      <RadioInput {...form.register('radio')} />

      <Slider
        {...form.register('slider')}
        valueOverThumb
        formatTooltip={(v) => `${Math.round(v)}%`}
        step={0}
        debounce={100}
      />

      <Slider
        {...form.register('rangeSlider')}
        valueOverThumb
        formatTooltip={(v) => `${Math.round(v)}%`}
        step={0}
        debounce={100}
      />
      <View variants={['justifyCenter']}>
        <Text text='It works' />
        <Touchable
          variants={['center', 'justifyCenter', 'alignCenter']}
          onPress={() => console.log(`touch`)}
        >
          <Text variants={['center']} text='Touchable working'></Text>
          <Text variants={['center']} text='Touchable working'></Text>
        </Touchable>
        <ActivityIndicator />
        {texts.map((t, idx) => (
          <Text text={t} key={idx} />
        ))}
      </View>

      <Button
        text='Button'
        icon={'apple'}
        onPress={() => {
          AppStatus.set('loading')
          setTimeout(() => {
            AppStatus.set('done')
          }, 2000)
        }}
      />

      <ContentView placeholderMsg='Test placeholder...' loading>
        <Text text='Test Children' />
      </ContentView>
      {form.values.file?.length && (
        <>
          {form.values.file.map(({ file, preview }) => (
            <Image source={preview} style={Theme.sized(30)} key={file.name} />
          ))}
        </>
      )}
      <FileInput
        {...form.register('file')}
        mode='button'
        ref={fileInputRef}
        iconName='image'
      />

      <Select
        {...form.register('select')}
        placeholder='Select a value'
        scroll={false}
      />
      <Button
        text={'Pick File'}
        onPress={() => fileInputRef.current.openFilePicker()}
      />

      {/* </Scroll> */}
    </>
  )
}

export default Home
