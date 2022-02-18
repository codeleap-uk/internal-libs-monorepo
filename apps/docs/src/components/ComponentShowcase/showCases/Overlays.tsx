/** @jsx jsx */
import { jsx } from '@emotion/react'
import { useBooleanToggle } from '@codeleap/common'
import { Drawer, variants, Modal, Text, Button, Overlay } from '@/app'
import React, { Fragment } from 'react'
import { AppStatus } from '@/redux'
import { beautifyName } from '../utils/variant'

const handleAppStatus = () => {
  AppStatus.set('loading')
  setTimeout(() => {
    AppStatus.set('done')
  }, 2000)
}

const DrawerShowcase = {
  render: ({ variants, controlValues }) => {
    const [isDrawerOpen, toggleDrawer] = useBooleanToggle(false)
    const props = { variants, text: 'Open', onPress: () => toggleDrawer() }
    return (
      <Fragment>
        <Button {...props} />
        <Drawer
          open={isDrawerOpen}
          toggle={toggleDrawer}
          title={controlValues.title}
          size={controlValues.size}
          position={controlValues.position}
          showCloseButton={controlValues.showClose}
          footer={
            <Button
              text='something'
              onPress={() => alert('Drawer')}
              variants={['marginLeft:auto']}
            />
          }
        >
          <Text text='Hi' />
        </Drawer>
      </Fragment>
    )
  },
  styleSheet: variants.Drawer,
  controls: {
    title: 'Hi',
    showClose: true,
    size: '30%',
    position: Object.fromEntries(
      ['left', 'right', 'top', 'bottom'].map((v) => [beautifyName(v), v]),
    ),
  },
}
const ModalShowcase = {
  render: ({ variants, controlValues }) => {
    const [isOpen, toggle] = useBooleanToggle(false)
    return (
      <Fragment>
        <Button text='Open modal' onPress={() => toggle()} />
        <Modal
          open={isOpen}
          toggle={toggle}
          variants={[
            ...variants,
            `d:w-${controlValues.width};h-${controlValues.height}`,
          ]}
          showClose={controlValues.showClose}
          title={controlValues.title}
        >
          <Text text='Hi' />
        </Modal>
      </Fragment>
    )
  },
  styleSheet: variants.Modal,
  controls: {
    title: 'Hi',
    showClose: true,
    width: '30%',
    height: '30%',
  },
}

const OverlayShowcase = {
  render: ({ variants }) => {
    const [isVisible, toggle] = useBooleanToggle(false)
    return (
      <Fragment>
        <Button text='Open overlay' onPress={() => toggle()} />
        <Overlay
          visible={isVisible}
          variants={variants}
          onPress={() => toggle()}
        />
      </Fragment>
    )
  },
  styleSheet: variants.Overlay,
}

const AppStatusShowCase = {
  render: () => {
    return <Button text='Show App Status' onPress={handleAppStatus} />
  },
  styleSheet: {},
}
export {
  ModalShowcase as Modal,
  DrawerShowcase as Drawer,
  OverlayShowcase as Overlay,
  AppStatusShowCase as AppStatus,
}
