import health from '../routes/health.js'
import objects from '../routes/objects.js'
import internalObjects from '../routes/internal/internal-objects.js'

const router = {
  plugin: {
    name: 'router',
    register: (server, _options) => {
      server.route([].concat(
        health,
        objects,
        internalObjects
      ))
    }
  }
}

export default router
