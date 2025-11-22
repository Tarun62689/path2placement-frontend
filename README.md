# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```
path2placement-frontend
├─ .env
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  ├─ vite.jpg
│  └─ viteLogo.png
├─ README.md
├─ src
│  ├─ App.css
│  ├─ App.jsx
│  ├─ assets
│  │  ├─ Loader.webp
│  │  └─ placement-hero.svg
│  ├─ components
│  │  ├─ Features.jsx
│  │  ├─ Hero1.jsx
│  │  ├─ navbar.jsx
│  │  └─ styles
│  │     ├─ Features.css
│  │     ├─ Hero1.css
│  │     └─ navbar.css
│  ├─ context
│  │  └─ AuthContext.jsx
│  ├─ index.css
│  ├─ main.jsx
│  ├─ pages
│  │  ├─ Dashboard.jsx
│  │  ├─ LandingPage.jsx
│  │  ├─ Login.jsx
│  │  ├─ Profile.jsx
│  │  ├─ Register.jsx
│  │  ├─ ResumeAnalyzer.jsx
│  │  └─ styles
│  │     ├─ Dashboard.css
│  │     ├─ LoginRegister.css
│  │     ├─ Profile.css
│  │     └─ ResumeAnalyzer.css
│  └─ services
│     └─ supabaseClient.jsx
└─ vite.config.js

```
```
path2placement-frontend
├─ .env
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  ├─ vite.jpg
│  ├─ viteLogo.png
│  └─ _redirects
├─ README.md
├─ src
│  ├─ App.css
│  ├─ App.jsx
│  ├─ assets
│  │  ├─ Loader.webp
│  │  └─ placement-hero.svg
│  ├─ components
│  │  ├─ Features.jsx
│  │  ├─ Hero1.jsx
│  │  ├─ Navbar.jsx
│  │  └─ styles
│  │     ├─ Features.css
│  │     ├─ Hero1.css
│  │     └─ Navbar.css
│  ├─ context
│  │  └─ AuthContext.jsx
│  ├─ index.css
│  ├─ main.jsx
│  ├─ pages
│  │  ├─ Dashboard.jsx
│  │  ├─ LandingPage.jsx
│  │  ├─ Login.jsx
│  │  ├─ Placement
│  │  │  ├─ Finder.jsx
│  │  │  ├─ Growth.jsx
│  │  │  ├─ Insights.jsx
│  │  │  └─ Prediction.jsx
│  │  ├─ PlacementAnalysis.jsx
│  │  ├─ Profile.jsx
│  │  ├─ Register.jsx
│  │  ├─ ResumeAnalyzer.jsx
│  │  └─ styles
│  │     ├─ Dashboard.css
│  │     ├─ LoginRegister.css
│  │     ├─ PlacementAnalysis.css
│  │     ├─ Profile.css
│  │     └─ ResumeAnalyzer.css
│  └─ services
│     └─ supabaseClient.jsx
└─ vite.config.js

```
```
path2placement-frontend
├─ .env
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  ├─ vite.jpg
│  ├─ viteLogo.png
│  └─ _redirects
├─ README.md
├─ src
│  ├─ App.css
│  ├─ App.jsx
│  ├─ assets
│  │  ├─ college-bg.jpg
│  │  ├─ Loader.webp
│  │  └─ placement-hero.svg
│  ├─ components
│  │  ├─ Features.jsx
│  │  ├─ Hero1.jsx
│  │  ├─ Navbar.jsx
│  │  └─ styles
│  │     ├─ Features.css
│  │     ├─ Hero1.css
│  │     └─ Navbar.css
│  ├─ context
│  │  └─ AuthContext.jsx
│  ├─ index.css
│  ├─ main.jsx
│  ├─ pages
│  │  ├─ Dashboard.jsx
│  │  ├─ LandingPage.jsx
│  │  ├─ Login.jsx
│  │  ├─ Placement
│  │  │  ├─ Finder.jsx
│  │  │  ├─ Growth.jsx
│  │  │  ├─ Insights.jsx
│  │  │  └─ Prediction.jsx
│  │  ├─ PlacementAnalysis.jsx
│  │  ├─ Profile.jsx
│  │  ├─ Register.jsx
│  │  ├─ ResumeAnalyzer.jsx
│  │  └─ styles
│  │     ├─ Dashboard.css
│  │     ├─ Finder.css
│  │     ├─ Insights.css
│  │     ├─ LoginRegister.css
│  │     ├─ PlacementAnalysis.css
│  │     ├─ Profile.css
│  │     └─ ResumeAnalyzer.css
│  └─ services
│     └─ supabaseClient.jsx
└─ vite.config.js

```