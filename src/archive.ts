import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const adapterPromoVariants = ['light-en', 'dark-en', 'light-zh', 'dark-zh'] as const
type AdapterPromoVariant = typeof adapterPromoVariants[number]

const rawDirectoryByVariant: Record<AdapterPromoVariant, string> = {
  'dark-en': 'mock-fixture-final-dark-en-retry3/dark-en',
  'dark-zh': 'mock-fixture-final-matrix-raw/dark-zh',
  'light-en': 'mock-fixture-final-matrix-raw/light-en',
  'light-zh': 'mock-fixture-final-matrix-raw/light-zh'
}

const sanitizeArchiveValue = (value: unknown, sourceRoot: string): unknown => {
  if (typeof value === 'string') {
    if (path.isAbsolute(value) && value.startsWith(`${sourceRoot}${path.sep}`)) {
      return `process://${path.relative(sourceRoot, value).split(path.sep).join('/')}`
    }
    return value.replace(/^\/Users\/[^/]+/u, '/Users/<user>')
  }
  if (Array.isArray(value)) return value.map(item => sanitizeArchiveValue(item, sourceRoot))
  if (value != null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, sanitizeArchiveValue(item, sourceRoot)])
    )
  }
  return value
}

export const sanitizeProductionArchiveJson = (value: unknown, sourceRoot: string) => (
  sanitizeArchiveValue(value, path.resolve(sourceRoot))
)

const sha256File = async (filePath: string) => {
  const hash = createHash('sha256')
  await new Promise<void>((resolve, reject) => {
    const stream = createReadStream(filePath)
    stream.on('data', chunk => hash.update(chunk))
    stream.once('error', reject)
    stream.once('end', resolve)
  })
  return hash.digest('hex')
}

const probeVideo = async (filePath: string) => {
  const { stdout } = await execFileAsync('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration,size,bit_rate:stream=index,codec_name,width,height,r_frame_rate,pix_fmt',
    '-of',
    'json',
    filePath
  ])
  return JSON.parse(stdout) as unknown
}

const writeSanitizedJson = async (filePath: string, value: unknown, sourceRoot: string) => {
  const content = `${JSON.stringify(sanitizeProductionArchiveJson(value, sourceRoot), null, 2)}\n`
  if (content.includes(sourceRoot) || /\/Users\/(?!<user>)/u.test(content)) {
    throw new Error(`Archive privacy check failed for ${filePath}.`)
  }
  await writeFile(filePath, content)
}

export const archiveAdapterPromoProduction = async (input: {
  outputDirectory: string
  sourceRoot: string
}) => {
  const sourceRoot = path.resolve(input.sourceRoot)
  const outputDirectory = path.resolve(input.outputDirectory)
  const evidenceDirectory = path.join(outputDirectory, 'evidence')
  const reviewDirectory = path.join(outputDirectory, 'review')
  await mkdir(evidenceDirectory, { recursive: true })
  await mkdir(reviewDirectory, { recursive: true })

  const variants = []
  for (const variant of adapterPromoVariants) {
    const rawDirectory = path.join(sourceRoot, rawDirectoryByVariant[variant])
    const basename = `oneworks-adapter-promo-${variant}`
    const finalPath = path.join(sourceRoot, 'mock-fixture-final-matrix-zoom-v2', `${basename}.mp4`)
    const rawPath = path.join(rawDirectory, `${basename}.mp4`)
    const variantDirectory = path.join(evidenceDirectory, variant)
    await mkdir(variantDirectory, { recursive: true })

    for (const suffix of ['cursor-continuity', 'cursor-timeline', 'stills']) {
      const sourcePath = path.join(rawDirectory, `${basename}-${suffix}.json`)
      const value = JSON.parse(await readFile(sourcePath, 'utf8')) as unknown
      await writeSanitizedJson(path.join(variantDirectory, `${suffix}.json`), value, sourceRoot)
    }

    const rawPosterPath = path.join(rawDirectory, `${basename}-poster.png`)
    await copyFile(rawPosterPath, path.join(reviewDirectory, `${variant}-raw-poster.png`))
    await copyFile(
      path.join(sourceRoot, 'mock-fixture-final-matrix-zoom-v2', `contact-${variant}.png`),
      path.join(reviewDirectory, `${variant}-contact-sheet.png`)
    )

    variants.push({
      final: {
        probe: await probeVideo(finalPath),
        sha256: await sha256File(finalPath)
      },
      raw: {
        probe: await probeVideo(rawPath),
        sha256: await sha256File(rawPath),
        source: `process://${rawDirectoryByVariant[variant]}`
      },
      variant
    })
  }

  await copyFile(
    path.join(sourceRoot, 'mock-fixture-final-matrix-zoom-v2', 'contact-matrix.png'),
    path.join(reviewDirectory, 'matrix-contact-sheet.png')
  )
  await copyFile(
    path.join(sourceRoot, 'mock-fixture-final-matrix-zoom-v2', 'zoom-transition-light-zh.png'),
    path.join(reviewDirectory, 'camera-transition-light-zh.png')
  )

  const manifest = {
    archiveVersion: 1,
    files: {
      evidence: 'evidence/<variant>/{cursor-continuity,cursor-timeline,stills}.json',
      review: 'review/*-{raw-poster,contact-sheet}.png'
    },
    fullHdMastersCommitted: false,
    note: 'Video bytes remain outside Git; hashes and ffprobe metadata bind this archive to the reviewed masters.',
    productionDate: '2026-08-05',
    sourceRoot: 'process://',
    variants
  }
  await writeSanitizedJson(path.join(outputDirectory, 'manifest.json'), manifest, sourceRoot)
  return manifest
}
