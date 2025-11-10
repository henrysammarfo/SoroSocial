"use client"

import * as React from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

const isPreviewEnvironment = typeof window !== "undefined" && window.location.hostname.includes("vusercontent.net")

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("light")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    if (!isPreviewEnvironment) {
      try {
        const savedTheme = localStorage.getItem("theme") as Theme | null
        if (savedTheme === "light" || savedTheme === "dark") {
          setThemeState(savedTheme)
          document.documentElement.classList.toggle("dark", savedTheme === "dark")
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }, [])

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
    if (!isPreviewEnvironment) {
      try {
        localStorage.setItem("theme", newTheme)
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }, [])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
