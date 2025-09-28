import React from 'react'
import Link from 'next/link'

import { Category, Media } from '../../../payload/payload-types'
import CategoryCard from './CategoryCard'

import classes from './index.module.scss'

type Props = {
  categories: Category[]
  bottomImage?: string | Media
}

const Categories: React.FC<Props> = ({ categories, bottomImage }) => {
  const bottomImageUrl = typeof bottomImage === 'string' ? undefined : bottomImage?.url
  const bottomImageAlt = typeof bottomImage === 'string' ? '' : bottomImage?.alt ?? ''

  return (
    <section className={classes.container}>
      <div className={classes.titleWrapper}>
        <h3>Categorías</h3>
        <Link href="/products"> Todos los productos</Link>
      </div>

      <div className={classes.list}>
        {categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      {bottomImageUrl ? (
        <div className={classes.bottomImage}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bottomImageUrl} alt={bottomImageAlt} />
        </div>
      ) : null}
    </section>
  )
}

export default Categories
