import health from '../routes/health.js'
import objects from '../routes/objects.js'

const router = {
  plugin: {
    name: 'router',
    register: (server, _options) => {
      server.route([].concat(
        health,
        objects
      ))
    }
  }
}

export default router
