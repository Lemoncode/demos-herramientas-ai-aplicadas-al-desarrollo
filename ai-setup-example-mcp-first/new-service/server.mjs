import { createServer } from 'node:http'

// New Customers API v2 — the service we are migrating TO.
// Same data, different contract: renamed paths, renamed fields, and responses wrapped
// in a `data` envelope. Zero dependencies.

const PORT = 4002

const CUSTOMERS = [
  { id: 'u_1', fullName: 'Ada Lovelace', emailAddress: 'ada@acme.test' },
  { id: 'u_2', fullName: 'Alan Turing', emailAddress: 'alan@acme.test' },
]

function sendJson(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body))
}

const server = createServer((req, res) => {
  const pathname = new URL(req.url ?? '/', `http://localhost:${PORT}`).pathname

  if (req.method === 'GET' && pathname === '/v2/customers') {
    return sendJson(res, 200, { data: CUSTOMERS, total: CUSTOMERS.length })
  }

  const match = pathname.match(/^\/v2\/customers\/([^/]+)$/)
  if (req.method === 'GET' && match) {
    const customer = CUSTOMERS.find((candidate) => candidate.id === match[1])
    return customer
      ? sendJson(res, 200, { data: customer })
      : sendJson(res, 404, { error: { code: 'not_found', message: 'No such customer' } })
  }

  return sendJson(res, 404, { error: { code: 'not_found', message: 'No such route' } })
})

server.listen(PORT, () => {
  console.log(`Customers API v2 listening on http://localhost:${PORT}`)
})
