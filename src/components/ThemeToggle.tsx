
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useAppContext();

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full"
      onClick={toggleDarkMode}
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-yellow-300" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};

export default ThemeToggle;
