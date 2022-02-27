import React from 'react'
import { Navigation } from './Navigation'

export function createAppNavigation(Scenes:any) {

  console.log('Creating app navigation', { Scenes }, 'PACKAGES')

  const AllScenes = Object.entries<any>(Scenes).reduce((allScenes, [moduleName, content]) => {

    const subScenes = []

    for (const [name, sceneContent] of Object.entries(content.scenes)) {
      subScenes.push(
        [`${moduleName}.${name}`, sceneContent],
      )
    }

    return [
      ...allScenes,
      ...subScenes,
    ]
  }, [])

  const AppScenes = Object.fromEntries(AllScenes)

  const SCENES_RESULT = Object.fromEntries(
    Object.entries<any>(Scenes)
      .map(([S, { _ig_scenes, exclude, type, navigationProps, ...otherProps }]) => {
        let filterScenes = null

        if (exclude) {
          filterScenes = Object.fromEntries(
            AllScenes.filter(([path]) => !exclude.some(param => path.startsWith(param))),
          )
        }

        const Component = () => <Navigation
          type={type || 'Stack'}
          scenes={filterScenes || AppScenes}
          screenOptions={{
            headerShown: false,
            ...navigationProps?.screenOptions,
          }}
          {...navigationProps}
        />
        // console.log('SCENES_RESULT create', { _ig_scenes, exclude, type, navigationProps, otherProps })

        return [S, {
          ...otherProps,
          component: Component,
        }]
      }),
  )

  // console.log('SCENES_RESULT', SCENES_RESULT)

  return SCENES_RESULT
}

