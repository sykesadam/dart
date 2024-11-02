import { buttonVariants } from '@/components/ui/button'
import { currentUserQueryOptions } from '@/feature/auth/current-user'
import DartBoard from '@/feature/dart-game/dart-board'
import { useDartStore } from '@/feature/store/useDartStore'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

const GamePage = () => {
	const { data: currentUser } = useSuspenseQuery(currentUserQueryOptions())

	console.log(currentUser)

	const game = useDartStore()

	if (currentUser && !game.currentPlayer()) {
		game.addPlayer({ name: currentUser.email })

		return <DartBoard />
	}

	if (!game.currentPlayer()) {
		return (
			<div className="w-full max-w-2xl mx-auto relative">
				<p>You need to add atleast one player.</p>
				<Link
					className={buttonVariants()}
					to="."
					search={{
						playersSheet: true,
					}}
				>
					Add players
				</Link>
			</div>
		)
	}

	return <DartBoard />
}

export const Route = createFileRoute('/game/_layout/')({
	component: GamePage,
	ssr: false, // Perhaps I can use route loader to avoid flash somehow?
})
