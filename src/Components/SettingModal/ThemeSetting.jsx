import React from "react";
import { useTheme } from "../../themeContext";


const ThemeSetting = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="theme-setting-modal">
            <h2>Theme Settings</h2>
            <div className="theme-toggle">
                <span>Current Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                <button onClick={toggleTheme}>
                    Switch to {theme === "light" ? "Dark" : "Light"} Mode
                </button>
            </div>
        </div>
    );
};

export default ThemeSetting;
