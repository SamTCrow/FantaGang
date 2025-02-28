import { logInSchema } from '~/shared/utils/userLogin'

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, logInSchema.safeParse)
  const session = await getUserSession(event)
  if (session.user) {
    return {
      success: false,
      message: 'Sei già loggato'
    }
  }
  if (result.success) {
    const { userName, password } = result.data
    const user = await db().select().from(tables.users).where(eq(tables.users.userName, userName)).get()
    if (!user) {
      return {
        success: false,
        message: 'Utente inesistente'
      }
    }
    if (await verifyPassword(user.password, password)) {
      await setUserSession(event, {
        user: {
          username: user.userName,
          id: user.id
        },
        loggedIn: new Date()
      })
      return {
        success: true,
        message: 'Utente loggato'
      }
    } else {
      return {
        success: false,
        message: 'Password Errata'
      }
    }
  }
  return {
    success: false,
    message: 'Errore ignoto'
  }
})
