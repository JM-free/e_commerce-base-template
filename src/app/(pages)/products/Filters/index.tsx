'use client'

import React from 'react'
import Select from 'react-select'

import { Category } from '../../../../payload/payload-types'
import { useFilter } from '../../../_providers/Filter'

import classes from './index.module.scss'

const Filters = ({ categories }: { categories: Category[] }) => {
  const { categoryFilters, sort, setCategoryFilters, setSort } = useFilter()

  const handleCategories = (categoryId: string) => {
    if (categoryFilters.includes(categoryId)) {
      const updatedCategories = categoryFilters.filter(id => id !== categoryId)

      setCategoryFilters(updatedCategories)
    } else {
      setCategoryFilters([...categoryFilters, categoryId])
    }
  }

  const handleSort = (value: string) => setSort(value)

  return (
    <div className={classes.filters}>
      <div>
        <h6 className={classes.title}> Categorías</h6>
        <div className={classes.categories}>
          <Select
            isMulti
            options={categories.map(category => ({
              value: category.id,
              label: category.title,
            }))}
            value={categories
              .filter(category => categoryFilters.includes(category.id))
              .map(category => ({ value: category.id, label: category.title }))}
            onChange={selected => {
              setCategoryFilters(selected ? selected.map((opt: any) => opt.value) : [])
            }}
            classNamePrefix="react-select"
            placeholder="Escribe para buscar categorías..."
          />
        </div>
      </div>
    </div>
  )
}

export default Filters
