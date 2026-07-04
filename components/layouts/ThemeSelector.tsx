import { ThemeKey, useHeroUIThemeStore } from "@/app/stores/heroui-theme-store";
import { Tabs } from "@heroui/react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSelector = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const activeTheme = theme === "system" ? resolvedTheme : theme;
  const handleThemeSelect = (theme: ThemeKey) => {
    setTheme(theme as string);
  };

  return (
    <div>
      <Tabs className="w-full" onSelectionChange={handleThemeSelect} selectedKey={activeTheme}>
        <Tabs.ListContainer>
          <Tabs.List aria-label="Themes selector">
            <Tabs.Tab id="light" className="grid size-8 place-items-center">
              <Sun className="size-4" />
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="dark" className="grid size-8 place-items-center">
              <Moon className="size-4" />
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
      </Tabs>
    </div>
  );
};

export default ThemeSelector;
