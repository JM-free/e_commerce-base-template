import React from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Gutter } from '../../_components/Gutter'
import { RenderParams } from '../../_components/RenderParams'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'
import { RecoverPasswordForm } from './RecoverPasswordForm'

import classes from './index.module.scss'

export default async function RecoverPassword() {
  return (
    <section className={classes.recoverPassword}>
      <div className={classes.heroImg}></div>

      <div className={classes.formWrapper}>
        <div className={classes.formContainer}>
          <RenderParams className={classes.params} />

          <Link href="/login" className={classes.backLink}>
            <Image src="/assets/icons/arrow-left.svg" alt="left arrow" width={24} height={24} />
            <p>Atrás</p>
          </Link>
          <div className={classes.formTitle}>
            <h3>Recuperar Contraseña</h3>
          </div>
          <RecoverPasswordForm />
        </div>
      </div>
    </section>
  )
}

export const metadata: Metadata = {
  title: 'Recuperar Contraseña',
  description: 'Introduce tu correo electrónico para recuperar tu contraseña.',
  openGraph: mergeOpenGraph({
    title: 'Recuperar Contraseña',
    url: '/recover-password',
  }),
}
