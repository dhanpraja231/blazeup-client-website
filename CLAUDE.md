# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BlazeUp is a freelancer marketplace platform built with Next.js 15, featuring an AI-powered credit card designer. The application uses Claude AI (Anthropic) for generating custom credit card designs based on company logos.

## Tech Stack

- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript (strict mode)
- **UI**: React 19, Tailwind CSS 4
- **Animations**: Framer Motion, GSAP
- **Database/Auth**: Supabase
- **AI**: Anthropic Claude (claude-3-5-haiku-20241022)
- **Build Tool**: Turbopack (dev mode)

## Development Commands

```bash
# Start development server (uses Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/app/
├── (navcontent)/          # Route group for main content pages
│   ├── home/              # Landing page
│   ├── card-designer/     # AI card designer tool
│   ├── build/             # Build services page
│   ├── freelance/         # Freelancer services page
│   ├── vision/            # Vision page
│   ├── client-registration/
│   ├── freelancer-registration/
│   └── success/           # Success confirmation page
├── api/                   # API routes
│   ├── generate-card/     # AI card generation endpoint
│   ├── generate-templates/ # AI template generation
│   ├── client-registration/
│   └── freelancer-registration/
├── components/
│   ├── ui/                # UI components
│   ├── layout/            # Layout components (Navbar, Footer)
│   └── animations/        # Animation components
├── lib/
│   ├── rate-limit.ts      # Rate limiting logic
│   ├── types/             # TypeScript type definitions
│   └── utils.ts           # Utility functions
└── utils/supabase/        # Supabase client configurations
    ├── admin.ts           # Admin client (service_role)
    ├── server.ts          # Server-side client (SSR)
    └── client.ts          # Client-side client
```

## Important Patterns

### Path Aliases

The project uses `@/*` as an alias for `./src/app/*`. Example:
```typescript
import { createClient } from '@/utils/supabase/server';
import ColorPicker from '@/components/ui/color-picker';
```

### Supabase Client Usage

The project has three different Supabase clients for different contexts:

1. **Admin Client** (`@/utils/supabase/admin`): Uses service_role key for privileged operations like rate limiting. Use only in API routes, never in client components.

2. **Server Client** (`@/utils/supabase/server`): For server-side operations in Server Components and API routes. Handles cookies automatically.

3. **Client Client** (`@/utils/supabase/client`): For client-side operations in Client Components.

### Rate Limiting System

The AI card generation feature implements a two-tier rate limiting system:

- **Global Limit**: 1,000 free designs per month across all users
- **Per-IP Limit**: 1 generation per IP address per month

Implementation details:
- IP addresses are hashed using SHA-256 for privacy (`hashIP` function)
- Tracked in Supabase `generations` table and `monthly_counter` table
- Month format: `YYYY-MM` (e.g., "2026-02")
- Rate limit functions located in `@/lib/rate-limit.ts`

### AI Card Generation

The `/api/generate-card` endpoint:
1. Validates IP-based rate limits
2. Accepts a base64-encoded logo image (max 5MB)
3. Uses Claude 3.5 Haiku with vision capabilities
4. Returns JSON with card design elements (positions, colors, gradients)
5. Records generation in database

The AI prompt instructs Claude to return a structured JSON format with elements array and card styling.

## Environment Variables

Required environment variables (stored in `.env.local`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic AI
ANTHROPIC_API_KEY=
```

## Database Schema

Key Supabase tables:

- **`generations`**: Tracks AI card generations with `ip_hash` and `month` columns
- **`monthly_counter`**: Cached monthly generation counts for performance
- **RPC Function**: `increment_monthly_counter(month_param)` for atomic counter updates

## Styling

- Tailwind CSS 4 with PostCSS
- Dark mode enabled by default (see `layout.tsx`)
- Custom font: Inter (Google Fonts) with CSS variable `--font-inter`
- Uses `tailwind-merge` and `clsx` for conditional class merging

## Key Components

- **AICardGenerator**: Main AI card generation interface with rate limit checks
- **credit-card-designer**: Interactive card design editor
- **color-picker**: Custom color selection component
- **Navbar/Footer**: Global layout components (rendered in root layout)

## API Route Patterns

All API routes follow Next.js App Router conventions:
- Located in `src/app/api/[route-name]/route.ts`
- Export named functions: `GET`, `POST`, `PUT`, `DELETE`
- Use `NextRequest` and `NextResponse` from `next/server`
- Handle errors with proper status codes and error messages

## Development Notes

- The app runs in dark mode by default (`<html lang="en" className="dark">`)
- Route groups like `(navcontent)` don't affect URL structure but allow shared layouts
- React Compiler is disabled (`experimental.reactCompiler: false`)
- Uses React 19 features - be aware of breaking changes from React 18
