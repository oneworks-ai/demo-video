import { spawn } from 'node:child_process'
import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const adapterIds = ['claude-code', 'codex', 'copilot', 'gemini', 'kimi', 'opencode'] as const

interface AdapterIconModule {
  adapterIcon: string
  adapterIconDark?: string
}

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url))

const decodeSvgDataUri = (dataUri: string) => {
  const prefix = 'data:image/svg+xml;utf8,'
  if (!dataUri.startsWith(prefix)) throw new Error('Adapter icon is not an SVG data URI.')
  return decodeURIComponent(dataUri.slice(prefix.length))
    .replace(/width="1em"/gu, 'width="512"')
    .replace(/height="1em"/gu, 'height="512"')
}

const runSips = async (sourcePath: string, outputPath: string) => {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(
      'sips',
      ['-s', 'format', 'png', '-z', '512', '512', sourcePath, '--out', outputPath],
      { stdio: 'ignore' }
    )
    child.once('error', reject)
    child.once('exit', code => {
      if (code === 0) resolve()
      else reject(new Error(`sips failed for ${sourcePath} (code=${code ?? 'null'}).`))
    })
  })
}

export const syncAdapterPromoIconAssets = async (appRoot: string) => {
  const sourceDirectory = path.join(repositoryRoot, 'assets/adapter-promo/sources')
  const outputDirectory = path.join(repositoryRoot, 'assets/adapter-promo/icons')
  await mkdir(sourceDirectory, { recursive: true })
  await mkdir(outputDirectory, { recursive: true })

  for (const adapterId of adapterIds) {
    const modulePath = path.join(appRoot, 'packages/adapters', adapterId, 'src/icon.ts')
    const iconModule = await import(pathToFileURL(modulePath).href) as AdapterIconModule
    const variants = [
      { name: adapterId, value: iconModule.adapterIcon },
      ...(iconModule.adapterIconDark == null
        ? []
        : [{ name: `${adapterId}-dark`, value: iconModule.adapterIconDark }])
    ]
    for (const variant of variants) {
      const sourcePath = path.join(sourceDirectory, `${variant.name}.svg`)
      const outputPath = path.join(outputDirectory, `${variant.name}.png`)
      await writeFile(sourcePath, `${decodeSvgDataUri(variant.value)}\n`)
      await runSips(sourcePath, outputPath)
    }
  }

  const oneworksSource = path.join(appRoot, 'apps/desktop/build/icon.svg')
  const oneworksSvg = path.join(sourceDirectory, 'oneworks.svg')
  await copyFile(oneworksSource, oneworksSvg)
  await runSips(oneworksSvg, path.join(outputDirectory, 'oneworks.png'))
}
