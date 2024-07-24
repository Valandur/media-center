import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: ['Chakra Petch', defaultTheme.fontFamily.sans]
		},
		colors: {
			primary: 'rgb(255, 255, 255)',
			secondary: 'rgb(121, 142, 152)',
			accent: 'rgb(243, 79, 160)',
			success: 'rgb(20, 137, 34)',
			info: 'rgb(0, 155, 227)',
			error: 'rgb(224, 0, 0)',
			warning: 'rgb(255, 159, 12)',
			dark: 'rgb(29, 40, 53)'
		}
	},
	plugins: []
};
