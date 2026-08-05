import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export type AdapterPromoTheme = 'dark' | 'light'

export interface AdapterIntroAsset {
  id: string
  path: string
  x: number
  y: number
}

export interface AdapterPromoRenderOptions {
  ffmpegPath?: string
  outputPath: string
  recordingPath: string
  theme: AdapterPromoTheme
}

export interface AdapterPromoRenderResult {
  introDurationMs: number
  outputPath: string
  sourceRecordingPath: string
  theme: AdapterPromoTheme
}

export const ADAPTER_INTRO_DURATION_MS = 3_800
export const ADAPTER_INTRO_FPS = 30
export const ADAPTER_INTRO_SIZE = { height: 1080, width: 1920 } as const

const assetPath = (name: string) =>
  fileURLToPath(
    new URL(`../../assets/adapter-promo/icons/${name}`, import.meta.url)
  )

export const getDefaultAdapterIntroAssets = (theme: AdapterPromoTheme) => ({
  adapters: [
    { id: 'claude-code', path: assetPath('claude-code.png'), x: -460, y: -170 },
    { id: 'codex', path: assetPath(theme === 'dark' ? 'codex-dark.png' : 'codex.png'), x: -170, y: 250 },
    { id: 'copilot', path: assetPath('copilot.png'), x: 180, y: -270 },
    { id: 'gemini', path: assetPath('gemini.png'), x: 460, y: -80 },
    { id: 'kimi', path: assetPath('kimi.png'), x: 390, y: 250 },
    { id: 'opencode', path: assetPath('opencode.png'), x: -430, y: 240 }
  ] satisfies AdapterIntroAsset[],
  oneworks: assetPath('oneworks.png')
})

const progressExpression = (durationSeconds: number) => (
  `pow(min(max(t/${durationSeconds.toFixed(3)},0),1),2)`
)

export const buildAdapterIntroFilterGraph = (input: {
  adapterCount: number
  durationMs?: number
  layout?: AdapterIntroAsset[]
}) => {
  const durationSeconds = (input.durationMs ?? ADAPTER_INTRO_DURATION_MS) / 1_000
  const progress = progressExpression(durationSeconds - 0.35)
  const fadeStart = durationSeconds - 1.15
  const fadeDuration = 1.05
  const filters = [
    '[0:v]format=rgba[stage0]',
    `[1:v]format=rgba,scale=w='220+1780*(${progress})':h=-1:eval=frame,fade=t=in:st=0:d=0.25:alpha=1,fade=t=out:st=${
      fadeStart.toFixed(3)
    }:d=${fadeDuration.toFixed(3)}:alpha=1[oneworks]`
  ]

  for (let index = 0; index < input.adapterCount; index += 1) {
    const inputIndex = index + 2
    const stage = `stage${index}`
    const nextStage = `stage${index + 1}`
    const asset = (input.layout ?? getDefaultAdapterIntroAssets('light').adapters)[index]
    if (asset == null) throw new Error(`Missing adapter intro layout for input ${index}.`)
    const x = asset.x
    const y = asset.y
    filters.push(
      `[${inputIndex}:v]format=rgba,scale=w='74+270*(${progress})':h=-1:eval=frame,fade=t=in:st=${
        (0.28 + index * 0.07).toFixed(3)
      }:d=0.32:alpha=1,fade=t=out:st=${fadeStart.toFixed(3)}:d=${fadeDuration.toFixed(3)}:alpha=1[adapter${index}]`,
      `[${stage}][adapter${index}]overlay=x='W/2+(${x})*(0.52+0.70*(${progress}))-w/2':y='H/2+(${y})*(0.52+0.70*(${progress}))-h/2':shortest=1[${nextStage}]`
    )
  }

  const adapterStage = `stage${input.adapterCount}`
  filters.push(
    `[${adapterStage}][oneworks]overlay=x='(W-w)/2':y='(H-h)/2':shortest=1[final]`,
    '[final]format=yuv420p[out]'
  )
  return filters.join(';')
}

