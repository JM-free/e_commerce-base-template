import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Work in progress',
  description: 'Culícula — work in progress',
}

export default function HomePage() {
  return (
    <section className="container">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '2rem 1rem',
        }}
      >
        <Image
          src="/culicula-working.png"
          alt="Work in progress"
          width={1200}
          height={800}
          style={{ maxWidth: '100%', height: 'auto' }}
          priority
        />
      </div>
    </section>
  )
}
