import { buttonVariants } from '@/components/ui/button'
import { currentUser } from '@/feature/auth/actions'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: Home,
	loader: async () => currentUser(),
})

function Home() {
	const user = Route.useLoaderData()

	console.log(user)

	return (
		<div className="container bg-amber-100 p-4">
			Start screen
			<div className="my-8">
				{user ? (
					<>
						<span className="mr-2">{user.email}</span>
						<Link
							to="/logout"
							className={buttonVariants({ variant: 'secondary' })}
						>
							Logout
						</Link>
					</>
				) : (
					<Link
						to="/login"
						className={buttonVariants({ variant: 'secondary' })}
					>
						Login
					</Link>
				)}
			</div>
			<div>
				<Link to="/game" className={buttonVariants()}>
					Start a game
				</Link>
			</div>
		</div>
	)
}
