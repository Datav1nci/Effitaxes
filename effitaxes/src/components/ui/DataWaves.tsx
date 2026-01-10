"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export default function DataWaves({ className }: { className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Use scroll for opacity fade in/out
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    // Wave definitions with different speeds
    const waves = [
        { speed: 20, delay: 0, height: 1, top: "20%", opacity: 0.1 },
        { speed: 35, delay: 1, height: 2, top: "40%", opacity: 0.15 },
        { speed: 25, delay: 4, height: 1, top: "60%", opacity: 0.08 },
        { speed: 45, delay: 2, height: 1, top: "80%", opacity: 0.12 },
        { speed: 30, delay: 5, height: 3, top: "30%", opacity: 0.05 },
    ];

    return (
        <motion.div
            ref={containerRef}
            style={{ opacity }}
            className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}
        >
            {waves.map((wave, i) => (
                <motion.div
                    key={i}
                    className="absolute left-0 right-0 bg-current"
                    style={{
                        top: wave.top,
                        height: wave.height,
                        opacity: wave.opacity
                    }}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                        duration: wave.speed,
                        repeat: Infinity,
                        ease: "linear",
                        delay: wave.delay
                    }}
                >
                    {/* Add a gradient trail to the line */}
                    <div className="w-full h-full bg-gradient-to-r from-transparent via-current to-transparent opacity-50" />
                </motion.div>
            ))}
        </motion.div>
    );
}
