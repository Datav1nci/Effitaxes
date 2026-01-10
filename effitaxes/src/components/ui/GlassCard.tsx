"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
}

export default function GlassCard({ children, className }: GlassCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl border backdrop-blur-md shadow-xl",
                // Light mode styles
                "bg-white/40 border-white/40",
                // Dark mode styles
                "dark:bg-black/30 dark:border-white/10",
                className
            )}
        >
            {children}
        </div>
    );
}
