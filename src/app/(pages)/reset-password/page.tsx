import React from 'react'
import { Metadata } from 'next'

import { Gutter } from '../../_components/Gutter'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'
import { ResetPasswordForm } from './ResetPasswordForm'

import classes from './index.module.scss'

export default async function ResetPassword() {
  return (
    <Gutter className={classes.resetPassword}>
      <h1>Nueva Contraseña</h1>
      <p>Introduce una nueva contraseña.</p>
      <ResetPasswordForm />
    </Gutter>
  )
}

export const metadata: Metadata = {
  title: 'Nueva Contraseña',
  description: 'Introduce una nueva contraseña para tu cuenta.',
  openGraph: mergeOpenGraph({
    title: 'Nueva Contraseña',
    url: '/reset-password',
  }),
}
