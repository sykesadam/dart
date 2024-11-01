import type { Config } from 'tailwindcss'

const config: Config = {
	content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			colors: {
				// Add custom colors here
			},
			spacing: {
				// Add custom spacing here
			},
		},
	},
	plugins: [],
}

export default config
