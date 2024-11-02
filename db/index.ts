import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'
import { match, matchRounds } from './schema'
import { eq } from 'drizzle-orm'

export const db = drizzle({
	connection: process.env.DB_FILE_NAME!,
	casing: 'snake_case',
})

// Get all matches for a user with their rounds
export const getUserMatches = async (userId: number) => {
	return await db
		.select()
		.from(match)
		.where(eq(match.user_id, userId))
		.leftJoin(matchRounds, eq(match.id, matchRounds.match_id))
}

// Insert new match with rounds
export const createMatchWithRounds = async (
	userId: number,
	rounds: Array<{ round: number; score: number }>,
) => {
	const newMatch = await db
		.insert(match)
		.values({ user_id: userId })
		.returning()
		.get()

	await db.insert(matchRounds).values(
		rounds.map((r) => ({
			match_id: newMatch.id,
			round: r.round,
			score: r.score,
		})),
	)
}
