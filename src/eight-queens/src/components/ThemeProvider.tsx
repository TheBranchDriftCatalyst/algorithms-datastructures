"use client"

import { useEffect, useState} from "react"
import { useTheme, ThemeProvider as NextThemesProvider } from "next-themes"
import {
  type AppTheme,
  type AppThemeSettingsPalette,
  createAppTheme
} from '@arwes/theme';
import { type ThemeProviderProps } from "next-themes/dist/types"
import { Button } from "./ui/button";
import React from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import Background from "./arwes/Background";
import { Global } from "@emotion/react";

//  TODO: this needs to map between the NextTheme and the ArwesTheme
// Custom color palette generator.
const createThemePalette = (hue: number): AppThemeSettingsPalette => ({
  // Darkening colors.
  main: (i: number) => [hue, 80 + i, 92.5 - i * 9.44],
  text: (i: number) => [hue, 10, 92.5 - i * 9.44],

  // Lightening colors.
  bg: (i: number) => [hue, 10, 2 + i * 2],
  ol: (i: number) => [hue, 80 + 1, 2 + i * 2],
  deco: (i: number) => [hue, 80 + 1, 50, 0.025 + i * 0.025]
});

const t: AppTheme = createAppTheme({
  settings: {
    hues: {
      primary: 160,
      secondary: 280
    },
    colors: {
      primary: createThemePalette(160),
      secondary: createThemePalette(280)
    }
  }
});

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemesProvider {...props}>
      {children}
       <Global styles={{
        html: {
          margin: t.space(2),
          lineHeight: 1.6,
          backgroundColor: t.colors.primary.ol(1)
        },
        h1: {
          ...t.typography.title(0),
          margin: t.space([0, 0, 4]),
          color: t.colors.primary.text(4),
          background: `-webkit-linear-gradient(
            0deg,
            ${t.colors.primary.main(4)},
            ${t.colors.secondary.main(4)}
          )`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        },
        hr: {
          margin: t.space([0, 0, 4]),
          border: 'none',
          height: 2,
          background: `linear-gradient(
            90deg,
            ${t.colors.primary.deco(5)},
            ${t.colors.secondary.deco(10)}
          )`
        },
        p: {
          margin: t.space([0, 0, 4]),
          ...t.typography.body(1),
          color: t.colors.primary.text(5)
        },
        img: {
          margin: 0,
          maxWidth: '100%',
          borderRadius: t.space(2)
        }
      }} />
      <Background />
    </NextThemesProvider>
  )
}

export const ThemeChanger = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return null
  }

  return (
    <Select defaultValue={theme} onValueChange={(theme) => setTheme(theme)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>
  )
}
