import { Router } from "express"
import fs from "fs"
import path from "path"

const router = Router()
const routesPath = __dirname
const isProd = process.env.NODE_ENV === "production"

const loadRoutes = (dirPath: string) => {
  const files = fs.readdirSync(dirPath)

  for (const file of files) {
    const fullPath = path.join(dirPath, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      loadRoutes(fullPath)
      continue
    }

    // 🔥 En prod SOLO .js
    if (isProd && !file.endsWith(".js")) continue

    // En dev acepta .ts
    if (!isProd && !file.endsWith(".ts")) continue

    // Evitar index
    if (file.startsWith("index")) continue

    try {
      const routeModule = require(fullPath)
      const route = routeModule.default ?? routeModule
      router.use(route)
    } catch (err) {
      console.error(`❌ Error loading route file: ${fullPath}`)
      throw err
    }
  }
}

loadRoutes(routesPath)

export default router
