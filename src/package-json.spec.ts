import { describe, it, expect, beforeAll } from 'vitest'
import { readFile } from 'fs/promises'
import { resolve } from 'path'

interface PackageJson {
  name: string
  version: string
  description: string
  type: string
  scripts: Record<string, string>
  keywords: string[]
  author: string
  license: string
  repository: {
    type: string
    url: string
  }
  homepage: string
  packageManager: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  pnpm?: {
    overrides?: Record<string, string>
  }
}

describe('package.json', () => {
  let pkg: PackageJson

  beforeAll(async () => {
    const pkgPath = resolve(__dirname, '../package.json')
    const pkgContent = await readFile(pkgPath, 'utf-8')
    pkg = JSON.parse(pkgContent)
  })

  it('has correct basic metadata', () => {
    expect(pkg.name).toBe('open-alice')
    expect(pkg.description).toBe('File-based trading agent engine')
    expect(pkg.type).toBe('module')
    expect(pkg.license).toBe('AGPL-3.0-only')
  })

  it('has correct version format', () => {
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+(-[a-z]+\.\d+)?$/)
  })

  it('has required scripts', () => {
    expect(pkg.scripts).toHaveProperty('dev')
    expect(pkg.scripts).toHaveProperty('build')
    expect(pkg.scripts).toHaveProperty('test')
    expect(pkg.scripts.dev).toBe('tsx src/main.ts')
    expect(pkg.scripts.build).toBe('pnpm --filter opentypebb build && pnpm --filter @traderalice/ibkr build && pnpm build:ui && pnpm build:backend')
    expect(pkg.scripts.test).toBe('vitest run')
  })

  it('has correct repository information', () => {
    expect(pkg.repository.type).toBe('git')
    expect(pkg.repository.url).toBe('git+https://github.com/TraderAlice/OpenAlice.git')
    expect(pkg.homepage).toBe('https://traderalice.com')
  })

  it('specifies package manager', () => {
    expect(pkg.packageManager).toMatch(/^pnpm@\d+\.\d+\.\d+$/)
  })

  it('has required dependencies', () => {
    // Core dependencies
    expect(pkg.dependencies).toHaveProperty('@anthropic-ai/claude-agent-sdk')
    expect(pkg.dependencies).toHaveProperty('decimal.js')
    expect(pkg.dependencies).toHaveProperty('zod')
    expect(pkg.dependencies).toHaveProperty('pino')

    // Connector dependencies
    expect(pkg.dependencies).toHaveProperty('grammy')
    expect(pkg.dependencies).toHaveProperty('@hono/node-server')
    expect(pkg.dependencies).toHaveProperty('hono')

    // AI provider dependencies
    expect(pkg.dependencies).toHaveProperty('@ai-sdk/anthropic')
    expect(pkg.dependencies).toHaveProperty('@ai-sdk/openai')
    expect(pkg.dependencies).toHaveProperty('@ai-sdk/google')
    expect(pkg.dependencies).toHaveProperty('ai')
  })

  it('has required devDependencies', () => {
    expect(pkg.devDependencies).toHaveProperty('vitest')
    expect(pkg.devDependencies).toHaveProperty('tsx')
    expect(pkg.devDependencies).toHaveProperty('tsup')
    expect(pkg.devDependencies).toHaveProperty('typescript')
  })

  it('has appropriate keywords', () => {
    expect(pkg.keywords).toContain('trading')
    expect(pkg.keywords).toContain('ai-agent')
    expect(pkg.keywords).toContain('file-driven')
  })

  it('has workspace dependencies', () => {
    expect(pkg.dependencies).toHaveProperty('@traderalice/ibkr')
    expect(pkg.dependencies).toHaveProperty('@traderalice/opentypebb')
    expect(pkg.dependencies['@traderalice/ibkr']).toBe('workspace:*')
    expect(pkg.dependencies['@traderalice/opentypebb']).toBe('workspace:*')
  })

  it('has security-related pnpm overrides', () => {
    expect(pkg.pnpm?.overrides).toBeDefined()
    expect(pkg.pnpm?.overrides).toHaveProperty('@alpacahq/alpaca-trade-api>axios')
  })
})