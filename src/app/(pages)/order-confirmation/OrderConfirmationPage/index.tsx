'use client'

import React, { Fragment, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import { Button } from '../../../_components/Button'
import { Message } from '../../../_components/Message'
import { useCart } from '../../../_providers/Cart'

import classes from './index.module.scss'

export const OrderConfirmationPage: React.FC<{}> = () => {
  const searchParams = useSearchParams()
  const orderID = searchParams.get('order_id')
  const error = searchParams.get('error')

  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div>
      {error ? (
        <Fragment>
          <Message error={error} />
          <p>
            {`Tu pago ha sido processado pero ha ocurrido un error con tu pedido. Por favor, ponte en contacto con nosotros para resolverlo de inmediato.`}
          </p>
          <div className={classes.actions}>
            <Button href="/account" label="Ver mi perfil" appearance="primary" />
            <Button
              href={`${process.env.NEXT_PUBLIC_SERVER_URL}/orders`}
              label="Ver todos mis pedidos"
              appearance="secondary"
            />
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <h1>Gracias por tu pedido!</h1>
          <p>
            {`Tu pedido ha sido confirmado. Reciviras un correo electrónico de confirmación en breve. Tu número de pedido es ${orderID}.`}
          </p>
          <div className={classes.actions}>
            <Button
              href={`/account/orders/${orderID}`}
              label="Ver detalles del pedido"
              appearance="primary"
            />
            <Button
              href={`${process.env.NEXT_PUBLIC_SERVER_URL}/account/orders`}
              label="Ver todos mis pedidos"
              appearance="secondary"
            />
          </div>
        </Fragment>
      )}
    </div>
  )
}
