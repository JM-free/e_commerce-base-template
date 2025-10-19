// Build a CSP string allowing required third-parties and the app/API origins from env
// This helps prevent CSP violations when NEXT_PUBLIC_SERVER_URL or PAYLOAD_PUBLIC_SERVER_URL
// point to a different origin (e.g., a Vercel domain) than the one serving the site.

const toOrigin = url => {
  try {
    if (!url) return null
    // Ensure we output a scheme+host origin (e.g., https://example.com)
    const u = new URL(url)
    return `${u.protocol}//${u.host}`
  } catch (_) {
    return null
  }
}

const envOrigins = [
  toOrigin(process.env.NEXT_PUBLIC_SERVER_URL),
  toOrigin(process.env.PAYLOAD_PUBLIC_SERVER_URL),
]
  .filter(Boolean)
  // de-duplicate
  .filter((v, i, a) => a.indexOf(v) === i)

const policies = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://checkout.stripe.com',
    'https://js.stripe.com',
    'https://maps.googleapis.com',
  ],
  'child-src': ["'self'"],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': [
    "'self'",
    'https://*.stripe.com',
    'https://raw.githubusercontent.com',
  ],
  'font-src': ["'self'"],
  'frame-src': [
    "'self'",
    'https://checkout.stripe.com',
    'https://js.stripe.com',
    'https://hooks.stripe.com',
  ],
  'connect-src': [
    "'self'",
    'https://checkout.stripe.com',
    'https://api.stripe.com',
    'https://maps.googleapis.com',
    // Also allow our API/app origins as defined by env
    ...envOrigins,
  ],
}

module.exports = Object.entries(policies)
  .map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key} ${value.join(' ')}`
    }
    return ''
  })
  .join('; ')
