import { createServerFn } from '@tanstack/start'
import { db } from 'db'
import { users } from 'db/schema'
import { eq } from 'drizzle-orm'
import { useAppSession } from './session'
import { queryOptions } from '@tanstack/react-query'

export const currentUser = createServerFn('GET', async () => {
	const session = await useAppSession()

	if (!session.data.id) {
		return null
	}

	const user = await db
		.select()
		.from(users)
		.where(eq(users.id, session.data.id))
		.get()
		.catch((err) => {
			console.error('currentUser query error', err)
		})

	if (!user) {
		return null
	}

	return {
		email: user.email,
		role: user.role,
	}
})

export const currentUserQueryOptions = () =>
	queryOptions({
		queryKey: ['currentUser'],
		queryFn: () => currentUser(),
	})

export type CurrentUser = Awaited<ReturnType<typeof currentUser>>
