import { createServerFn } from '@tanstack/start'
import { db } from 'db'
import { usersTable } from 'db/schema'
import { eq } from 'drizzle-orm'
import { useAppSession } from './session'

export const currentUser = createServerFn('GET', async () => {
	const session = await useAppSession()

	if (!session.data.id) {
		return null
	}

	const user = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.id, session.data.id))
		.get()

	if (!user) {
		return null
	}

	return {
		email: user.email,
	}
})
