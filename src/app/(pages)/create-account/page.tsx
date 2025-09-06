import React from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Gutter } from '../../_components/Gutter'
import { RenderParams } from '../../_components/RenderParams'
import { getMeUser } from '../../_utilities/getMeUser'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'
import CreateAccountForm from './CreateAccountForm'

import classes from './index.module.scss'

export default async function CreateAccount() {
  await getMeUser({
    validUserRedirect: `/account?warning=${encodeURIComponent(
      'No puedes crear una nueva cuenta mientras tienes una sesión activa, por favor cierra sesión e intentalo de nuevo.',
    )}`,
  })

  return (
    <section className={classes.createAccount}>
      <div className={classes.heroImg}></div>

      <div className={classes.formWrapper}>
        <div className={classes.formContainer}>
          <RenderParams className={classes.params} />

          <div className={classes.formTitle}>
            <h3>Crea una cuenta</h3>
            <Image src="/assets/icons/hand.svg" alt="hand" width={30} height={30} />
          </div>

          <p>Por favor, introduce tus datos</p>

          <CreateAccountForm />
        </div>
      </div>
    </section>
  )
}

export const metadata: Metadata = {
  title: 'Cuenta de usuario',
  description: 'Crea una cuenta o inicia sesión.',
  openGraph: mergeOpenGraph({
    title: 'Cuenta de usuario',
    url: '/account',
  }),
}
