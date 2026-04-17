# 📖 SurahFlow

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwind-css)
![SSG](https://img.shields.io/badge/SSG-success)

**A production-ready Quran web application with static generation, full-text search, and persistent reader settings.**

[Live Demo](https://surahflow.vercel.app) · [Report Bug](https://github.com/YOUR_USERNAME/surahflow/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Acknowledgments](#acknowledgments)

---

## 📖 Overview

**SurahFlow** is a modern Quran reading application built with Next.js 16's App Router and Static Site Generation (SSG), plus a lightweight Node.js backend implemented with Next.js API Routes. All 114 surahs are pre-rendered at build time for fast page loads, while the backend exposes Quran data through `/api/*` endpoints in the same deployment.

The application features a glassmorphism UI, responsive design across all devices, and full-text search across English translations. Reader preferences are persisted locally using `localStorage`.

---

## ✨ Features

### Core Reading
- All 114 surahs with Arabic text and English translation
- Verse-by-verse display with numbered navigation
- Bismillah display for all surahs except At-Tawbah (Chapter 9)
- Previous/Next surah navigation

### Search Functionality
- Full-text search across all English verses
- Debounced search input (300ms)
- Highlighted search results with context
- Filter by surah and exact word matching

### Reader Settings
- Arabic font selection (Scheherazade New, Amiri, Noto Naskh Arabic)
- Arabic font size adjustment (16px–40px)
- Translation font size adjustment (12px–28px)
- Settings persisted in `localStorage`

### UI/UX
- Glassmorphism design with backdrop-blur effects
- Responsive grid layout (1–4 columns based on screen size)
- Smooth hover animations and transitions
- Loading skeletons for async operations

### Performance
- SSG pages generated at build time
- 118 pre-rendered pages (114 surahs + supporting pages)
- Build-time data fetching from Quran API
- Backend API routes available at runtime for integration/demo requirements

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16 (App Router) | SSG, routing, build system |
| **Backend** | Node.js (Next.js API Routes) | API endpoints for surahs, ayahs, and search |
| **Language** | TypeScript 5.0 | Type safety, better DX |
| **Styling** | Tailwind CSS 3 | Utility-first styling |
| **Fonts** | Google Fonts / @fontsource | Scheherazade New, Amiri, Inter |
| **Data Source** | AlQuran Cloud API | Quran text and translations |
| **Persistence** | localStorage | User settings storage |
| **Deployment** | Vercel | Static hosting, CDN |

---

## 📁 Project Structure
frontend/
├── app/
│ ├── layout.tsx # Root layout with providers
│ ├── api/ # Node.js backend via Next.js Route Handlers
│ ├── page.tsx # Surah list page (SSG)
│ ├── surah/[number]/ # Individual surah pages (SSG)
│ │ ├── page.tsx
│ │ └── loading.tsx
│ ├── search/page.tsx # Search results page
│ └── components/
│ ├── Header.tsx # App header with search
│ ├── SettingsSidebar.tsx # Settings panel (drawer)
│ ├── SurahCard.tsx # Individual surah card
│ ├── VerseItem.tsx # Individual verse display
│ └── SearchBar.tsx # Search input with debounce
├── context/
│ └── SettingsContext.tsx # Global settings state + localStorage
├── lib/
│ ├── api.ts # Quran API fetch helpers
│ ├── types.ts # TypeScript interfaces
│ └── settings.ts # localStorage utilities
├── styles/
│ └── globals.css # Global styles + glassmorphism utilities
├── public/ # Static assets
├── scripts/
│ └── generate-static-data.mjs # Build-time data generator
├── next.config.js # Next.js config
├── tailwind.config.js # Tailwind configuration
├── package.json
└── tsconfig.json

text

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.0+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/surahflow.git
cd surahflow

# Install dependencies
npm run install:all

# Run the app (frontend + API routes)
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

App: `http://localhost:3000`  
API example: `http://localhost:3000/api/surahs`