# 🏃‍♂️ WWTRAIL Frontend

Frontend application for WWTRAIL - Trail Running Competitions Platform.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + Shadcn/ui
- **State Management**: React Hooks
- **API Client**: Axios
- **Maps**: Leaflet (coming soon)

## 📋 Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:3001`
- npm or yarn package manager

## 🔧 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd wwtrail-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌍 Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=WWTRAIL
NEXT_PUBLIC_DEFAULT_LANGUAGE=es
```

## 📁 Project Structure

```
wwtrail-frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (main)/            # Main application routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── auth/             # Auth components
│   └── layout/           # Layout components
├── lib/                   # Utilities
│   ├── api/              # API client
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript types
└── hooks/                 # Custom React hooks
```

## 🎯 Development Phases

- ✅ **Phase 1**: Initial Setup (COMPLETED)
- 🔄 **Phase 2**: API Client & Types
- ⏳ **Phase 3**: Authentication System
- ⏳ **Phase 4**: Main Pages
- ⏳ **Phase 5**: Competition Components

## 🧪 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎨 Design System

The project uses a green nature-themed color palette:
- Primary: Green (#22c55e)
- Supports light/dark modes
- Accessible color contrasts

## 🔗 Backend Integration

This frontend connects to the WWTRAIL backend API:
- **Base URL**: `http://localhost:3001/api`
- **Auth**: JWT tokens
- **Languages**: ES, IT, EN, CA, FR, DE

## 📝 License

Private project - All rights reserved

## 👥 Contributors

- Development Team

---

**Status**: 🟢 Active Development | **Phase**: 1/5 Complete
