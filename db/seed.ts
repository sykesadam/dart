import { db } from 'db'
import { users } from './schema'

async function main() {
	const user: typeof users.$inferInsert = {
		email: 'john@example.com',
		password: 'penis',
	}
	await db.insert(users).values(user)
	console.log('New user created!')
	const users = await db.select().from(users)
	console.log('Getting all users from the database: ', users)
	/*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */
	// await db
	// 	.update(usersTable)
	// 	.set({
	// 		age: 31,
	// 	})
	// 	.where(eq(usersTable.email, user.email))
	// console.log('User info updated!')
	// await db.delete(usersTable).where(eq(usersTable.email, user.email))
	// console.log('User deleted!')
}

main()
