# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Dynamic Theme System

This project includes a comprehensive dynamic theme system that allows users to:

### Features:
- **Light/Dark Mode Toggle**: Switch between light and dark themes
- **Custom Color Schemes**: Modify primary, secondary, and accent colors
- **Layout Options**: Choose between default, mini, and no-header layouts
- **Sidebar Customization**: Change sidebar background color
- **Topbar Customization**: Modify header/topbar colors
- **Predefined Themes**: Quick apply popular color schemes
- **Persistent Settings**: All theme preferences are saved to localStorage

### Usage:
1. Click the settings gear icon (⚙️) on the right side of the screen
2. Choose your preferred theme mode (Light/Dark)
3. Select from predefined themes or customize colors manually
4. Adjust layout, sidebar, and topbar colors
5. Click "Apply" to save changes

### Implementation:
- Uses React Context API for global theme state management
- CSS custom properties (variables) for dynamic styling
- Bootstrap integration with theme-aware classes
- Automatic persistence using localStorage
- Smooth transitions between theme changes

### Theme Classes:
- `.theme-card` - Theme-aware card backgrounds
- `.theme-text` - Theme-aware text colors
- `.theme-table` - Theme-aware table styling
- `.theme-border` - Theme-aware border colors
- `.theme-bg` - Theme-aware background colors

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
"# bookkeeper" 
