import type { Config } from "tailwindcss";

const config: Config = {
  mode:'jit',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',  // Asegúrate de que todos los archivos dentro de src sean observados
    './src/components/**/*.{js,ts,jsx,tsx}',  // Apunta a la carpeta donde están tus componentes
    './src/app/**/*.{js,ts,jsx,tsx}', 
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
