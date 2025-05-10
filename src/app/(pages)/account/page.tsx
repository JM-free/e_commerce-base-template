import React from 'react'
import { Metadata } from 'next'

import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'
import AccountForm from './AccountForm'

import classes from './index.module.scss'

export default async function Account() {
  return (
    <div>
      <h5 className={classes.personalInfo}>Información Personal</h5>
      <AccountForm />
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Cuenta de usuario',
  description: 'Crea una cuenta de usuario o inicia sesión',
  openGraph: mergeOpenGraph({
    title: 'Cuenta de usuario',
    url: '/account',
  }),
}
