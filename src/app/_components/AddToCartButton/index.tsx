'use client'

import React, { useEffect, useState } from 'react'

import { Product } from '../../../payload/payload-types'
import { useCart } from '../../_providers/Cart'
import { Button, Props } from '../Button'

import classes from './index.module.scss'

export const AddToCartButton: React.FC<{
  product: Product
  quantity?: number
  className?: string
  appearance?: Props['appearance']
}> = props => {
  const { product, quantity = 1, className, appearance = 'primary' } = props

  const { cart, addItemToCart, isProductInCart, hasInitializedCart } = useCart()

  const [isInCart, setIsInCart] = useState<boolean>()

  useEffect(() => {
    setIsInCart(isProductInCart(product))
  }, [isProductInCart, product, cart])

  if (isInCart) {
    return (
      <div className={classes.buttonWrapper}>
        <Button
          href="/cart"
          label="✓ Ver en carrito"
          el="link"
          appearance={appearance}
          className={[
            className,
            classes.addToCartButton,
            appearance === 'default' && classes.green,
            !hasInitializedCart && classes.hidden,
          ]
            .filter(Boolean)
            .join(' ')}
        />
        <Button
          href="/products"
          label="Seguir comprando"
          el="link"
          appearance="secondary"
          className={[className, classes.addToCartButton, !hasInitializedCart && classes.hidden]
            .filter(Boolean)
            .join(' ')}
        />
      </div>
    )
  }

  return (
    <Button
      type="button"
      label="Agregar al carrito"
      appearance={appearance}
      className={[className, classes.addToCartButton, !hasInitializedCart && classes.hidden]
        .filter(Boolean)
        .join(' ')}
      onClick={() => {
        addItemToCart({
          product,
          quantity,
        })
      }}
    />
  )
}
