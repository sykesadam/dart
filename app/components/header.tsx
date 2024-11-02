import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from './ui/navigation-menu'
import { CurrentUser } from '@/feature/auth/current-user'
import { Link } from '@tanstack/react-router'
import { buttonVariants } from './ui/button'
import { LoginButton } from './login-button'

export function Header({ currentUser }: { currentUser: CurrentUser }) {
	return (
		<header className="border-b">
			<div className="container flex h-16 items-center gap-4">
				<div className="flex flex-1 items-center">
					<Link to="/">
						<div className="font-bold text-xl">Logo</div>
					</Link>
				</div>

				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuLink to="/game">Start game</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>

				{currentUser ? (
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Avatar>
								<AvatarImage
									src="https://github.com/shadcn.png"
									alt="@shadcn"
								/>
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem asChild>
								<Link to="/">Profile</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link to="/logout">Logout</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<div className="flex gap-2">
						<LoginButton className={buttonVariants({ variant: 'default' })}>
							Login
						</LoginButton>
						<Link
							to="/signup"
							className={buttonVariants({ variant: 'outline' })}
						>
							Signup
						</Link>
					</div>
				)}
			</div>
		</header>
	)
}
