import type { AfterChangeHook } from 'payload/dist/collections/config/types'

import type { Order, Product, User } from '../../../payload-types'
import { confirmationEmailTemplate } from './confirmationEmailTemplate'

export const sendConfirmationEmail: AfterChangeHook<Order> = async ({ doc, req, operation }) => {
  if (operation === 'create') {
    const { payload } = req

    try {
      const orderedBy =
        typeof doc.orderedBy === 'object'
          ? doc.orderedBy
          : await payload.findByID({
              collection: 'users',
              id: doc.orderedBy as string,
            })

      if (orderedBy) {
        const user = orderedBy as User

        const itemsHtml = await Promise.all(
          (doc.items || []).map(async item => {
            let product: Product | null = null
            if (typeof item.product === 'object') {
              product = item.product as Product
            } else {
              product = await payload.findByID({
                collection: 'products',
                id: item.product as string,
              })
            }

            const title = product?.title || 'Product'
            return `<li>${title} (x${item.quantity}) - $${item.price}</li>`
          }),
        )

        await payload.sendEmail({
          from: '"Culiculá" <noreply@notifications.culicula.com>',
          to: user.email,
          subject: 'Confirmación de Compra - Culiculá',
          html: confirmationEmailTemplate({
            name: user.name || 'Cliente',
            orderID: doc.id,
            total: doc.total,
            itemsHtml: itemsHtml.join(''),
          }),
        })
      }
    } catch (error: unknown) {
      payload.logger.error(`Error sending confirmation email for order ${doc.id}: ${error}`)
    }
  }
}
