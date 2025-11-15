# Setup NativeWind v2 for Expo Router

## 1. Install dependencies
```bash
npm install nativewind@^2.0.11 tailwindcss@^3.3.0
```

## 2. Update babel.config.js
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["nativewind/babel"],
  };
};
```

## 3. Update tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 4. Create/Update global.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 5. Import global.css in app/_layout.tsx
```typescript
import "../global.css"
```

## 6. Restart Expo
```bash
npx expo start --clear
```

After this, you can use className props again!
