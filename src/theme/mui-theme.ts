"use client";

import { createTheme } from "@mui/material/styles";

// Warm, baking-themed light colors
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#d97706", // warm golden (like baked crust)
    },
    secondary: {
      main: "#f59e0b", // honey/orange accent
    },
    background: {
      default: "#fff8f0", // soft cream/beige background
      paper: "#fff2e8",   // slightly warmer card background
    },
    text: {
      primary: "#3e2723", // deep brown
      secondary: "#6b4c3b", // lighter brown for secondary text
    },
  },
  typography: {
    fontFamily: "Georgia, serif",
    h1: { fontSize: "2.5rem", fontWeight: 700 },
    h2: { fontSize: "2rem", fontWeight: 600 },
  },
});

// Dark mode inversion of baking colors
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#fbbf24", // bright warm accent (honey)
    },
    secondary: {
      main: "#fcd34d", // lighter warm accent
    },
    background: {
      default: "#3e2723", // dark cocoa/espresso background
      paper: "#4e342e",   // slightly lighter card background
    },
    text: {
      primary: "#fff8f0", // cream text
      secondary: "#ffd7b5", // soft warm secondary text
    },
  },
  typography: {
    fontFamily: "Georgia, serif",
    h1: { fontSize: "2.5rem", fontWeight: 700 },
    h2: { fontSize: "2rem", fontWeight: 600 },
  },
});
