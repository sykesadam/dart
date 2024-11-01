import { buttonVariants } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: Home,
	meta: () => [{ title: 'Home' }],
})

function Home() {
	return (
		<>
			<div className="container py-4">
				Start screen
				<div>
					<Link to="/game" className={buttonVariants()}>
						Start a game
					</Link>
				</div>
			</div>
		</>
	)
}
