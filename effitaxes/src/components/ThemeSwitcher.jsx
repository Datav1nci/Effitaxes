 "use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
    setMounted(true);
    }, []);

    if (!mounted) {
    return null; // Render nothing on the server to prevent hydration issues
    }

    return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        Toggle Theme
    </button>
    );
}