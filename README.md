# snipsnop-r

A podcast search and player application built with modern React.

## Modern React Updates Applied

This project has been modernized to use current React best practices:

### Dependencies Updated
- React: 15.6.1 → 18.2.0
- React DOM: 15.6.1 → 18.2.0  
- React Router DOM: 4.1.2 → 6.14.0
- Added proper browserslist configuration

### Component Modernization
- Converted all class components to functional components with hooks
- Replaced constructor state with `useState` hooks
- Replaced `componentDidMount` with `useEffect` hooks
- Used proper destructuring for props instead of copying to state

### Router Updates
- Updated from Router v4 to v6 patterns
- Replaced `Switch` with `Routes`
- Updated route definitions to use `element` prop
- Updated navigation to use modern `state` prop instead of deprecated patterns

### Other Improvements
- Replaced deprecated `render` with `createRoot` from React 18
- Improved async/await patterns for API calls
- Added proper error handling
- Cleaned up unused imports and variables
- Added alt attributes to images for accessibility
- Organized project structure with proper `src/` and `public/` directories

## Getting Started

```bash
npm install
npm start
```
