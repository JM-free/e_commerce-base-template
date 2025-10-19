// Note: This will not work in dev mode and will throw an error upon startup
// This is because the Payload APIs are not yet running when the Next.js server starts
// This is not a problem in production as Payload is booted up before building Next.js
// For this reason the errors can be silently ignored in dev mode

module.exports = async () => {
  const internetExplorerRedirect = {
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    destination: '/ie-incompatible.html',
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/redirects?limit=1000&depth=1`,
      { headers: { Accept: 'application/json' } },
    )

    // If the API isn't available or doesn't return JSON, fall back gracefully
    const contentType = res.headers.get('content-type') || ''
    if (!res.ok || !contentType.includes('application/json')) {
      if (process.env.NODE_ENV === 'production') {
        console.error(
          `Error configuring redirects: status=${res.status} content-type=${contentType}`,
        )
      }
      return [internetExplorerRedirect]
    }

    let docs = []
    try {
      const data = await res.json()
      docs = data?.docs || []
    } catch (e) {
      if (process.env.NODE_ENV === 'production') {
        console.error(`Error parsing redirects JSON: ${e}`)
      }
      return [internetExplorerRedirect]
    }

    const dynamicRedirects = []

    if (Array.isArray(docs)) {
      docs.forEach(doc => {
        const { from, to: { type, url, reference } = {} } = doc

        let source = String(from || '/')
          .replace(process.env.NEXT_PUBLIC_SERVER_URL || '', '')
          .split('?')[0]
          .toLowerCase()

        if (source.endsWith('/')) source = source.slice(0, -1) // a trailing slash will break this redirect

        let destination = '/'

        if (type === 'custom' && url) {
          destination = String(url).replace(process.env.NEXT_PUBLIC_SERVER_URL || '', '')
        }

        if (
          type === 'reference' &&
          reference &&
          typeof reference.value === 'object' &&
          reference?.value?._status === 'published'
        ) {
          destination = `${process.env.NEXT_PUBLIC_SERVER_URL}/${
            reference.relationTo !== 'pages' ? `${reference.relationTo}/` : ''
          }${reference.value.slug}`
        }

        const redirect = {
          source,
          destination,
          permanent: true,
        }

        if (source.startsWith('/') && destination && source !== destination) {
          dynamicRedirects.push(redirect)
        }
      })
    }

    return [internetExplorerRedirect, ...dynamicRedirects]
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error(`Error configuring redirects: ${error}`) // eslint-disable-line no-console
    }

    return []
  }
}
