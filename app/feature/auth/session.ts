import { User } from 'db/schema'
import { useSession } from 'vinxi/http'

export type SessionUser = {
	id: User['id']
}

export const clientFriendlySessionUser = (user: User) => {
	return {
		id: user.id,
		email: user.email,
	}
}

export function useAppSession() {
	return useSession<SessionUser>({
		name: 'user-session',
		password: 'ChangeThisBeforeShippingToProdOrYouWillBeFired',
		maxAge: 60 * 60 * 24 * 3, // 3 days
	})
}
