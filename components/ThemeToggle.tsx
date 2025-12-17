import { IconButton } from "@mui/material";
import { useTheme } from "next-themes";
import DarkModeIcon from "@mui/icons-material/DarkMode"; 
import LightModeIcon from "@mui/icons-material/LightMode";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}
