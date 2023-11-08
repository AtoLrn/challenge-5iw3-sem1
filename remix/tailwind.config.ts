import type { Config } from 'tailwindcss'

export default {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			letterSpacing: {
				xl: '10px'
			},
			fontFamily: {
				title: 'Fjalla One, ui-monospace, SFMono-Regular'
			},
			borderWidth: {
				'1': '1px'
			},
			saturate: {
				red: '475%'
			},
			hueRotate: {
				red: '300deg'
			}
		},
	},
	safelist: [
		{
			pattern: /-left-(4|8|12|16|20)/, // Force the -left-x
		},
	],
	plugins: [],
} satisfies Config

