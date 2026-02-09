
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        if (theme === 'dark' || theme === 'system') {
            setTheme('light')
        } else {
            setTheme('dark')
        }
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="bg-transparent border-border backdrop-blur-md hover:bg-accent hover:text-accent-foreground cursor-pointer"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
