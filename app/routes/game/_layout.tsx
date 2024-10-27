import { PlayersSheet } from '@/feature/dart-game/players-sheet'
import { createFileRoute, Outlet } from '@tanstack/react-router'

const GameLayout = () => {
	return (
		<div className="container">
			<Outlet />
			<PlayersSheet />
		</div>
	)
}

type GameSearch = {
	playersSheet?: boolean
}

export const Route = createFileRoute('/game/_layout')({
	component: GameLayout,
	validateSearch: (search: Record<string, unknown>): GameSearch => {
		return {
			playersSheet: Boolean(search?.playersSheet) || undefined,
		}
	},
})
