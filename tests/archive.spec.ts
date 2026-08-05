import { describe, expect, it } from 'vitest'

import { sanitizeProductionArchiveJson } from '../src/archive'

describe('production archive privacy', () => {
  it('turns source-root paths into portable process URIs', () => {
    expect(
      sanitizeProductionArchiveJson(
        { imagePath: '/private/source/light-en/stills/second_0001.png' },
        '/private/source'
      )
    ).toEqual({ imagePath: 'process://light-en/stills/second_0001.png' })
  })

  it('redacts home directory owners outside the source root', () => {
    expect(
      sanitizeProductionArchiveJson(
        { workspace: '/Users/alice/Projects/example' },
        '/private/source'
      )
    ).toEqual({ workspace: '/Users/<user>/Projects/example' })
  })
})
