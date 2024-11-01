import { sql } from 'drizzle-orm'
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
	id: int().primaryKey({ autoIncrement: true }),
	email: text().notNull(),
	password: text().notNull(),
	role: text().$type<'user' | 'admin'>().default('user'),
	createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
})
export type User = typeof users.$inferSelect
