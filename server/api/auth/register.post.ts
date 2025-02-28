import { userPost } from '~/shared/utils/userPost'

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, userPost.safeParseAsync)
  const session = await getUserSession(event)

  if (result.success && !session.user) {
    const { userName, password, email } = result.data
    const hashedPassword = await hashPassword(password)
    const newUser = await db()
      .insert(tables.users)
      .values({
        userName,
        email,
        password: hashedPassword
      })
      .returning({ userName: tables.users.userName, id: tables.users.id })
      .get()

    if (newUser) {
      await setUserSession(event, {
        user: {
          username: userName,
          id: newUser.id
        },
        loggedIn: new Date()
      })
    }

    return { success: true }
  } else {
    return { success: false, error: result.error }
  }
})
