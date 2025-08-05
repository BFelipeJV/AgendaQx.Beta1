# AgendaQx

A Next.js and Firebase web app for managing surgical schedules. The project was bootstrapped with Firebase Studio.

## Prerequisites

- **Node.js 20+** is recommended for running Next.js 15.
- A **Firebase project** where you can obtain the web configuration values.
- Copy `.env.local.example` to `.env.local` and fill in your Firebase credentials:

```bash
cp .env.local.example .env.local
```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   The app runs on [http://localhost:9002](http://localhost:9002).
3. (Optional) Start Genkit AI development flows:
   ```bash
   npm run genkit:dev
   ```

### Building for Production

```bash
npm run build
npm run start
```

## Features

Main functionality is outlined in `docs/blueprint.md`:
- Dashboard with quick access to key areas.
- Surgery registration forms for procedures and non-surgical patients.
- Schedule management for surgeries and resources.
- Daily logbook view of the current day's activities.
- Authentication to restrict sensitive actions.

## Project Structure

- **`src/app`** – Next.js routes and layouts.
- **`src/components`** – UI components used across features.
- **`src/lib`** – Utilities and Firebase initialization (`src/lib/firebase.ts`).
- **`src/ai`** – Genkit AI configuration.

Refer to these directories when exploring or extending the application.
