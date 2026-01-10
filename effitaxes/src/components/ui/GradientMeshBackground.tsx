"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function GradientMeshBackground({ className }: { className?: string }) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === "dark";

    // Blob configurations
    // We use different colors/opacity based on theme
    const blobs = [
        {
            color: isDark ? "bg-purple-900" : "bg-purple-200",
            initial: { x: -100, y: -100, scale: 1 },
            animate: {
                x: [0, 100, 0],
                y: [0, 50, 0],
                scale: [1, 1.2, 1],
            },
            transition: { duration: 20, repeat: Infinity, ease: "linear" as const },
            className: "top-0 left-0 w-[500px] h-[500px] opacity-30 blur-[100px]",
        },
        {
            color: isDark ? "bg-blue-900" : "bg-blue-200",
            initial: { x: 100, y: 100, scale: 1 },
            animate: {
                x: [0, -70, 0],
                y: [0, -100, 0],
                scale: [1, 1.3, 1],
            },
            transition: { duration: 25, repeat: Infinity, ease: "linear" as const, delay: 2 },
            className: "bottom-0 right-0 w-[600px] h-[600px] opacity-30 blur-[120px]",
        },
        {
            color: isDark ? "bg-indigo-900" : "bg-indigo-200",
            initial: { x: 0, y: 0, scale: 1 },
            animate: {
                x: [0, 50, -50, 0],
                y: [0, -50, 50, 0],
            },
            transition: { duration: 30, repeat: Infinity, ease: "linear" as const, delay: 5 },
            className: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 blur-[150px]",
        },
    ];

    return (
        <div className={cn("absolute inset-0 overflow-hidden pointer-events-none -z-10", className)}>
            <div className={cn("absolute inset-0", isDark ? "bg-black" : "bg-gray-50")} />

            {blobs.map((blob, i) => (
                <motion.div
                    key={i}
                    className={cn("absolute rounded-full", blob.color, blob.className)}
                    initial={blob.initial}
                    animate={blob.animate}
                    transition={blob.transition}
                />
            ))}

            {/* Noise texture overlay for texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
        </div>
    );
}
