import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
import { anyone } from '../../access/anyone'
import adminsAndUser from './access/adminsAndUser'
import { checkRole } from './checkRole'
import { customerProxy } from './endpoints/customer'
import { createStripeCustomer } from './hooks/createStripeCustomer'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { loginAfterCreate } from './hooks/loginAfterCreate'
import { resolveDuplicatePurchases } from './hooks/resolveDuplicatePurchases'
import { CustomerSelect } from './ui/CustomerSelect'

const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
  },
  access: {
    read: adminsAndUser,
    create: anyone,
    update: adminsAndUser,
    delete: admins,
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    beforeChange: [createStripeCustomer],
    afterChange: [loginAfterCreate],
  },
  auth: {
    forgotPassword: {
      generateEmailHTML: ({ token }) => {
        // This URL points to the frontend route already implemented in the template
        const resetPasswordURL = `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/reset-password?token=${token}`

        return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { padding: 20px; max-width: 600px; margin: 20px auto; border: 1px solid #eee; border-radius: 5px; }
            .header { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #000; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .section { margin-bottom: 30px; }
            .footer { margin-top: 30px; font-size: 14px; color: #666; border-top: 1px solid #eee; padding-top: 10px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #000; color: #fff !important; text-decoration: none; border-radius: 5px; margin: 15px 0; font-weight: bold; }
            .link-alt { font-size: 12px; color: #888; word-break: break-all; }
            hr { border: 0; border-top: 1px solid #eee; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="section">
              <div class="header">Reiniciar contraseña</div>
              <p>Hola,</p>
              <p>Has solicitado reiniciar tu contraseña de <strong>Culiculá</strong>. No hay problema, ¡a mí me pasa todo el tiempo!</p>
              <p>Haz clic en el botón de abajo para crear una nueva:</p>
              <a href="${resetPasswordURL}" class="button">Cambiar mi contraseña</a>
              <p>Si no has pedido reiniciar tu contraseña, puedes ignorar este mensaje con total seguridad.</p>
            </div>

            <hr>

            <div class="section">
              <div class="header">Reset Password</div>
              <p>Hi,</p>
              <p>You requested a password reset for your <strong>Culiculá</strong> account. No worries — it happens to the best of us.</p>
              <p>Please click the button below to create a new password:</p>
              <a href="${resetPasswordURL}" class="button">Reset my password</a>
              <p>If you didn’t request a password reset, you can safely ignore this message.</p>
            </div>

            <div class="footer">
              <p class="link-alt">${resetPasswordURL}</p>
              <p>&copy; ${new Date().getFullYear()} Culiculá</p>
            </div>
          </div>
        </body>
        </html>
        `
      },
    },
  },
  endpoints: [
    {
      path: '/:teamID/customer',
      method: 'get',
      handler: customerProxy,
    },
    {
      path: '/:teamID/customer',
      method: 'patch',
      handler: customerProxy,
    },
  ],
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['customer'],
      options: [
        {
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'customer',
          value: 'customer',
        },
      ],
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      access: {
        read: admins,
        create: admins,
        update: admins,
      },
    },
    {
      name: 'purchases',
      label: 'Purchases',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      hooks: {
        beforeChange: [resolveDuplicatePurchases],
      },
    },
    {
      name: 'stripeCustomerID',
      label: 'Stripe Customer',
      type: 'text',
      access: {
        read: ({ req: { user } }) => checkRole(['admin'], user),
      },
      admin: {
        position: 'sidebar',
        components: {
          Field: CustomerSelect,
        },
      },
    },
    {
      label: 'Cart',
      name: 'cart',
      type: 'group',
      fields: [
        {
          name: 'items',
          label: 'Items',
          type: 'array',
          interfaceName: 'CartItems',
          fields: [
            {
              name: 'product',
              type: 'relationship',
              relationTo: 'products',
            },
            {
              name: 'quantity',
              type: 'number',
              min: 0,
              admin: {
                step: 1,
              },
            },
          ],
        },
        // If you wanted to maintain a 'created on'
        // or 'last modified' date for the cart
        // you could do so here:
        // {
        //   name: 'createdOn',
        //   label: 'Created On',
        //   type: 'date',
        //   admin: {
        //     readOnly: true
        //   }
        // },
        // {
        //   name: 'lastModified',
        //   label: 'Last Modified',
        //   type: 'date',
        //   admin: {
        //     readOnly: true
        //   }
        // },
      ],
    },
    {
      name: 'skipSync',
      label: 'Skip Sync',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
  ],
  timestamps: true,
}

export default Users
