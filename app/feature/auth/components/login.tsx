import { Button } from '@/components/ui/button'
// import { useMutation } from '@/hooks/useMutation'
import { signupFn } from '@/routes/signup'
import { useRouter, useSearch } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/start'
import { loginFn } from '../utils'
import { Auth } from './auth-container'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function Login() {
	const queryClient = useQueryClient()
	const router = useRouter()
	const search = useSearch({
		from: '/login',
	})

	const loginMutation = useMutation({
		mutationFn: loginFn,
		onSuccess: async (data) => {
			if (!data?.error) {
				await queryClient.invalidateQueries()
				router.navigate({ to: search.redirect })
				return
			}
		},
	})

	const signupMutation = useMutation({
		mutationFn: signupFn,
		onSuccess: async (data) => {
			if (!data?.error) {
				await queryClient.invalidateQueries()
				router.navigate({ to: search.redirect })
				return
			}
		},
	})

	return (
		<Auth
			actionText="Login"
			status={loginMutation.status}
			onSubmit={(e) => {
				const formData = new FormData(e.target as HTMLFormElement)

				loginMutation.mutate({
					email: formData.get('email') as string,
					password: formData.get('password') as string,
				})
			}}
			afterSubmit={
				loginMutation.data ? (
					<>
						<div className="text-red-400">{loginMutation.data.message}</div>
						{loginMutation.data.userNotFound ? (
							<div>
								<Button
									type="button"
									onClick={(e) => {
										const formData = new FormData(
											(e.target as HTMLButtonElement).form!,
										)

										signupMutation.mutate({
											email: formData.get('email') as string,
											password: formData.get('password') as string,
										})
									}}
								>
									Sign up instead?
								</Button>
							</div>
						) : null}
					</>
				) : null
			}
		/>
	)
}
