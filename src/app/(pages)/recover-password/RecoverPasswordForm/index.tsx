'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'

import { Button } from '../../../_components/Button'
import { Input } from '../../../_components/Input'
import { Message } from '../../../_components/Message'

import classes from './index.module.scss'

type FormData = {
  email: string
}

export const RecoverPasswordForm: React.FC = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = useCallback(async (data: FormData) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.ok) {
      setSuccess(true)
      setError('')
    } else {
      setError(
        'Ha ocurrido un error al enviar la solicitud. Por favor, verifica tu correo electrónico o inténtalo de nuevo más tarde.',
      )
    }
  }, [])

  return (
    <Fragment>
      {!success && (
        <React.Fragment>
          <p>Introduce tu correo electrónico para recuperar tu contraseña.</p>

          <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <Message error={error} className={classes.message} />
            <Input
              name="email"
              label="Correo electrónico"
              required
              register={register}
              error={errors.email}
              type="email"
            />
            <Button
              type="submit"
              appearance="primary"
              label="Recuperar contraseña"
              className={classes.submit}
            />
          </form>
        </React.Fragment>
      )}
      {success && (
        <React.Fragment>
          <h1>📨</h1>
          <p>
            Se ha enviado un correo electrónico con las instrucciones para recuperar tu contraseña.
          </p>
        </React.Fragment>
      )}
    </Fragment>
  )
}
