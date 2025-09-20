import React from 'react'
import Image from 'next/image'

import type { Media as PayloadMedia } from '../../payload/payload-types'

import classes from './FeatureImageGrid.module.scss'

export type FeatureImage = {
  image: PayloadMedia
  caption?: string
}

type Props = {
  images?: FeatureImage[] | null
}

export const FeatureImageGrid: React.FC<Props> = ({ images }) => {
  if (!images || images.length === 0) return null

  // Filter out any invalid items just in case
  const valid = images.filter(
    (item): item is FeatureImage => !!item && !!item.image && typeof item.image === 'object',
  )
  if (valid.length === 0) return null

  return (
    <div className={classes.grid}>
      {valid.map(({ image, caption }, idx) => {
        const src = (image as any).url
          ? (image as any).url
          : `${process.env.NEXT_PUBLIC_SERVER_URL}/media/${(image as any).filename}`
        const alt = (image as any).alt || ''
        return (
          <figure key={idx} className={classes.figure}>
            <Image src={src} alt={alt} className={classes.image} />
            {caption ? <figcaption className={classes.caption}>{caption}</figcaption> : null}
          </figure>
        )
      })}
    </div>
  )
}
