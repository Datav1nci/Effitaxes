"use client";

import { ReactNode } from "react";

export default function ServiceCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        rounded-xl p-6 transition
        bg-white text-slate-900
        shadow-sm hover:shadow-md
        dark:bg-gray-900 dark:text-gray-100
        border border-gray-200 dark:border-gray-800
      "
    >
      <div className="mb-4 text-blue-600 dark:text-blue-500">
        {icon}
      </div>

      <h3 className="mb-2 text-xl font-semibold tracking-tight" suppressHydrationWarning>
        {title}
      </h3>

      <p className="text-slate-600 dark:text-gray-300" suppressHydrationWarning>
        {description}
      </p>
    </div>
  );
}