export const buildAdapterPromoAssemblyFilter = (input: {
  fps?: number
  height?: number
  slideDurationMs?: number
  slideStartMs?: number
  width?: number
} = {}) => {
  const fps = input.fps ?? ADAPTER_INTRO_FPS
  const height = input.height ?? ADAPTER_INTRO_SIZE.height
  const width = input.width ?? ADAPTER_INTRO_SIZE.width
  const slideStartSeconds = (input.slideStartMs ?? 3_000) / 1_000
  const slideDurationSeconds = (input.slideDurationMs ?? 800) / 1_000
  const progress = `min(max((t-${slideStartSeconds.toFixed(3)})/${slideDurationSeconds.toFixed(3)},0),1)`
  return `[0:v]fps=${fps},scale=${width}:${height},setsar=1,tpad=stop_mode=clone:stop_duration=3600[intro];[1:v]fps=${fps},scale=w=${width}:h=${height}:force_original_aspect_ratio=increase,crop=${width}:${height},setsar=1,setpts=PTS+${
    slideStartSeconds.toFixed(3)
  }/TB[recording];[intro][recording]overlay=x=0:y='H*(1-(${progress})*(${progress})*(3-2*(${progress})))':eof_action=endall:shortest=0[out]`
}

const runFfmpeg = async (ffmpegPath: string, args: string[]) => {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: 'inherit' })
    child.once('error', reject)
    child.once('exit', (code, signal) => {
      if (code === 0) resolve()
      else reject(new Error(`ffmpeg failed (code=${code ?? 'null'}, signal=${signal ?? 'null'}).`))
    })
  })
}

const renderAdapterIntro = async (input: {
  ffmpegPath: string
  outputPath: string
  theme: AdapterPromoTheme
}) => {
  const durationSeconds = ADAPTER_INTRO_DURATION_MS / 1_000
  const background = input.theme === 'dark' ? '0x111315' : '0xF4F2EE'
  const assets = getDefaultAdapterIntroAssets(input.theme)
  const args = [
    '-hide_banner',
    '-loglevel',
    'warning',
    '-y',
    '-f',
    'lavfi',
    '-i',
    `color=c=${background}:s=${ADAPTER_INTRO_SIZE.width}x${ADAPTER_INTRO_SIZE.height}:r=${ADAPTER_INTRO_FPS}:d=${durationSeconds}`
  ]
  for (const asset of [assets.oneworks, ...assets.adapters.map(item => item.path)]) {
    args.push('-loop', '1', '-framerate', String(ADAPTER_INTRO_FPS), '-i', asset)
  }
  args.push(
    '-filter_complex',
    buildAdapterIntroFilterGraph({ adapterCount: assets.adapters.length }),
    '-map',
    '[out]',
    '-t',
    String(durationSeconds),
    '-an',
    '-c:v',
    'libx264',
    '-crf',
    '16',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    input.outputPath
  )
  await runFfmpeg(input.ffmpegPath, args)
}

export const renderAdapterPromo = async (
  options: AdapterPromoRenderOptions
): Promise<AdapterPromoRenderResult> => {
  const ffmpegPath = options.ffmpegPath ?? 'ffmpeg'
  const outputPath = path.resolve(options.outputPath)
  const recordingPath = path.resolve(options.recordingPath)
  await mkdir(path.dirname(outputPath), { recursive: true })
  const temporaryDirectory = await mkdtemp(path.join(tmpdir(), 'oneworks-adapter-promo-'))
  const introPath = path.join(temporaryDirectory, 'intro.mp4')

  try {
    await renderAdapterIntro({ ffmpegPath, outputPath: introPath, theme: options.theme })
    await runFfmpeg(ffmpegPath, [
      '-hide_banner',
      '-loglevel',
      'warning',
      '-y',
      '-i',
      introPath,
      '-i',
      recordingPath,
      '-filter_complex',
      buildAdapterPromoAssemblyFilter(),
      '-map',
      '[out]',
      '-an',
      '-c:v',
      'libx264',
      '-crf',
      '17',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      outputPath
    ])
  } finally {
    await rm(temporaryDirectory, { force: true, recursive: true })
  }

  return {
    introDurationMs: ADAPTER_INTRO_DURATION_MS,
    outputPath,
    sourceRecordingPath: recordingPath,
    theme: options.theme
  }
}
