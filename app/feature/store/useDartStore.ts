import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import { SectionType } from '../types'

const defaultPointsToWin = 120
// const dartGame = createDartGame()
// const dartsPerRound = 3

interface PlayersSlice {
	players: { name: string }[]
	currentPlayerIndex: number
	nextPlayer: () => void
	currentPlayer: () => PlayersSlice['players'][number]
	currentPlayerScore: () => number
	addPlayer: ({ name }: { name: string }) => void
	removePlayer: (name: string) => void
	resetPlayers: () => void
}

interface PlayerRound {
	name: string
	roundScore: number
	score: number
	darts: { x: number; y: number; type: SectionType; points: number }[]
}

interface Dart {
	x: number
	y: number
	type: SectionType
	points: number
}

interface RoundsSlice {
	currentRound: number
	darts: Dart[]
	dartsPerRound: number
	pointsToWin: number
	saveDart: (dart: Dart) => void
	removeDart: (x: number, y: number) => void
	currentPlayerRoundScore: number
	rounds: {
		round: number
		overview: {
			players: PlayerRound[]
		}
	}[]
	nextRound: () => void
	savePlayerRound: () => void
	resetGame: () => void
}

const createPlayersSlice: StateCreator<
	PlayersSlice & RoundsSlice,
	[],
	[],
	PlayersSlice
> = (set, get) => ({
	players: [],
	currentPlayerIndex: 0,
	nextPlayer: () => {
		set((state) => ({
			currentPlayerIndex: state.currentPlayerIndex + 1,
			darts: [],
			currentPlayerRoundScore: 0,
		}))
	},
	currentPlayer: () => get().players[get().currentPlayerIndex],
	currentPlayerScore: () => {
		const rounds = get().rounds
		const currentPlayer = get().currentPlayer()
		const latestScore = rounds
			.map((round) =>
				round.overview.players.find(
					(player) => player.name === currentPlayer.name,
				),
			)
			.filter(Boolean)

		return latestScore[latestScore.length - 1]?.score ?? get().pointsToWin
	},
	addPlayer: (newPlayer) => {
		set((state) => ({ players: [...state.players, newPlayer] }))
	},
	removePlayer: (name) =>
		set((state) => ({
			players: state.players.filter((player) => player.name !== name),
		})),
	resetPlayers: () => set(() => ({ players: [], currentPlayerIndex: 0 })),
})

const createRoundSlice: StateCreator<
	RoundsSlice & PlayersSlice,
	[],
	[],
	RoundsSlice
> = (set, get) => ({
	currentRound: 0,
	rounds: [
		{
			round: 0,
			overview: {
				players: [],
			},
		},
	],
	dartsPerRound: 3,
	pointsToWin: defaultPointsToWin,
	currentPlayerRoundScore: 0,
	darts: [],
	saveDart: (dart) =>
		set((state) => {
			if (state.darts.length === state.dartsPerRound) return state
			const darts = [...state.darts, dart]
			const currentPlayerRoundScore = darts.reduce((prev, acc) => {
				return prev + acc.points
			}, 0)
			return { darts: [...state.darts, dart], currentPlayerRoundScore }
		}),
	removeDart: (x: number, y: number) => {
		set((state) => ({
			darts: state.darts.filter((dart) => dart.x !== x && dart.y !== y),
		}))
	},
	savePlayerRound: () => {
		const rounds = get().rounds.filter(
			({ round }) => round !== get().currentRound,
		)
		const previousPlayers =
			get().rounds.find(({ round }) => round === get().currentRound)?.overview
				.players ?? []

		rounds.push({
			round: get().currentRound,
			overview: {
				players: [
					...previousPlayers,
					{
						darts: get().darts,
						name: get().currentPlayer().name,
						roundScore: get().currentPlayerRoundScore,
						score: get().currentPlayerScore() - get().currentPlayerRoundScore,
					},
				],
			},
		})

		set(() => ({ rounds }))
	},
	nextRound: () => {
		set((state) => ({
			currentRound: state.currentRound + 1,
			currentPlayerIndex: 0,
			darts: [],
			currentPlayerRoundScore: 0,
		}))
	},
	resetGame: () => {
		set(() => ({
			currentPlayerIndex: 0,
			currentRound: 0,
			currentPlayerRoundScore: 0,
			rounds: [],
			darts: [],
		}))
	},
})

export const useDartStore = create<PlayersSlice & RoundsSlice>()(
	persist(
		(...a) => ({
			...createPlayersSlice(...a),
			...createRoundSlice(...a),
		}),
		{ name: 'dart-game' },
	),
)
