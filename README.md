# Zen Habit 🥚🐉

**Zen Habit** is a gamified habit tracker that transforms your daily self-improvement into an epic RPG adventure. Evolve your digital companion ("Zen Pet") from an egg to a mythical creature by staying consistent with your habits.

[LIVE DEMO]([URL](https://zenhabbitapp.pages.dev/))


![Zen Habit Banner](public/pwa-512x512.png)
*(Replace with actual screenshot if available)*

## ✨ Features

### Gamification Core
*   **Pet Evolution**: Your pet grows through 3 stages (Egg -> Baby -> Adult) based on your consistency.
*   **Habit Tracking**: Track boolean (Done/Not Done) or numeric (e.g., "Drinking 2L Water") habits.
*   **RPG Economy**: Earn **EP** (Evolution Points) and **Gold** for every completed task.
*   **Shop & Inventory**: Buy food, toys, and potions to manage your pet's `Hunger` and `Happiness`.
*   **Boss Battles**: Weekly raid bosses appear. Deal damage by completing habits; missing habits harms you!

### Immersive & Modern UI
*   **Atmospheric Design**: Dynamic **StarField** background and glassmorphism UI.
*   **Smooth Animations**: Powered by `Framer Motion` for staggered lists, page transitions, and floating text effects.
*   **Interactive Feedback**: Satisfying "pop" and glow effects when completing tasks.

### Mobile-First PWA (Progressive Web App)
*   **Installable**: Add to Home Screen on iOS and Android for a native app experience.
*   **Offline Ready**: Works seamlessly without an internet connection.
*   **Custom Splash Screen**: "Jumping Egg" animation while loading.

## 🛠️ Tech Stack

*   **Frontend**: React 18 (TypeScript)
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **Animations**: Framer Motion
*   **State Management**: Zustand (with Persist middleware)
*   **Backend / DB**: Firebase (Firestore & Auth)
*   **Icons**: Lucide React
*   **PWA**: `vite-plugin-pwa`

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/zen-habit.git
    cd zen-habit
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Firebase:
    *   Create a project in [Firebase Console](https://console.firebase.google.com/).
    *   Create a `web` app and get your config.
    *   Update `src/services/firebase.ts` with your credentials or use `.env` variables.

4.  Run the development server:
    ```bash
    npm run dev
    ```

### Building for Production

To create an optimized production build (including PWA asset generation):

```bash
npm run build
```

Preview the build locally:
```bash
npm run preview
```

## 📦 Deployment

### Vercel / Netlify
1.  Connect your GitHub repository.
2.  Set Build Command: `npm run build`
3.  Set Output Directory: `dist`
4.  Ensure all environment variables (Firebase config) are set in the dashboard.

### GitHub Pages
1.  Update `vite.config.ts` base URL if needed.
2.  Deploy the `dist` folder using `gh-pages` or GitHub Actions.

## 📂 Project Structure

```
src/
├── components/     # UI Components (PetDisplay, HabitList, Shop...)
├── config/         # Game Constants (XP tables, Shop Items)
├── hooks/          # Custom Hooks (usePWAInstall, useDailyReset)
├── services/       # Firebase & API Logic
├── store/          # Zustand State Management (Game Logic Core)
├── styles/         # Global CSS & Tailwind Directives
└── types/          # TypeScript Interfaces (Habit, User, Pet)
```

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ by Muzahir*

