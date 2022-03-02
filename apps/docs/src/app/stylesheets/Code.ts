const light = {
  plain: {
    color: '#000000',
    backgroundColor: '#f9f9f9',
  },
  styles: [{
    types: ['comment'],
    style: {
      color: 'rgb(0, 128, 0)',
    },
  }, {
    types: ['builtin'],
    style: {
      color: 'rgb(0, 112, 193)',
    },
  }, {
    types: ['number', 'variable', 'inserted'],
    style: {
      color: 'rgb(9, 134, 88)',
    },
  }, {
    types: ['operator'],
    style: {
      color: 'rgb(0, 0, 0)',
    },
  }, {
    types: ['constant', 'char'],
    style: {
      color: 'rgb(129, 31, 63)',
    },
  }, {
    types: ['tag'],
    style: {
      color: 'rgb(128, 0, 0)',
    },
  }, {
    types: ['attr-name'],
    style: {
      color: 'rgb(255, 0, 0)',
    },
  }, {
    types: ['deleted', 'string'],
    style: {
      color: 'rgb(163, 21, 21)',
    },
  }, {
    types: ['changed', 'punctuation'],
    style: {
      color: 'rgb(4, 81, 165)',
    },
  }, {
    types: ['function', 'keyword'],
    style: {
      color: 'rgb(0, 0, 255)',
    },
  }, {
    types: ['class-name'],
    style: {
      color: 'rgb(38, 127, 153)',
    },
  }],
}
const dark = {
  plain: {
    color: '#F8F8F2',
    backgroundColor: '#282A36',
  },
  styles: [{
    types: ['prolog', 'constant', 'builtin'],
    style: {
      color: 'rgb(189, 147, 249)',
    },
  }, {
    types: ['inserted', 'function'],
    style: {
      color: 'rgb(80, 250, 123)',
    },
  }, {
    types: ['deleted'],
    style: {
      color: 'rgb(255, 85, 85)',
    },
  }, {
    types: ['changed'],
    style: {
      color: 'rgb(255, 184, 108)',
    },
  }, {
    types: ['punctuation', 'symbol'],
    style: {
      color: 'rgb(248, 248, 242)',
    },
  }, {
    types: ['string', 'char', 'tag', 'selector'],
    style: {
      color: 'rgb(255, 121, 198)',
    },
  }, {
    types: ['keyword', 'variable'],
    style: {
      color: 'rgb(189, 147, 249)',
      fontStyle: 'italic',
    },
  }, {
    types: ['comment'],
    style: {
      color: 'rgb(98, 114, 164)',
    },
  }, {
    types: ['attr-name'],
    style: {
      color: 'rgb(241, 250, 140)',
    },
  }],
}

const CodeThemes = {
  dark,
  light,
}

export default CodeThemes
