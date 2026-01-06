# Zen Habit

**Zen Habit** is a gamified habit tracking application that combines daily task completion with RPG mechanics. Users evolve a digital pet ("Zen Pet") and complete adventures by maintaining their habits.

## Project Overview

*   **Type:** Single Page Application (SPA) / Progressive Web App (PWA).
*   **Core Concept:** Completing habits rewards the user with **EP** (Evolution Points) and **Gold**. These resources are used to evolve a pet (Egg -> Baby -> Adult) and progress through time-based adventures.
*   **Security:** Key game logic (rewards, adventure progress) is designed to be validated server-side (Cloudflare Workers) to prevent client-side state manipulation.

## Technical Architecture

### Frontend
*   **Framework:** React 18 (with Vite).
*   **Language:** TypeScript.
*   **Styling:** Tailwind CSS + Framer Motion (for animations).
*   **State Management:** Zustand (`src/store/useStore.ts`).
    *   Handles `user` stats (gold, daily EP).
    *   Handles `pet` state (stage, traits).
    *   Handles `habits` list and status.
*   **Icons:** Lucide React.

### Backend (Serverless)
*   **Platform:** Cloudflare Workers (`functions/`).
*   **Entry Point:** `functions/index.ts`.
*   **Configuration:** `functions/wrangler.jsonc`.
*   **Role:** Verifies habit completion, calculates rewards securely, and manages adventure timers.
*   **Status:** Currently a skeleton/stub implementation.

### Data & Auth
*   **Service:** Firebase (Firestore & Auth).
*   **Configuration:** `src/services/firebase.ts` (Requires valid credentials).
*   **Security Rules:** `firestore/rules.txt`.

## Getting Started

### Prerequisites
*   Node.js (v18+ recommended)
*   npm

### Installation
1.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Application
1.  Start the development server:
    ```bash
    npm run dev
    ```
2.  Open your browser at `http://localhost:5173`.

### Building for Production
1.  Type-check and build the frontend:
    ```bash
    npm run build
    ```
2.  Preview the production build:
    ```bash
    npm run preview
    ```

## Key Directory Structure

*   `src/components/`: UI components (AdventurePanel, HabitCard, PetDisplay).
*   `src/store/`: Zustand store definitions (`useStore.ts` contains the core client-side game logic).
*   `src/types/`: TypeScript interfaces for `Habit`, `Pet`, and `UserState`.
*   `functions/`: Cloudflare Worker code for backend logic.
*   `firestore/`: Firebase configuration and rules.

## Development Notes

*   **State Logic:** The client-side store (`useStore.ts`) mirrors the intended server-side logic for immediate UI feedback (optimistic updates), but the backend (`functions/index.ts`) is the source of truth for rewards.
*   **Firebase Setup:** You must replace the placeholder config in `src/services/firebase.ts` with your actual Firebase project credentials to enable authentication and persistence.
