import type { Media } from '../../payload/payload-types'
import { CATEGORIES_SETTINGS_QUERY } from '../_graphql/globals'
import { GRAPHQL_API_URL } from './shared'

export type CategoriesSettingsResult = {
  bottomImage?: string | Media
}

export async function fetchCategoriesSettings(): Promise<CategoriesSettingsResult> {
  if (!GRAPHQL_API_URL) throw new Error('NEXT_PUBLIC_SERVER_URL not found')

  const data = await fetch(`${GRAPHQL_API_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify({
      query: CATEGORIES_SETTINGS_QUERY,
    }),
  })
    ?.then(res => {
      if (!res.ok) throw new Error('Error fetching CategoriesSettings')
      return res.json()
    })
    ?.then(res => {
      if (res?.errors) throw new Error(res?.errors[0]?.message || 'Error fetching CategoriesSettings')
      return res.data?.CategoriesSettings as CategoriesSettingsResult
    })

  return data
}
