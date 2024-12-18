/** @type {import('tailwindcss').Config} */

import tailwindcssAnimate from "tailwindcss-animate"

export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			'terminal-green': 'rgba(74, 246, 38, 1)',
  			'terminal-green-75': 'rgba(74, 246, 38, 0.75)',
  			'terminal-green-50': 'rgba(74, 246, 38, 0.5)',
  			'terminal-green-25': 'rgba(74, 246, 38, 0.25)',
  			'terminal-yellow': 'rgba(255, 176, 0, 1)',
  			'terminal-yellow-75': 'rgba(255, 176, 0, 0.75)',
  			'terminal-yellow-50': 'rgba(255, 176, 0, 0.5)',
  			'terminal-yellow-25': 'rgba(255, 176, 0, 0.25)',
  			'terminal-black': 'rgba(21, 21, 21, 1)',
			'terminal-gold': 'rgba(211, 175, 55, 1)',
			'terminal-silver': 'rgba(170, 169, 173, 1)',
			'terminal-bronze': 'rgba(169, 113, 66, 1)',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		textShadow: {
			'none': 'none',
		},
  	}
  },
  plugins: [
		function ({ addUtilities, theme }) {
		  const newUtilities = {
			".custom-range-input": {
			  "&::-webkit-slider-thumb": {
				"-webkit-appearance": "none",
				appearance: "none",
				width: "15px",
				height: "15px",
				"background-color": "rgba(74, 246, 38, 1)",
				cursor: "pointer",
			  },
			  "&::-moz-range-thumb": {
				width: "15px",
				height: "15px",
				"background-color": "rgba(74, 246, 38, 1)",
				cursor: "pointer",
			  },
			  "&::-webkit-slider-runnable-track": {
				"background-color": "rgba(0, 0, 0, 1)",
				"border-radius": "0px",
			  },
			  ".no-scrollbar": {
				/* IE and Edge */
				"-ms-overflow-style": "none",
	
				/* Firefox */
				"scrollbar-width": "none",
	
				/* Safari and Chrome */
				"&::-webkit-scrollbar": {
				  display: "none",
				},
			  },
			},
		  };
		  addUtilities(newUtilities);
		},

	tailwindcssAnimate,
  ],
}