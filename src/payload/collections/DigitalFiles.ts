import path from 'path'
import type { CollectionConfig } from 'payload/types'

const DigitalFiles: CollectionConfig = {
  slug: 'digitalfiles',
  upload: {
    staticDir: path.resolve(__dirname, '../../../private_digital_files'),
  },
  access: {
    read: ({ req }) => {
      // Allow admins
      if (req.user?.roles?.includes('admin')) return true
      // Allow authenticated users
      if (req.user) return true
      // TODO:add more logic for purchase check
      return false
    },
    create: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
    update: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
    delete: ({ req: { user } }) => Boolean(user?.roles?.includes('admin')),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}

export default DigitalFiles
