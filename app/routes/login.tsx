import { Login } from '@/feature/auth/components/login'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const loginSearchSchema = z.object({
	redirect: z.string().catch(''),
})

export const Route = createFileRoute('/login')({
	component: LoginPage,
	validateSearch: (search) => loginSearchSchema.parse(search),
})

function LoginPage() {
	return (
		<div className="max-w-sm mx-auto px-6 py-24">
			<h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
			<Login />
		</div>
	)
}
