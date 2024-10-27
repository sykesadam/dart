import { createDartGame } from '@/calculate-solution'
import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query'

type SectionType = 'single' | 'double' | 'triple'

const startingPoints = 120
const dartGame = createDartGame()
const dartsPerRound = 3

type Game = {
	players: { name: string }[]
	currentRound: number
	currentPlayerIndex: number
	rounds: {
		round: number
		overview: {
			players: {
				name: string
				roundScore: number
				score: number
				darts: { x: number; y: number; type: SectionType; points: number }[]
			}[]
		}
	}[]
}

// const [game, setGame] = useState<Game>({
// 	players: [{ name: 'Adam' }, { name: 'Lukas' }],
// 	currentRound: 0,
// 	currentPlayerIndex: 0,
// 	rounds: [],
// })

const starterGameState = async (): Promise<Game> => {
	return {
		players: [{ name: 'Adam' }, { name: 'Lukas' }],
		currentRound: 0,
		currentPlayerIndex: 0,
		rounds: [],
	}
}

export const useOfflineDartGame = () => {
	const queryClient = useQueryClient()
	const dartOptions = queryOptions({
		queryKey: ['dart', 'offline'],
		queryFn: () => starterGameState(),
		refetchOnReconnect: false,
		refetchOnWindowFocus: false,
		retry: 1,
	})
	const query = useQuery(dartOptions)

	const addPlayer = () => {
		queryClient.setQueryData(dartOptions.queryKey, (prev) => {
			return {
				players: [
					...(prev?.players || []),
					{
						name: 'johan',
					},
				],
				currentPlayerIndex: prev?.currentPlayerIndex || 0,
				currentRound: prev?.currentRound || 0,
				rounds: prev?.rounds || [],
			}
		})
	}

	return {
		query,
		addPlayer,
	}
}
