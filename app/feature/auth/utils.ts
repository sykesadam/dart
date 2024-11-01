import { createServerFn } from '@tanstack/start'
import { db } from 'db'
import { users } from 'db/schema'
import crypto from 'node:crypto'
import { eq } from 'drizzle-orm'
import { useAppSession } from './session'

export function hashPassword(password: string) {
	return new Promise<string>((resolve, reject) => {
		crypto.pbkdf2(password, 'salt', 100000, 64, 'sha256', (err, derivedKey) => {
			if (err) {
				reject(err)
			} else {
				resolve(derivedKey.toString('hex'))
			}
		})
	})
}

export const loginFn = createServerFn(
	'POST',
	async (payload: { email: string; password: string }) => {
		// Find the user
		const user = await db
			.select()
			.from(users)
			.where(eq(users.email, payload.email))
			.get()

		// Check if the user exists
		if (!user) {
			return {
				error: true,
				userNotFound: true,
				message: 'User not found',
			}
		}

		// Check if the password is correct
		const hashedPassword = await hashPassword(payload.password)

		if (user.password !== hashedPassword) {
			return {
				error: true,
				message: 'Incorrect password',
			}
		}

		// Create a session
		const session = await useAppSession()

		// Store the user's email in the session
		await session.update({
			id: user.id,
		})
	},
)
