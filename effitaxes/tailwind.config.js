module.exports = {                                  //This is the main object that defines the Tailwind configuration
  darkMode: "class",                                //Enables dark mode, which can be toggled by adding a dark class to your HTML.
  content: ["./src/**/*.{js,ts,jsx,tsx}"], //Tells Tailwind to scan all JavaScript, TypeScript, and JSX/TSX files in the src folder (and its subfolders) to generate the necessary styles.
  theme: {                                 //Customizes the default Tailwind design system.
    extend: {                              //Adds or overrides default settings.
      fontFamily: { sans: ["var(--font-inter)", "sans-serif"] }, //Sets the default sans-serif font to "Inter" (defined as a CSS variable) with a fallback to the system's sans-serif font.
      colors: { primary: "#3B82F6" }, //Defines a custom color named primary with the hex value #3B82F6 (a shade of blue)
    },
  },
  //plugins: [require("@tailwindcss/forms")],   //This would allow adding extra Tailwind plugins, like @tailwindcss/forms for form styling, but it's currently disabled.
};


//tailwind.config.js This file configures Tailwind CSS, a popular styling tool
//This configuration is tailored for a Next.js project with TypeScript and JSX support, extending Tailwind's defaults to match your design needs. 
//The src folder alignment from your project structure fits perfectly with the content setting.