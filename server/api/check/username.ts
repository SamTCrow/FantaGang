import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { userName } = await getValidatedQuery(
    event,
    z.object({
      userName: z.string().trim()
    }).parse
  )
  const result = await db().select().from(tables.users).where(eq(tables.users.userName, userName)).get()
  if (!result) {
    return false
  } else {
    return true
  }
})
