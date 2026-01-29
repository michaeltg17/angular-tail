import { bootstrapApplication } from '@angular/platform-browser'
import { isDevMode } from '@angular/core'
import { appConfig } from './app/app.config'
import { App } from './app/app'
import { worker } from './testing/msw/browser'

async function bootstrap() {
  if (isDevMode()) {
    await worker.start({
      serviceWorker: { url: 'mockServiceWorker.js' }
    })
  }

  await bootstrapApplication(App, appConfig)
}

bootstrap().catch(err => console.error(err))
