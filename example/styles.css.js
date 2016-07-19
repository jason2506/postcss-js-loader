import { sm, md, lg } from './breakpoints.js'

const minWidth = width => `@media screen and (min-width: ${width})`

export default {
  '.example': {
    fontSize: 12,
    userSelect: 'none',
  },

  [minWidth(sm)]: {
    '.example': {
      fontSize: 16,
    },
  },

  [minWidth(md)]: {
    '.example': {
      fontSize: 24,
    },
  },

  [minWidth(lg)]: {
    '.example': {
      fontSize: 32,
    },
  },
}
