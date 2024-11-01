import { DefaultCatchBoundary } from '@/components/default-catch-boundary'
import { NotFound } from '@/components/not-found'
import globalCss from '@/tailwind.css?url'
import {
	Outlet,
	ScrollRestoration,
	createRootRouteWithContext,
} from '@tanstack/react-router'
import { Body, Head, Html, Meta, Scripts } from '@tanstack/start'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import * as React from 'react'
import { useSuspenseQuery, type QueryClient } from '@tanstack/react-query'
import { Header } from '@/components/header'
import { currentUserQueryOptions } from '@/feature/auth/current-user'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
	{
		beforeLoad: async ({ context }) => {
			await context.queryClient.ensureQueryData(currentUserQueryOptions())
		},
		meta: () => [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				title: 'TanStack Start Starter',
			},
		],

		links: () => [{ rel: 'stylesheet', href: globalCss }],
		errorComponent: (props) => {
			return (
				<RootDocument>
					<DefaultCatchBoundary {...props} />
				</RootDocument>
			)
		},
		notFoundComponent: () => <NotFound />,
		component: RootComponent,
		pendingComponent: () => {
			return (
				<RootDocument>
					<div>Loading...</div>
				</RootDocument>
			)
		},
	},
)

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	)
}

function RootDocument({ children }: { children: React.ReactNode }) {
	const { data: currentUser } = useSuspenseQuery(currentUserQueryOptions())

	return (
		<Html>
			<Head>
				<Meta />
			</Head>
			<Body>
				<Header currentUser={currentUser} />
				{children}
				<ScrollRestoration />
				<ReactQueryDevtools buttonPosition="bottom-left" />
				<TanStackRouterDevtools position="bottom-right" />
				<Scripts />
			</Body>
		</Html>
	)
}
