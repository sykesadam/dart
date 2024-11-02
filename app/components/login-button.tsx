import { Link, useRouterState } from '@tanstack/react-router'
import * as React from 'react'

export function LoginButton({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) {
	const routerState = useRouterState()
	const redirect =
		routerState.location.pathname !== '/login'
			? routerState.location.pathname
			: '/'

	return (
		<Link
			to="/login"
			search={{
				redirect,
			}}
			className={className}
		>
			{children}
		</Link>
	)
}
