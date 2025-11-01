import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work in progress',
  description: 'Culícula — work in progress',
}

export default function HomePage() {
  return (
    <section className="container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '2rem 1rem' }}>
        <img
          src="/culicula-working.png"
          alt="Work in progress"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
    </section>
  )
}
