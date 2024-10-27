import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from '@/components/ui/sheet'
import { useDartGame } from '../store/useDartGame'
import { getRouteApi, useRouter } from '@tanstack/react-router'

const routeApi = getRouteApi('/game/_layout')

export const PlayersSheet = () => {
	const { playersSheet } = routeApi.useSearch()
	const router = useRouter()

	const players = useDartGame((state) => state.players)
	const addPlayer = useDartGame((state) => state.addPlayer)
	const removePlayer = useDartGame((state) => state.removePlayer)
	const currentPlayerScore = useDartGame((state) => state.currentPlayerScore)

	const onAddPlayer = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const formData = new FormData(e.currentTarget)
		const addPlayerName = formData.get('add-player')?.toString()

		if (!addPlayerName) {
			console.error('no value friend')
			return
		}

		const hasPlayerWithSameName = players.some(
			(player) => player.name === addPlayerName,
		)

		if (hasPlayerWithSameName) {
			console.error('Name exists')
			return
		}

		addPlayer({ name: addPlayerName })

		e.currentTarget.reset()
	}

	const onOpenChange = () => {
		router.navigate({
			to: '.',
			search: {
				playersSheet: undefined,
			},
		})
	}

	return (
		<Sheet open={playersSheet} onOpenChange={onOpenChange}>
			<SheetContent side="right">
				<SheetHeader>
					<SheetTitle>Players</SheetTitle>
					<SheetDescription>Add remove players</SheetDescription>
				</SheetHeader>
				<div className="mt-6">
					<div className="mb-4 flex flex-wrap gap-1">
						{players.map((player) => (
							<div key={player.name}>
								<Button
									variant="ghost"
									className="hover:line-through"
									onClick={() => removePlayer(player.name)}
								>
									<p>
										{player.name}, {currentPlayerScore()}
									</p>
								</Button>
							</div>
						))}
					</div>

					<form
						onSubmit={onAddPlayer}
						className="grid grid-cols-1 items-center gap-2"
					>
						<div className="flex items-center gap-2">
							<Input id="add-player" name="add-player" placeholder="Steffe" />
							<Button type="submit">Add player</Button>
						</div>
					</form>
				</div>
			</SheetContent>
		</Sheet>
	)
}
