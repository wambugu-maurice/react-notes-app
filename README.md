# Notes App

A React notes app built with Vite, Firebase Authentication, and Cloud Firestore.

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and fill in the Firebase configuration values from your Firebase project.
3. Start the development server with `npm run dev`.

The `.env` file is ignored by Git. Vite exposes `VITE_` variables to browser code, so Firebase web configuration is visible to users of the built app; protect your project with Firebase Security Rules and API key restrictions.

## Scripts

- `npm run dev` — start the development server.
- `npm run build` — create a production build.
- `npm run lint` — run ESLint.
- `npm run preview` — preview the production build locally.
