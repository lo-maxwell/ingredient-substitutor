import { lightTheme } from "@/src/theme/mui-theme";
import { ThemeProvider } from "@mui/material";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Baking Ingredient Substitution Engine",
    template: "%s | Baking Ingredient Substitution Engine",
  },
  description: "Find ingredient substitutions and baking effects.",
  openGraph: {
    title: "Baking Ingredient Substitution Engine",
    description: "Smart ingredient substitutions for baking recipes",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" src="/schema/website.json" />
      </head>
      <body>
        <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
