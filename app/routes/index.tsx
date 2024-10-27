import * as fs from 'fs'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import DartBoard from '@/feature/dart-game/dart-board'
import { useDartGame } from '@/feature/store/useDartGame'
import { PlayersSheet } from '@/feature/dart-game/players-sheet'
import { buttonVariants } from '@/components/ui/button'

const filePath = 'count.txt'

async function readCount() {
	return parseInt(
		await fs.promises.readFile(filePath, 'utf-8').catch(() => '0'),
	)
}

const getCount = createServerFn('GET', () => {
	return readCount()
})

const updateCount = createServerFn('POST', async (addBy: number) => {
	const count = await readCount()
	await fs.promises.writeFile(filePath, `${count + addBy}`)
})

export const Route = createFileRoute('/')({
	component: Home,
	loader: async () => await getCount(),
})

function Home() {
	return (
		<div className="container bg-amber-100 p-4">
			Start screen
			<div>
				<Link to="/game" className={buttonVariants()}>
					Start a game
				</Link>
			</div>
		</div>
	)
}
