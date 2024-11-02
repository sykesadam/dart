import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
	id: integer().primaryKey({ autoIncrement: true }),
	email: text().notNull(),
	password: text().notNull(),
	role: text().$type<'user' | 'admin'>().default('user'),
	created_at: integer({ mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`),
})
export type User = typeof users.$inferSelect

export const match = sqliteTable('match', {
	id: integer().primaryKey({ autoIncrement: true }),
	user_id: integer()
		.references(() => users.id)
		.notNull(),
	score: integer(),
	players: text('', { mode: 'json' }).$type<string[]>().notNull(),
	status: text().$type<'done' | 'started' | 'cancelled'>().default('started'),
	created_at: integer({ mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`),
})
export type Match = typeof match.$inferSelect

export const matchRounds = sqliteTable('match_rounds', {
	id: integer().primaryKey({ autoIncrement: true }),
	match_id: integer()
		.references(() => match.id)
		.notNull(),
	round: integer().notNull(),
	score: integer(),
	created_at: integer({ mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`),
})
