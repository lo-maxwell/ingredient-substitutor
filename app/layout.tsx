import { lightTheme } from "@/src/theme/mui-theme";
import { ThemeProvider } from "@mui/material";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>
      <ThemeProvider theme={lightTheme}>
        {children}
      </ThemeProvider>
      </body>
    </html>
  );
}
