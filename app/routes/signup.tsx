import { useAppSession } from '@/feature/auth/session'
import { hashPassword } from '@/feature/auth/utils'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/start'
import { db } from 'db'
import { usersTable } from 'db/schema'
import { eq } from 'drizzle-orm'
import { useMutation } from '@/hooks/useMutation'
import { Auth } from '@/feature/auth/components/auth-container'

export const signupFn = createServerFn(
	'POST',
	async (payload: {
		email: string
		password: string
		redirectUrl?: string
	}) => {
		const found = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, payload.email))
			.get()

		// Encrypt the password using Sha256 into plaintext
		const password = await hashPassword(payload.password)

		// Create a session
		const session = await useAppSession()

		if (found) {
			if (found.password !== password) {
				return {
					error: true,
					userExists: true,
					message: 'User already exists',
				}
			}

			// Store the user's id in the session
			await session.update({
				id: found.id,
			})

			// Redirect to the prev page stored in the "redirect" search param
			throw redirect({
				href: payload.redirectUrl || '/',
			})
		}

		// Create the user
		const user = await db
			.insert(usersTable)
			.values({ email: payload.email, password })
			.returning()
			.get()

		// Store the user's email in the session
		await session.update({
			id: user.id,
		})

		// Redirect to the prev page stored in the "redirect" search param
		throw redirect({
			href: payload.redirectUrl || '/',
		})
	},
)

export const Route = createFileRoute('/signup')({
	component: SignupPage,
})

function SignupPage() {
	const signupMutation = useMutation({
		fn: useServerFn(signupFn),
	})

	return (
		<Auth
			actionText="Sign Up"
			status={signupMutation.status}
			onSubmit={(e) => {
				const formData = new FormData(e.target as HTMLFormElement)

				signupMutation.mutate({
					email: formData.get('email') as string,
					password: formData.get('password') as string,
				})
			}}
			afterSubmit={
				signupMutation.data?.error ? (
					<>
						<div className="text-red-400">{signupMutation.data.message}</div>
					</>
				) : null
			}
		/>
	)
}
