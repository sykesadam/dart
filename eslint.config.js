import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import pluginRouter from '@tanstack/eslint-plugin-router'

export default [
	{ files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	...pluginRouter.configs['flat/recommended'],
	{
		rules: {
			'react/react-in-jsx-scope': 'off',
		},
	},
]
