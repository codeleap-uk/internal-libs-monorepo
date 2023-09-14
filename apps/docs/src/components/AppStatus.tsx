import { React, Theme, variantProvider } from '@/app'
import { AppStatus, useAppSelector } from '@/redux'
import { onUpdate } from '@codeleap/common'

export const AppStatusOverlay: React.FC = () => {
  const { status } = useAppSelector((store) => store.AppStatus)

  return null
}

const styles = variantProvider.createComponentStyle((theme) => ({
  wrapper: {
    ...Theme.presets.absolute,
    ...Theme.presets.whole,
    ...Theme.presets.justifyCenter,
    ...Theme.presets.alignCenter,
    zIndex: 9999,
    pointerEvents: 'none',
    transition: 'transform 0.3s ease',
  },
  icon: {

  },
}), true)
