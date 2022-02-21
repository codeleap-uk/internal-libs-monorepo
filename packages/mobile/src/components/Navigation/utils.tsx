import React  from 'react'
import { Navigation } from './Navigation'

export function createAppNavigation(Scenes:any) {
  const AllScenes = Object.entries<any>(Scenes).reduce((allScenes, [moduleName, content]) =>  {

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
      .map(([S, { _ig_scenes, exclude, type, navigationProps,  ...otherProps }]) => {
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

        return [S, {
          ...otherProps,
          component: Component,
        }]
      }),
  )

  return SCENES_RESULT
}

