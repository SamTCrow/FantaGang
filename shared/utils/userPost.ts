import { z } from 'zod'
import email from '~/server/api/check/email'
const emailCheck = async (email: string) => {
  const result = await $fetch('/api/check/email', { query: { email } })
  return !result
}

const userCheck = async (user: string) => {
  const result = await $fetch('/api/check/username', {
    query: {
      userName: user
    }
  })
  return !result
}

export const userPost = z
  .object({
    userName: z
      .string({ message: 'Richiesta' })
      .min(3, { message: 'Il nome utente deve essere di almeno 3 caratteri' })
      .max(20, { message: 'Il nome utente deve essere al massimo di 20 caratteri' })
      .trim()
      .refine(
        async (data) => {
          const user = await userCheck(data)
          return user
        },
        { message: 'Utente già registrato' }
      ),
    password: z
      .string({ message: 'Richiesta' })
      .min(6, { message: 'La password deve essere almeno di 6 caratteri' })
      .max(12, { message: 'La password non deve superare i 12 caratteri' }),
    confirmPassword: z
      .string({ message: 'Richiesta' })
      .min(6, { message: 'La password deve essere almeno di 6 caratteri' })
      .max(12, { message: 'La password non deve superare i 12 caratteri' }),
    email: z
      .string({ message: 'Richiesta' })
      .email({ message: 'Email non valida' })
      .trim()
      .min(1, { message: 'Devi inserire un indirizzo Email' })
      .refine(async data => await emailCheck(data), { message: 'Email già esistente' })
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Le password non corrispondono',
    path: ['confirmPassword']
  })

export type UserPost = z.output<typeof userPost>;
