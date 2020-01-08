import vcBadge from './badge'
import { App } from 'vue'

const Badge = vcBadge
;(Badge as any).install = (app: App) => {
  app.component(Badge.name, Badge as any)
}

export default Badge