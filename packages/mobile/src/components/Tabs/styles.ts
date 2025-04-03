type TabStates = 'active' | 'disabled'

type TabComposition = 'wrapper' | 'icon' | 'text'

export type TabsComposition =
  'wrapper' |
  'panel' |
  'tabList' |
  'tabListContainer' |
  `tab${Capitalize<TabComposition>}` |
  `tab${Capitalize<TabComposition>}:${TabStates}`