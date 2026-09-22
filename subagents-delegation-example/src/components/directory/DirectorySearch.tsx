// ===========================================================================
// EDUCATIONAL SAMPLE APP - THIS FOLDER HAS DELIBERATE, PLANTED GAPS.
//
// src/components/directory/ ships four real, independent issues — one per
// file — used as the backlog for the fix-backlog demo. See docs/backlog.md
// for the ticket describing each one. Do not fix them by hand: they exist so
// a Fix Subagent can pick them up.
// ===========================================================================
//
// Ticket B3 (React/perf): marked below.

'use client'

import { useState } from 'react'
import { DirectoryList } from './DirectoryList'
import { people } from './people'

export function DirectorySearch() {
  const [query, setQuery] = useState('')

  // Issue (React/perf): this filter re-runs on every render — including
  // renders where `query` hasn't changed — because it isn't memoized. It
  // allocates a new lowercase string per person and a new array every time,
  // even though `people` is static and only `query` should invalidate it.
  const normalizedQuery = query.toLowerCase()
  const filtered = people.filter((person) => {
    const haystack = `${person.name} ${person.role}`.toLowerCase()
    return haystack.includes(normalizedQuery)
  })

  return (
    <div>
      <label htmlFor="directory-search">Search teammates</label>
      <input
        id="directory-search"
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <DirectoryList people={filtered} onMessage={(id) => console.log('message', id)} />
    </div>
  )
}
