import health from '../routes/health.js'
import objects from '../routes/objects.js'
import internalObjectsBuffer from '../routes/internal-objects-buffer.js'
// import internalObjectsLink from '../routes/internal-objects-link.js'

const router = {
  plugin: {
    name: 'router',
    register: (server, _options) => {
      server.route([].concat(
        health,
        objects,
        internalObjectsBuffer
        // internalObjectsLink
      ))
    }
  }
}

export default router
