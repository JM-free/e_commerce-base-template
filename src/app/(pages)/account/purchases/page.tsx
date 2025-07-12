import React from 'react'
import Link from 'next/link'

import { Button } from '../../../_components/Button'
import { Media } from '../../../_components/Media'
import { Price } from '../../../_components/Price'
import { formatDateTime } from '../../../_utilities/formatDateTime'
import { getMeUser } from '../../../_utilities/getMeUser'

import classes from './index.module.scss'

export default async function Purchases() {
  const { user } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'Por favor, inicia sesión para acceder a tu cuenta.',
    )}&redirect=${encodeURIComponent('/account')}`,
  })

  return (
    <div>
      <h5>Pedidos</h5>
      <div>
        {user?.purchases?.length || 0 > 0 ? (
          <ul className={classes.purchases}>
            {user?.purchases?.map((purchase, index) => {
              return (
                <li key={index} className={classes.purchase}>
                  {typeof purchase === 'string' ? (
                    <p>{purchase} Test</p>
                  ) : (
                    <>
                      <Link href={`/products/${purchase.slug}`} className={classes.item}>
                        <div className={classes.mediaWrapper}>
                          {!purchase.meta.image && (
                            <div className={classes.placeholder}>No image</div>
                          )}
                          {purchase.meta.image && typeof purchase.meta.image !== 'string' && (
                            <Media imgClassName={classes.image} resource={purchase.meta.image} />
                          )}
                        </div>
                        <div className={classes.itemDetails}>
                          <h6>{purchase.title}</h6>
                          <Price product={purchase} />
                          <p
                            className={classes.purchasedDate}
                          >{`Comprado con fecha: ${formatDateTime(purchase.createdAt)}`}</p>
                        </div>
                      </Link>
                      {purchase.digitalFile && (
                        <a
                          href={`/api/download/${purchase.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={classes.downloadLink}
                        >
                          <Button
                            type="submit"
                            label="Descargar archivo digital"
                            appearance="primary"
                            className={classes.downloadButton}
                          />
                        </a>
                      )}
                    </>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <div className={classes.noPurchases}>Ninguna compra econtrada.</div>
        )}
      </div>
    </div>
  )
}
