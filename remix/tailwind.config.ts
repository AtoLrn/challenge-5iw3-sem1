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
		{
			pattern: /col-span-(1|2|3|4|5|6|7)/, // Force the col-span-x
		},
		{
			pattern: /col-start-(1|2|3|4|5|6|7)/, // Force the col-start-x
		},
	],
	plugins: [],
} satisfies Config

