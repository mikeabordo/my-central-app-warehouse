# Dreamspos POS System

A **Vue 3** frontend application for a Point of Sale (POS) system.

---

## Project Structure

```
template/
├── src/
│   ├── plugins/       # Modular plugin registrations
│   ├── router/
│   │   └── modules/   # Domain-based route modules
│   ├── components/    # Reusable components
│   ├── views/         # Page views & layouts
│   └── assets/        # CSS, images, fonts
├── package.json
└── vue.config.js
```

---

## Prerequisites

- **Node.js** >= 16.x

---

## Getting Started

### 1. Installation

```bash
npm install
```

### 2. Development

```bash
npm run dev
```

The Vue dev server will start at `http://localhost:8081` (or the next available port).

---

## Build for Production

```bash
npm run build
```
The production build will be in `dist/`.
