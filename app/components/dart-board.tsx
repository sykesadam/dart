import { createDartGame } from '@/calculate-solution'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from './ui/sheet'
import { useOfflineDartGame } from './useOfflineDartGame'

type SectionType = 'single' | 'double' | 'triple'
type HoveredSection =
	| `${SectionType}-${number}`
	| 'doublebull'
	| 'bullseye'
	| 'miss'
	| null

interface GenerateSectionParams {
	innerRadius: number
	outerRadius: number
	type: SectionType
	onMouseEnter: (sectionId: HoveredSection) => void
	onMouseLeave: () => void
}

const numbers = [
	20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
] as const

const generateNumbers = () => {
	return numbers.map((number, i) => {
		const angle = ((90 - 18 * i) * Math.PI) / 180
		const radius = 220
		const x = 250 + radius * Math.cos(angle)
		const y = 250 - radius * Math.sin(angle)

		return (
			<g key={`number-${number}`}>
				<text
					id={`number-${number}`}
					x={x}
					y={y}
					textAnchor="middle"
					dominantBaseline="middle"
					className="pointer-events-none text-2xl fill-white font-bold"
				>
					{number}
				</text>
			</g>
		)
	})
}

const generateSections = ({
	innerRadius,
	outerRadius,
	type,
	onMouseEnter,
	onMouseLeave,
}: GenerateSectionParams) => {
	return numbers.map((number, i) => {
		const angle = 99 - 18 * i
		const startAngle = (angle * Math.PI) / 180
		const endAngle = ((angle - 18) * Math.PI) / 180

		const startOuterX = 250 + outerRadius * Math.cos(startAngle)
		const startOuterY = 250 - outerRadius * Math.sin(startAngle)
		const endOuterX = 250 + outerRadius * Math.cos(endAngle)
		const endOuterY = 250 - outerRadius * Math.sin(endAngle)

		const startInnerX = 250 + innerRadius * Math.cos(startAngle)
		const startInnerY = 250 - innerRadius * Math.sin(startAngle)
		const endInnerX = 250 + innerRadius * Math.cos(endAngle)
		const endInnerY = 250 - innerRadius * Math.sin(endAngle)

		const largeArcFlag = 0

		const d = `
        M ${startInnerX} ${startInnerY}
        L ${startOuterX} ${startOuterY}
        A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuterX} ${endOuterY}
        L ${endInnerX} ${endInnerY}
        A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInnerX} ${startInnerY}
        Z
      `

		const sectionId = `${type}-${number}` as const

		return (
			<path
				key={sectionId}
				id={sectionId}
				data-point={sectionId}
				d={d}
				className={cn(
					'stroke-[0.5] cursor-pointer stroke-gray-50 hover:fill-pink-600',
					type === 'single'
						? i % 2 === 0
							? 'fill-neutral-900'
							: 'fill-orange-300'
						: '',
					type === 'double' || type === 'triple'
						? i % 2 === 0
							? 'fill-red-600'
							: 'fill-emerald-700'
						: '',
				)}
				onMouseEnter={() => onMouseEnter(sectionId)}
				onMouseLeave={onMouseLeave}
			/>
		)
	})
}

const Bullseye = ({
	className,
	id,
	...props
}: Omit<React.SVGProps<SVGCircleElement>, 'id'> & {
	id: 'doublebull' | 'bullseye'
}) => {
	const radius = id === 'doublebull' ? 15 : 6

	return (
		<circle
			id={id}
			cx={250}
			cy={250}
			r={radius}
			{...props}
			className={cn(
				'stroke-[0.5] cursor-pointer stroke-gray-50 hover:fill-pink-600 hover:stroke-pink-600',
				id === 'doublebull' ? 'fill-emerald-700' : 'fill-red-600',
				className,
			)}
		/>
	)
}

const getDartPoint = (point: string) => {
	if (point.includes('-')) {
		const [type, pointsString] = point.split('-')
		const points = Number(pointsString)

		if (type === 'triple') {
			return points * 3
		}

		if (type === 'double') {
			return points * 2
		}

		// Single
		return points
	}

	if (point === 'bullseye') {
		return 50
	}

	if (point === 'doublebull') {
		return 25
	}

	// miss
	return 0
}

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

const startingPoints = 120
const dartGame = createDartGame()
const dartsPerRound = 3

