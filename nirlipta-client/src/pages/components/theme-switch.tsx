import { useTheme } from './theme-provider';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function ThemeSwitch() {
    const { theme, setTheme } = useTheme();

    return (
        <label className="flex cursor-pointer gap-2">
            <IconSun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                className="toggle theme-controller"
            />
            <IconMoon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </label>
    );
}
