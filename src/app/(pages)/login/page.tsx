import React from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Gutter } from '../../_components/Gutter'
import { RenderParams } from '../../_components/RenderParams'
import { getMeUser } from '../../_utilities/getMeUser'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'
import LoginForm from './LoginForm'

import classes from './index.module.scss'

export default async function Login() {
  await getMeUser({
    validUserRedirect: `/account?warning=${encodeURIComponent('Ya has iniciado sesión.')}`,
  })

  return (
    <section className={classes.login}>
      <div className={classes.heroImg}></div>

      <div className={classes.formWrapper}>
        <div className={classes.formContainer}>
          <RenderParams className={classes.params} />
          <div className={classes.formTitle}>
            <h3>Hola</h3>
            <Image src="/assets/icons/hand.svg" alt="hand" width={30} height={30} />
          </div>

          <p>Por favor, introduce tus datos</p>

          <LoginForm />
        </div>
      </div>
    </section>
  )
}

export const metadata: Metadata = {
  title: 'Iniciar Sesión',
  description: 'Iniciar sesión o crear una nueva cuenta.',
  openGraph: mergeOpenGraph({
    title: 'Iniciar Sesión',
    url: '/login',
  }),
}
