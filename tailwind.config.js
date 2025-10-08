/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de marca personalizada
        brand: {
          // Azul oscuro principal para fondos
          dark: '#0a1128',
          'dark-50': '#f2f3f5',
          'dark-100': '#e5e7eb',
          'dark-200': '#bdc3d1',
          'dark-300': '#7d89a8',
          'dark-400': '#3d4d6f',
          'dark-500': '#0a1128', // ← COLOR BASE OSCURO
          'dark-600': '#080d1f',
          'dark-700': '#060a17',
          'dark-800': '#04060f',
          'dark-900': '#020308',
          
          // Azul vibrante para contraste
          contrast: '#1282a2',
          'contrast-50': '#f0f9fb',
          'contrast-100': '#d9f0f5',
          'contrast-200': '#a8dce8',
          'contrast-300': '#70c4d8',
          'contrast-400': '#3ea3c3',
          'contrast-500': '#1282a2', // ← COLOR DE CONTRASTE
          'contrast-600': '#0f6982',
          'contrast-700': '#0c5066',
          'contrast-800': '#083749',
          'contrast-900': '#051e2d',
          
          // Color claro para textos y fondos claros
          light: '#fefcfb',
          'light-50': '#fefcfb',  // ← COLOR CLARO BASE
          'light-100': '#fdf9f7',
          'light-200': '#faf5f0',
          'light-300': '#f5ede5',
          'light-400': '#efe3d7',
          'light-500': '#e8d7c7',
          'light-600': '#d4b89f',
          'light-700': '#b99277',
          'light-800': '#976e54',
          'light-900': '#6d4d3c',
          
          // Azul para botones primarios
          button: '#001f54',
          'button-50': '#e6eaf3',
          'button-100': '#ccd5e7',
          'button-200': '#99aacf',
          'button-300': '#667fb7',
          'button-400': '#33559f',
          'button-500': '#001f54', // ← AZUL BOTONES
          'button-600': '#001944',
          'button-700': '#001333',
          'button-800': '#000d22',
          'button-900': '#000611',
          
          // Azul alternativo
          alt: '#034078',
          'alt-50': '#e6eef5',
          'alt-100': '#ccdceb',
          'alt-200': '#99bad6',
          'alt-300': '#6697c2',
          'alt-400': '#3375ad',
          'alt-500': '#034078', // ← AZUL ALTERNATIVO
          'alt-600': '#033360',
          'alt-700': '#022648',
          'alt-800': '#021930',
          'alt-900': '#010d18',
        },
      },
    },
  },
  plugins: [],
}
