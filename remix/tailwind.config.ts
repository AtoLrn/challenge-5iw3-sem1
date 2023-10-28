import type { Config } from 'tailwindcss'

export default {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			saturate: {
				red: '475%'
			},
			hueRotate: {
				red: '300deg'
			}
		},
	},
	plugins: [],
} satisfies Config

