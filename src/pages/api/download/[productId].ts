import fs from 'fs'
import type { NextApiResponse } from 'next'
import path from 'path'
import payload from 'payload'
import type { PayloadRequest } from 'payload/types'

// /api/download/[productId]
export default async function handler(req: PayloadRequest, res: NextApiResponse): Promise<void> {
  const { productId } = req.query
  if (!productId || typeof productId !== 'string') {
    return res.status(400).json({ error: 'Missing productId' })
  }

  // Authenticate user using Payload's built-in auth
  const user = req.user
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  // Define a type for purchase items
  type Purchase = { id: string } | string

  // Check if user has purchased this product
  const hasPurchased = user.purchases?.some(
    (purchase: Purchase) => (typeof purchase === 'object' ? purchase.id : purchase) === productId,
  )
  if (!hasPurchased) {
    return res.status(403).json({ error: 'You have not purchased this product' })
  }

  // Fetch product and its digitalFile
  const product = await payload.findByID({ collection: 'products', id: productId })
  if (!product?.digitalFile) {
    return res.status(404).json({ error: 'No digital file for this product' })
  }

  // Fetch digital file from the new collection
  const digitalFileId =
    typeof product.digitalFile === 'object' &&
    product.digitalFile !== null &&
    'id' in product.digitalFile
      ? (product.digitalFile as { id: string }).id
      : (product.digitalFile as string)

  const media = await payload.findByID({ collection: 'digitalfiles', id: digitalFileId })
  if (!media?.filename) {
    return res.status(404).json({ error: 'Digital file not found' })
  }

  // Serve the file securely by streaming it
  const mediaDir = path.resolve(process.cwd(), 'private_digital_files')
  const filePath = path.join(mediaDir, media.filename as string)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found on server' })
  }

  res.setHeader('Content-Type', (media.mimeType as string) || 'application/octet-stream')
  res.setHeader('Content-Disposition', `attachment; filename="${media.filename}"`)
  const fileStream = fs.createReadStream(filePath)
  fileStream.pipe(res)
}
