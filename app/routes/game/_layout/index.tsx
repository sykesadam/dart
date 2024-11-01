import { buttonVariants } from '@/components/ui/button'
import DartBoard from '@/feature/dart-game/dart-board'
import { useDartStore } from '@/feature/store/useDartStore'
import { createFileRoute, Link } from '@tanstack/react-router'

const GamePage = () => {
	const game = useDartStore()

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
