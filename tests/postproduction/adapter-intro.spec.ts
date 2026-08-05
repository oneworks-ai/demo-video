import { describe, expect, it } from 'vitest'

import {
  ADAPTER_INTRO_DURATION_MS,
  buildAdapterIntroFilterGraph,
  buildAdapterPromoAssemblyFilter,
  getDefaultAdapterIntroAssets
} from '../../src/postproduction/adapter-intro'

describe('adapter intro postproduction', () => {
  it('uses every adapter without drawing title cards or backgrounds', () => {
    const filter = buildAdapterIntroFilterGraph({
      adapterCount: getDefaultAdapterIntroAssets('light').adapters.length
    })

    expect(filter).toContain('[0:v]format=rgba[stage0]')
    expect(filter.match(/overlay=/gu)).toHaveLength(7)
    expect(filter).not.toContain('drawtext')
    expect(filter).not.toContain('drawbox')
  })

  it('scales and fades the One Works and adapter icons together', () => {
    const filter = buildAdapterIntroFilterGraph({ adapterCount: 6 })

    expect(filter).toContain("scale=w='220+1780*")
    expect(filter).toContain("scale=w='74+270*")
    expect(filter.match(/fade=t=out/gu)).toHaveLength(7)
    expect(ADAPTER_INTRO_DURATION_MS).toBe(3_800)
  })

  it('fails closed when a layout entry is missing', () => {
    expect(() =>
      buildAdapterIntroFilterGraph({
        adapterCount: 7,
        layout: getDefaultAdapterIntroAssets('light').adapters
      })
    ).toThrow(
      'Missing adapter intro layout for input 6.'
    )
  })

  it('slides the real recording upward while the intro finishes', () => {
    const filter = buildAdapterPromoAssemblyFilter()

    expect(filter).toContain('setpts=PTS+3.000/TB')
    expect(filter).toContain("overlay=x=0:y='H*(1-")
    expect(filter).toContain('/0.800')
    expect(filter).not.toContain('concat=')
  })

  it('uses a contrast-safe Codex asset for each theme', () => {
    expect(getDefaultAdapterIntroAssets('light').adapters[1]?.path).toMatch(/codex\.png$/u)
    expect(getDefaultAdapterIntroAssets('dark').adapters[1]?.path).toMatch(/codex-dark\.png$/u)
  })
})
