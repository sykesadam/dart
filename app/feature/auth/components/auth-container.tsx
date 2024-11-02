import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function Auth({
	actionText,
	onSubmit,
	status,
	afterSubmit,
}: {
	actionText: string
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
	status: 'pending' | 'idle' | 'success' | 'error'
	afterSubmit?: React.ReactNode
}) {
	return (
		<div className="">
			<form
				onSubmit={(e) => {
					e.preventDefault()
					onSubmit(e)
				}}
				className="space-y-6"
			>
				<div className="grid w-full items-center gap-1.5">
					<Label htmlFor="email">Email</Label>
					<Input type="email" name="email" id="email" />
				</div>
				<div className="grid w-full items-center gap-1.5">
					<Label htmlFor="password">Password</Label>
					<Input type="password" id="password" name="password" />
				</div>
				<Button
					type="submit"
					size="lg"
					className="w-full"
					disabled={status === 'pending'}
				>
					{status === 'pending' ? '...' : actionText}
				</Button>
				{afterSubmit ? afterSubmit : null}
			</form>
		</div>
	)
}
