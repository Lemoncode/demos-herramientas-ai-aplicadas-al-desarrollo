import { createServer } from 'node:http'

// Legacy Users API — the service we are migrating AWAY from.
// Zero dependencies: this runs on Node's built-in http module.

const PORT = 4001

const USERS = [
  { id: 'u_1', name: 'Ada Lovelace', email: 'ada@acme.test' },
  { id: 'u_2', name: 'Alan Turing', email: 'alan@acme.test' },
]

function sendJson(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body))
}

const server = createServer((req, res) => {
  const pathname = new URL(req.url ?? '/', `http://localhost:${PORT}`).pathname

  if (req.method === 'GET' && pathname === '/api/v1/users') {
    return sendJson(res, 200, USERS)
  }

  const match = pathname.match(/^\/api\/v1\/users\/([^/]+)$/)
  if (req.method === 'GET' && match) {
    const user = USERS.find((candidate) => candidate.id === match[1])
    return user ? sendJson(res, 200, user) : sendJson(res, 404, { error: 'Not found' })
  }

  return sendJson(res, 404, { error: 'Not found' })
})

server.listen(PORT, () => {
  console.log(`Legacy users API listening on http://localhost:${PORT}`)
})
