type DartThrow = {
	score: number
	description: string
}

type Solution = DartThrow[]
type Solutions = Solution[]

// Singles: 1-20
const singles = Array.from({ length: 20 }, (_, i) => i + 1)

// Doubles: 2, 4, ..., 40
const doubles = Array.from({ length: 20 }, (_, i) => (i + 1) * 2)

// Triples: 3, 6, ..., 60
const triples = Array.from({ length: 20 }, (_, i) => (i + 1) * 3)

// Bullseye (25) and Double Bullseye (50)
const bullseye = [25, 50] as const

// All possible scores from a single dart
const allPossibleScores = [...singles, ...doubles, ...triples, ...bullseye]

const isDouble = (score: number): boolean => {
	return doubles.includes(score) || score === 50 // 50 is double bull
}

const getDartDescription = (
	score: number,
	isFinal: boolean = false,
): string => {
	if (isFinal && score === 50) return 'Double Bull (50)'
	if (isFinal && doubles.includes(score)) return `Double ${score / 2}`

	if (score === 25) return 'Bull (25)'
	if (score === 50) return 'Double Bull (50)'
	if (singles.includes(score)) return `Single ${score}`
	if (doubles.includes(score)) return `Double ${score / 2}`
	if (triples.includes(score)) return `Triple ${score / 3}`
	return 'Invalid score'
}

const findSolutions = (
	targetScore: number,
	maxDarts: number = 2,
): Solutions => {
	if (targetScore <= 0) return []
	const solutions: Solutions = []

	// If we can use two darts
	if (maxDarts === 2) {
		// Try two darts - last must be a double
		for (const firstScore of allPossibleScores) {
			const remaining = targetScore - firstScore
			// Check if remaining score can be finished with a double
			if (isDouble(remaining)) {
				solutions.push([
					{
						score: firstScore,
						description: getDartDescription(firstScore),
					},
					{
						score: remaining,
						description: getDartDescription(remaining, true),
					},
				])
			}
		}
	}

	// Try one dart solution - must be a double
	if (isDouble(targetScore)) {
		console.log('I should be here right?')
		solutions.push([
			{
				score: targetScore,
				description: getDartDescription(targetScore, true),
			},
		])
	}

	// Validate all solutions end with a double
	const validSolutions = solutions.filter(
		(solution) =>
			(solution.length > 0 && isDouble(solution[solution.length - 1].score)) ||
			solution[solution.length - 1].score === 25,
	)

	return validSolutions
}

const formatSolution = (solution: Solution): string => {
	const throws = solution.map(
		(dart, index) =>
			`  Throw ${index + 1}: ${dart.description} (${dart.score} points)`,
	)
	const totalScore = solution.reduce((sum, dart) => sum + dart.score, 0)
	return [...throws, `  Total: ${totalScore}`].join('\n')
}

export const getWinningThrows = (targetScore: number, maxDarts: number = 2) => {
	const solutions = findSolutions(targetScore, maxDarts)

	if (solutions.length === 0) {
		// return `Impossible to reach ${targetScore} with ${maxDarts} dart(s) finishing on a double`
		return
	}

	const output = [
		`Target score: ${targetScore}`,
		`Found ${solutions.length} possible solution${solutions.length === 1 ? '' : 's'}:`,
		'',
		...solutions.map(
			(solution, index) =>
				`Solution ${index + 1}:\n${formatSolution(solution)}`,
		),
	]

	return output.join('\n')
}
