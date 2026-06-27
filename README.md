# Customerly

A minimalistic SaaS for extracting business leads from Google Maps and nurturing them via WhatsApp/email outreach.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: PostgreSQL (Neon) + Prisma
- **Queue/Background Jobs**: Inngest
- **APIs**: Google Places API (New), Outscraper fallback
- **Messaging**: WhatsApp Cloud API, Resend + React Email
- **AI**: Vercel AI SDK (OpenRouter)
- **Payments**: Razorpay / Stripe
- **Analytics**: PostHog
- **Monorepo**: Turborepo

## Project Structure

```
customerly/
├── apps/
│   └── web/                 # Next.js 15 application
├── packages/
│   ├── db/                  # Prisma schema & database client
│   ├── ui/                  # Shared UI components (shadcn/ui based)
│   ├── integrations/        # External API integrations
│   ├── design-tokens/       # Design system tokens
│   ├── eslint-config/       # Shared ESLint config
│   └── tsconfig/            # Shared TypeScript config
├── docker-compose.yml       # Local Postgres + Redis
├── turbo.json               # Turborepo config
└── package.json             # Root package.json
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose (for local DB/Redis)

### Installation

```bash
# Install dependencies
pnpm install

# Start local database
docker-compose up -d

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your API keys

# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

### Environment Variables

See `apps/web/.env.example` for all required variables:

```env
# Database
DATABASE_URL="postgresql://customerly:customerly@localhost:5432/customerly?schema=public"

# Auth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google Places API (New)
GOOGLE_PLACES_API_KEY="your-google-places-api-key"

# Outscraper (fallback)
OUTSCRAPER_API_KEY="your-outscraper-key"

# WhatsApp Cloud API
WHATSAPP_APP_ID="your-app-id"
WHATSAPP_APP_SECRET="your-app-secret"
WHATSAPP_PHONE_NUMBER_ID="your-phone-number-id"
WHATSAPP_ACCESS_TOKEN="your-access-token"

# Resend (Email)
RESEND_API_KEY="your-resend-key"

# AI (OpenRouter via Vercel AI SDK)
OPENROUTER_API_KEY="your-openrouter-key"

# Billing
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
STRIPE_SECRET_KEY="your-stripe-secret"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# Analytics
POSTHOG_KEY="your-posthog-key"
POSTHOG_HOST="https://app.posthog.com"

# Inngest
INNGEST_EVENT_KEY="your-inngest-key"
INNGEST_SIGNING_KEY="your-inngest-signing-key"
```

## Development

```bash
# Run all dev servers
pnpm dev

# Run specific app
cd apps/web && pnpm dev

# Database commands
pnpm db:generate    # Generate Prisma client
pnpm db:push        # Push schema changes
pnpm db:studio      # Open Prisma Studio

# Linting & Formatting
pnpm lint
pnpm format

# Testing
pnpm test
```

## Deployment

### Vercel (Frontend)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Neon (Database)

1. Create a Neon project
2. Copy connection string to `DATABASE_URL`
3. Run migrations: `pnpm db:push` (or use Prisma Migrate in CI)

### Inngest

1. Create Inngest account
2. Add environment variables
3. Register functions in Inngest dashboard

## Design System

- **Colors**: Neutral-900/50 base + Emerald-600 accent
- **Typography**: System fonts (Inter fallback)
- **Spacing**: 8px scale
- **Components**: shadcn/ui with custom theme

## License

MIT
