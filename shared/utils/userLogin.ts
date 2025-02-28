import { z } from 'zod'
export const logInSchema = z.object({
  userName: z.string({ message: 'Devi inserire un nome utente' }).trim(),
  password: z.string({ message: 'Devi inserire una password' })
})

export type UserLogin = z.output<typeof logInSchema>
