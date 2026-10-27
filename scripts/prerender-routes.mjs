#!/usr/bin/env node
/**
 * prerender-routes.mjs
 *
 * Post-build script that injects per-route SEO meta tags into the
 * built index.html for each route defined in src/routeMeta.js.
 *
 * For a single-page app served by a static file server or CDN this
 * ensures that crawlers (Googlebot, social-media scrapers) see the
 * correct <title>, <meta description>, OG tags, canonical, and an
 * <h1> — even without JavaScript execution.
 *
 * Usage:
 *   node scripts/prerender-routes.mjs          # uses dist/ by default
 *   node scripts/prerender-routes.mjs build/   # custom output dir
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')

// Dynamic import of routeMeta (ESM)
const { default: routeMeta } = await import(
  join(projectRoot, 'src', 'routeMeta.js')
)

const distDir = resolve(projectRoot, process.argv[2] || 'dist')
const templatePath = join(distDir, 'index.html')

if (!existsSync(templatePath)) {
  console.error(`ERROR: ${templatePath} not found. Run "npm run build" first.`)
  process.exit(1)
}

const template = readFileSync(templatePath, 'utf-8')

let pagesWritten = 0

for (const [route, meta] of Object.entries(routeMeta)) {
  let html = template

  // Replace <title>
  if (meta.title) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
  }

  // Replace meta description
  if (meta.description) {
    html = html.replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${meta.description}"`
    )
  }

  // Replace canonical
  if (meta.canonical) {
    html = html.replace(
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="${meta.canonical}"`
    )
  }

  // Replace OG tags
  if (meta.og) {
    if (meta.og.title) {
      html = html.replace(
        /<meta property="og:title" content="[^"]*"/,
        `<meta property="og:title" content="${meta.og.title}"`
      )
    }
    if (meta.og.description) {
      html = html.replace(
        /<meta property="og:description" content="[^"]*"/,
        `<meta property="og:description" content="${meta.og.description}"`
      )
    }
    if (meta.og.image) {
      html = html.replace(
        /<meta property="og:image" content="[^"]*"/,
        `<meta property="og:image" content="${meta.og.image}"`
      )
    }
  }

  // Determine output path
  const outDir =
    route === '/' ? distDir : join(distDir, route.replace(/^\//, ''))

  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true })
  }

  const outFile = join(outDir, 'index.html')
  writeFileSync(outFile, html, 'utf-8')
  pagesWritten++
  console.log(`  prerendered: ${route} -> ${outFile}`)
}

console.log(`\n  Done — ${pagesWritten} page(s) prerendered.`)
