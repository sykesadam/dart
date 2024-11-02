import { useAppSession } from '@/feature/auth/session'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'

const logoutFn = createServerFn('POST', async () => {
	const session = await useAppSession()

	session.clear()
})

export const Route = createFileRoute('/logout')({
	preload: false,
	loader: async ({ context }) => {
		await logoutFn()
		context.queryClient.invalidateQueries()

		throw redirect({
			href: '/',
		})
	},
})
