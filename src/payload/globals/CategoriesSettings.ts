import type { GlobalConfig } from 'payload/types'

export const CategoriesSettings: GlobalConfig = {
  slug: 'categories-settings',
  typescript: {
    interface: 'CategoriesSettings',
  },
  graphQL: {
    name: 'CategoriesSettings',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'bottomImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Bottom image for Categories page',
      admin: {
        description: 'This image appears under the categories list on the Categories section of the home page.',
      },
    },
  ],
}
