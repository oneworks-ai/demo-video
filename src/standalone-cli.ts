import process from 'node:process'

import { archiveAdapterPromoProduction } from './archive'
import { renderAdapterPromo } from './postproduction/adapter-intro'
import type { AdapterPromoTheme } from './postproduction/adapter-intro'
import { syncAdapterPromoIconAssets } from './sync-app-icon-assets'

const readOption = (args: string[], name: string) => {
  const index = args.indexOf(name)
  const value = index >= 0 ? args[index + 1] : undefined
  if (value == null || value.startsWith('--')) throw new Error(`Missing ${name}.`)
  return value
}

const main = async () => {
  const [, , command, ...args] = process.argv
  if (command === 'sync-adapter-icons') {
    await syncAdapterPromoIconAssets(readOption(args, '--app-root'))
    process.stdout.write('Adapter promo icon inputs synchronized.\n')
    return
  }
  if (command === 'archive-adapter-promo') {
    const result = await archiveAdapterPromoProduction({
      outputDirectory: readOption(args, '--output'),
      sourceRoot: readOption(args, '--source-root')
    })
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
    return
  }
  if (command !== 'render-adapter-promo') {
    process.stdout.write(
      'Usage:\n  pnpm demo-video render-adapter-promo --recording <mp4> --output <mp4> --theme <light|dark>\n  pnpm demo-video archive-adapter-promo --source-root <dir> --output <dir>\n  pnpm demo-video sync-adapter-icons --app-root <dir>\n'
    )
    process.exitCode = command == null ? 0 : 1
    return
  }

  const theme = readOption(args, '--theme')
  if (theme !== 'dark' && theme !== 'light') throw new Error('--theme must be light or dark.')
  const result = await renderAdapterPromo({
    outputPath: readOption(args, '--output'),
    recordingPath: readOption(args, '--recording'),
    theme: theme satisfies AdapterPromoTheme
  })
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`)
  process.exitCode = 1
})