const DartBoard = () => {
	const [hoveredSection, setHoveredSection] = useState<HoveredSection>(null)
	const [darts, setDarts] = useState<
		{ x: number; y: number; type: SectionType; points: number }[]
	>([])
	const roundScore = darts.reduce((acc, curr) => {
		return acc + curr.points
	}, 0)

	const d = useOfflineDartGame()
	console.log('query', d.query)

	const [game, setGame] = useState<Game>({
		players: [{ name: 'Adam' }, { name: 'Lukas' }],
		currentRound: 0,
		currentPlayerIndex: 0,
		rounds: [],
	})
	const currentPlayer = d.data?.players[game.currentPlayerIndex]

	const getTotalScore = (name: string) => {
		const latestScore = game.rounds
			.map((round) =>
				round.overview.players.find((player) => player.name === name),
			)
			.reverse()
			.filter(Boolean)

		console.log('latestScore', latestScore)

		return latestScore[0]?.score ?? startingPoints
	}

	const remainingDarts = dartsPerRound - darts.length

	const dartsLeftContent =
		darts.length >= 1
			? dartGame.getWinningThrows(startingPoints - roundScore, remainingDarts)
			: null

	const handleClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
		e.preventDefault()

		if (darts.length === 3) {
			console.log('no more darts friend')
			return
		}

		const svgTarget = e.currentTarget as SVGElement
		const target = e.target as HTMLElement

		if (!svgTarget) {
			console.error('No svg found')
			return
		}

		const dataPoint = target.getAttribute('data-point')

		if (dataPoint) {
			const pt = DOMPoint.fromPoint(svgTarget)

			pt.x = e.clientX
			pt.y = e.clientY

			const { x, y } = pt.matrixTransform(svgTarget.getScreenCTM().inverse())

			const points = getDartPoint(dataPoint)

			setDarts((prev) => [
				...prev,
				{ x, y, type: dataPoint as SectionType, points },
			])
		}
	}

	const removeDart = (x: number, y: number) => {
		setDarts((prev) => prev.filter((dart) => dart.x !== x && dart.y !== y))
	}

	const addPlayer = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		d.addPlayer()

		const formData = new FormData(e.currentTarget)
		const addPlayerName = formData.get('add-player')?.toString()

		if (!addPlayerName) {
			console.error('no value friend')
			return
		}

		const hasPlayerWithSameName = game.players.some(
			(player) => player.name === addPlayerName,
		)

		if (hasPlayerWithSameName) {
			console.error('Name exists')
			return
		}

		setGame((prev) => {
			return { ...prev, players: [...prev.players, { name: addPlayerName }] }
		})

		e.currentTarget.reset()
	}

	const removePlayer = (name: string) => {
		setGame((prev) => {
			return {
				...prev,
				players: prev.players.filter((player) => player.name !== name),
			}
		})
	}

	const addPlayerRound = (name: string, proceedToNextRound = false) => {
		const previousPlayers =
			game.rounds.find(({ round }) => round === game.currentRound)?.overview
				.players || []
		const rounds = game.rounds.filter(
			({ round }) => round !== game.currentRound,
		)
		rounds.push({
			round: game.currentRound,
			overview: {
				players: [
					...previousPlayers,
					{
						name,
						darts,
						roundScore,
						score: getTotalScore(name) - roundScore,
					},
				],
			},
		})

		setGame((prev) => ({
			...prev,
			currentPlayerIndex: proceedToNextRound ? 0 : prev.currentPlayerIndex + 1,
			currentRound: proceedToNextRound
				? prev.currentRound + 1
				: prev.currentRound,
			rounds,
		}))
	}

	const nextPlayer = (name: string) => {
		const next = game.currentPlayerIndex + 1

		if (next === game.players.length) {
			console.error('No more players')
			return
		}

		addPlayerRound(name)
		setDarts([])
	}

	const nextRound = (name: string) => {
		addPlayerRound(name, true)
		setDarts([])
	}

	return (
		<div className="w-full max-w-2xl mx-auto relative">
			<h1 className="font-bold text-2xl text-center">
				Round {game.currentRound}
			</h1>
			<h2 className="font-bold text-xl mb-6 mt-4">
				Current player: {currentPlayer.name} |{' '}
				{getTotalScore(currentPlayer.name) - roundScore} points
			</h2>
			<Sheet>
				<SheetTrigger asChild>
					<Button type="button" variant="outline">
						Players
					</Button>
				</SheetTrigger>
				<SheetContent side="right">
					<SheetHeader>
						<SheetTitle>Players</SheetTitle>
						<SheetDescription>Add remove players</SheetDescription>
					</SheetHeader>
					<div className="mt-6">
						<div className="mb-4 flex flex-wrap gap-1">
							{game.players.map((player) => (
								<div key={player.name}>
									<Button
										variant="ghost"
										className="hover:line-through"
										onClick={() => removePlayer(player.name)}
									>
										<p>
											{player.name}, {getTotalScore(player.name)}
										</p>
									</Button>
								</div>
							))}
						</div>

						<form
							onSubmit={addPlayer}
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

			<svg viewBox="0 0 500 500" id="svg" onClick={handleClick}>
				{/* Outer black ring */}
				<circle
					id="outer-ring"
					cx="250"
					cy="250"
					r="250"
					className="fill-gray-950"
					data-point={0}
				/>
				{/* Numbers */}
				<g id="numbers">{generateNumbers()}</g>
				{/* Double ring sections */}
				<g id="double-sections">
					{generateSections({
						outerRadius: 190,
						innerRadius: 180,
						type: 'double',
						onMouseEnter: (sectionId) => setHoveredSection(sectionId),
						onMouseLeave: () => setHoveredSection(null),
					})}
				</g>
				{/* Single sections (outer) */}
				<g id="single-sections-outer">
					{generateSections({
						outerRadius: 180,
						innerRadius: 180 - 54,
						type: 'single',
						onMouseEnter: (sectionId) => setHoveredSection(sectionId),
						onMouseLeave: () => setHoveredSection(null),
					})}
				</g>
				{/* Triple ring sections */}
				<g id="triple-sections">
					{generateSections({
						outerRadius: 180 - 54,
						innerRadius: 180 - 54 - 8,
						type: 'triple',
						onMouseEnter: (sectionId) => setHoveredSection(sectionId),
						onMouseLeave: () => setHoveredSection(null),
					})}
				</g>
				{/* Single sections (inner) */}
				<g id="single-sections-inner">
					{generateSections({
						outerRadius: 180 - 54 - 8,
						innerRadius: 15,
						type: 'single',
						onMouseEnter: (sectionId) => setHoveredSection(sectionId),
						onMouseLeave: () => setHoveredSection(null),
					})}
				</g>

				<Bullseye
					id="doublebull"
					data-point="doublebull"
					onMouseEnter={() => setHoveredSection('doublebull')}
					onMouseLeave={() => setHoveredSection(null)}
				/>
				<Bullseye
					id="bullseye"
					data-point="bullseye"
					onMouseEnter={() => setHoveredSection('bullseye')}
					onMouseLeave={() => setHoveredSection(null)}
				/>

				{darts.length > 0 && (
					<g id="darts">
						{darts.map((dart, index) => (
							<circle
								key={index}
								data-type="dart"
								cx={dart.x}
								cy={dart.y}
								r="3"
								stroke="0.5"
								className="fill-white stroke-pink-600 cursor-pointer hover:fill-pink-600 hover:stroke-white"
								onClick={() => removeDart(dart.x, dart.y)}
							/>
						))}
					</g>
				)}
			</svg>

			<div className="flex gap-4 mt-8 justify-center">
				<Button
					type="button"
					onClick={() => nextPlayer(currentPlayer.name)}
					disabled={
						darts.length !== dartsPerRound ||
						game.currentPlayerIndex === game.players.length - 1
					}
				>
					Next player
				</Button>
				<Button
					type="button"
					onClick={() => nextRound(currentPlayer.name)}
					disabled={
						darts.length !== dartsPerRound ||
						game.currentPlayerIndex < game.players.length - 1
					}
				>
					Next round
				</Button>
			</div>

			{hoveredSection && (
				<div className="absolute top-4 right-4 bg-black text-white px-4 py-2 font-bold rounded-lg">
					{hoveredSection}
				</div>
			)}

			<div>
				<pre>{dartsLeftContent}</pre>
			</div>
		</div>
	)
}

export default DartBoard
