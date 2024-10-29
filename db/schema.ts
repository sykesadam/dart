import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const usersTable = sqliteTable('users_table', {
	id: int().primaryKey({ autoIncrement: true }),
	email: text().notNull(),
	password: text().notNull(),
})
export type User = typeof usersTable.$inferSelect
