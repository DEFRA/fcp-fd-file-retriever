import health from '../routes/health.js'
import objects from '../routes/objects.js'
import internalObjectsLink from '../routes/internal/internal-objects-link.js'
import internalObjectsBuffer from '../routes/internal/internal-objects-buffer.js'

const router = {
  plugin: {
    name: 'router',
    register: (server, _options) => {
      server.route([].concat(
        health,
        objects,
        internalObjectsLink,
        internalObjectsBuffer
      ))
    }
  }
}

export default router
