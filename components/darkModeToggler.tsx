'use client'

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export const DarkModeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-yellow-500 dark:text-gray-400" />
            <Switch
                checked={theme === "dark"}
                onCheckedChange={(isDark) => setTheme(isDark ? "dark" : "light")}
            />
            <Moon className="w-5 h-5 text-gray-500 dark:text-white" />
        </div>
    );
};
