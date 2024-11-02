import { createServerFn } from '@tanstack/start'
import { createMatchWithRounds, db } from 'db'
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

export const createMatch = createServerFn('POST', async () => {
	const session = await useAppSession()

	if (!session.data.id) {
		return null
	}

	await createMatchWithRounds(session.data.id, [
		{
			round: 1,
			score: 0,
		},
	])
})

export const saveRoundToDb = createServerFn(
	'POST',
	async (round: { round: number; score: number }) => {
		const session = await useAppSession()

		if (!session.data.id) {
			return null
		}

		await db.insert(matchRounds).values({
			match_id: round.matchId,
			round: round.round,
			score: round.score,
		})
	},
)
