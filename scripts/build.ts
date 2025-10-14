import type { InlineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import { build } from 'vite'

// const __dirname = new URL('.', import.meta.url).pathname // 在windows上无法获得正确路径
const __dirname = path.dirname(fileURLToPath(import.meta.url)) // 更强的跨平台兼容性

// 全量打包
const buildAll = async () => {
  await build()
  const srcDir = path.resolve(__dirname, '../src/')
  fs.readdirSync(srcDir)
    .filter((name) => {
      // 只要目录不要文件，且里面包含index.ts
      const componentDir = path.resolve(srcDir, name)
      const isDir = fs.lstatSync(componentDir).isDirectory()
      return isDir && fs.readdirSync(componentDir).includes('index.ts')
    })
    .forEach(async (name) => {
      const outDir = path.resolve('./dist', name)
      const custom = {
        lib: {
          entry: path.resolve(srcDir, name),
          name, // 导出模块名
          fileName: `index`,
          formats: [`es`, `umd`],
        },
        outDir,
      }

      await build({
        build: custom,
      } as InlineConfig)
    })
}

buildAll()
