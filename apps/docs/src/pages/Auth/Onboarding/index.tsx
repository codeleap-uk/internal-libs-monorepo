import { React, Pager, View, variantProvider, Theme, Scroll } from '@/app'

import { useRef, useState } from 'react'
import pages from './pages'

export const OnboardingWrapper: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0)

  // const pagerRef = useRef<PagerRef>(null)

  // function paginate(n: number) {
  //   if (n !== 0 && !!pagerRef.current) {
  //     pagerRef.current[n > 0 ? 'forward' : 'back'](Math.abs(n))
  //   }
  // }

  // const next = () => paginate(1)
  // const previous = () => paginate(-1)

  // const goto = (n: number) => {
  //   if (pagerRef.current) {
  //     pagerRef.current.to(n)
  //   }
  // }

  return (
    <View>
      <View style={styles.innerWrapper}>
        {/* <Pager
          styles={{ wrapper: styles.pager }}
          onPageChange={setCurrentPage}
          ref={pagerRef}
        >
          {Object.values(pages).map((Component, idx) => (
            <Scroll key={idx} style={styles.page} contentContainerStyle={styles.contentContainer}>
              <Component next={next} previous={previous} goto={goto} />
            </Scroll>
          ))}
        </Pager> */}
      </View>

      {/* <View style={styles.dotsWrapper}>
        {Object.keys(pages).map((_, idx) => (
          <PageDot
            key={idx}
            pose={currentPage === idx ? 'current' : 'default'}
            style={[
              styles.pageDot,
              {
                backgroundColor:
                  Theme.colors[currentPage === idx ? 'primary' : 'gray'],
              },
            ]}
            onPress={() => goto(idx)}
            // disabled={true}
          />
        ))}
      </View> */}
    </View>
  )
}

const styles = variantProvider.createComponentStyle({
  pager: {
  },
  page: {
    height: Theme.values.height,
    maxHeight: Theme.values.height,
  },
  innerWrapper: {
  },
  contentContainer: {
    ...Theme.presets.alignCenter,
    flexGrow: 1,
    ...Theme.presets.center,

  },
  pageDot: {
    height: 14,
    width: 14,
    borderRadius: Theme.borderRadius.large,
    ...Theme.spacing.marginHorizontal(0.5),
  },
  dotsWrapper: {
    backgroundColor: `#ffffffcc`,
    position: 'absolute',

    bottom: 0,
    left: 0,
    right: 0,
    ...Theme.presets.row,
    ...Theme.presets.center,
    ...Theme.spacing.padding(1),
  },
})
export default OnboardingWrapper
