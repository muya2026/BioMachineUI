<div align="center">

# 🧬 BioMachineUI

**The "Thought-to-UI" Low-Code Matrix**

*An abstract, node-based visual topology generator that mimics biological neural thinking patterns to output production-ready HTML & Tailwind CSS.*

[![Live Demo](https://img.shields.io/badge/Live_Demo-muya2026.github.io/BioMachineUI-00FF88?style=for-the-badge&logo=github)](https://muya2026.github.io/BioMachineUI)
[![License: MIT](https://img.shields.io/badge/License-MIT-8B00FF?style=for-the-badge)](LICENSE)

---

</div>

## 👁️ Overview

**BioMachineUI** reinvents traditional low-code site builders. Instead of dragging static boxes onto a flat grid, you drop **organelle nodes** onto a fluid, 3D force-directed canvas. Connecting these nodes fires glowing biological data impulses that dynamically compile your visual topology into clean, production-ready **Tailwind CSS** components in real time.

```
+-------------------+        Impulse Flow        +-----------------------+
|   Receptor Node   |  =======================>  |  Compiled Tailwind    |
| (Form / Input UI) |  [ Glowing SVG Signal ]   |     Component         |
+-------------------+                            +-----------------------+
```

---

## ✨ Key Features

* 🧬 **Fluid Organelle Canvas:** Built on `3d-force-graph`, nodes drift, bounce, and float like living cells suspended in fluid.
* ⚡ **Biometric Calibration:** Introductory neural interface scan with webcam eye-tracking options via `WebGazer.js`.
* 🔊 **Fluid Audio Engine:** Procedural UI audio powered by `Tone.js` featuring ambient sub-drones and micro-static hover responses.
* ⚡ **Live Tailwind Compiler:** Split-screen live updates compiling visual topology directly into clean, un-bloated HTML/Tailwind CSS.
* 🧪 **Dark Cybernetic Aesthetic:** Bioluminescent glowing paths, custom dark theme, and neon matrix feedback.

---

## 🛠️ Tech Stack & Libraries

| Domain | Library / Technology |
| :--- | :--- |
| **Framework** | [React](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Spatial Canvas** | [3d-force-graph](https://github.com/vasturiano/3d-force-graph) (Three.js) |
| **Audio Engine** | [Tone.js](https://tonejs.github.io/) |
| **Eye-Tracking** | [WebGazer.js](https://webgazer.cs.brown.edu/) |
| **Code Editor** | [Monaco Editor](https://microsoft.github.io/monaco-editor/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Deployment** | [GitHub Pages](https://pages.github.com/) via GitHub Actions |

---

## 🚀 Quick Start (Local Development)

```bash
# Clone repository
git clone https://github.com/muya2026/BioMachineUI.git

# Navigate into project folder
cd BioMachineUI

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

---

## 📁 Project Structure

```
BioMachineUI/
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages deployment workflow
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── BiometricIntro.tsx   # Calibration intro screen
│   │   ├── BioCanvas.tsx        # 3D force graph canvas
│   │   ├── CodeCompiler.tsx     # Monaco editor + preview
│   │   └── OrganellePalette.tsx # Node type selector
│   ├── utils/
│   │   ├── compiler.ts          # Graph-to-HTML compiler
│   │   └── soundEngine.ts       # Tone.js audio engine
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles + Tailwind
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript config
└── vite.config.ts               # Vite config (base: './')
```

---

## 🧬 Node Types (Organelles)

| Node Type | Icon | Purpose | Output |
|-----------|------|---------|--------|
| **Nucleus** | 🧬 | Global theme/state root | Wrapper div with theme classes |
| **Membrane** | 📦 | Container/Flexbox wrapper | Flex/Grid layout containers |
| **Receptor** | ⬜ | Forms & inputs | Input fields, textareas |
| **Synapse** | ⚡ | State triggers/actions | Buttons, interactive elements |

---

## 🔊 Audio Feedback System

The integrated `Tone.js` sound engine provides procedural audio feedback:

- **Ambient Drone:** Low-frequency background atmosphere (C2 sine wave)
- **Hover Clicks:** Micro-static electronic clicks on interactions
- **Success Pulse:** Ascending arpeggio on successful compilation
- **Error Sound:** Descending tones on validation failures

*Note: Audio initializes on first user interaction after calibration.*

---

## 🎨 Custom Tailwind Theme

BioMachineUI includes a custom bioluminescent color palette:

```javascript
colors: {
  'bio-green': '#00FF88',   // Primary accent
  'bio-violet': '#8B00FF',  // Secondary accent
  'bio-cyan': '#00FFFF',    // Tertiary highlight
  'bio-dark': '#0A0A0F',    // Main background
  'bio-darker': '#050508',  // Deep background
}
```

---

## 🌐 Deployment to GitHub Pages

This project is configured for automatic deployment via GitHub Actions:

1. Push code to the `main` branch
2. GitHub Actions builds the project with Vite
3. Static files are deployed to GitHub Pages
4. Access at: `https://muya2026.github.io/BioMachineUI`

### Manual Deployment

```bash
# Build production bundle
npm run build

# Preview locally
npm run preview

# Deploy dist/ folder to GitHub Pages
# (Configure gh-pages or use GitHub Actions)
```

---

## 👥 Credits & Authors

Created with ❤️ by:

- **Muya** — [@muya2026](https://github.com/muya2026)
- **Somser** — [@soms3r](https://github.com/soms3r)

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

---

<div align="center">

**BioMachineUI** v1.0.0 | Neural Interface Active

</div>
