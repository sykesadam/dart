import { Login } from '@/feature/auth/components/login'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
	component: LoginPage,
})

function LoginPage() {
	return <Login />
}
