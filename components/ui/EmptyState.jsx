import React from "react";
import { cn } from "@/lib/utils";

/**
 * Reusable empty state block used across dashboards, lists, tables and
 * search results whenever there is no data to display.
 *
 * @param {React.ComponentType} icon - icon component (e.g. from react-icons/lucide-react)
 * @param {string} title - short heading, e.g. "No Projects Found"
 * @param {string} description - optional supporting copy
 * @param {{label: string, onClick?: Function, icon?: React.ComponentType}} action - optional CTA button
 * @param {string} size - "sm" | "md" | "lg" controls icon/text sizing for compact vs full page states
 */
const sizeMap = {
    sm: {
        wrapper: "gap-2 py-4",
        iconBox: "p-3",
        iconSize: 16,
        title: "text-sm font-semibold",
        description: "text-xs",
    },
    md: {
        wrapper: "gap-3 py-8",
        iconBox: "p-4",
        iconSize: 22,
        title: "text-lg font-bold",
        description: "text-sm",
    },
    lg: {
        wrapper: "gap-4 py-12",
        iconBox: "p-6",
        iconSize: 32,
        title: "text-2xl font-bold",
        description: "text-base",
    },
};

const EmptyState = ({
    icon: Icon,
    title = "Nothing to show",
    description,
    action,
    size = "md",
    className,
    iconClassName,
}) => {
    const s = sizeMap[size] || sizeMap.md;

    return (
        <div
            className={cn(
                "w-full h-full flex flex-col items-center justify-center text-center px-4",
                s.wrapper,
                className,
            )}
        >
            {Icon && (
                <div
                    className={cn(
                        "rounded-2xl bg-gray-100 border border-gray-200 shadow-sm flex items-center justify-center text-gray-400",
                        s.iconBox,
                        iconClassName,
                    )}
                >
                    <Icon size={s.iconSize} className="shrink-0" />
                </div>
            )}
            <div className={cn("text-gray-600", s.title)}>{title}</div>
            {description && (
                <div
                    className={cn(
                        "text-gray-400 font-medium max-w-md",
                        s.description,
                    )}
                >
                    {description}
                </div>
            )}
            {action && (
                <button
                    type="button"
                    onClick={action.onClick}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-sm font-semibold shadow-sm hover:bg-zinc-800 transition-all duration-300"
                >
                    {action.icon && <action.icon size={16} className="shrink-0" />}
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
