# Deployment Guide

## Overview

Deploy customerly to production with Vercel (frontend) + Neon (PostgreSQL) + Inngest (background jobs).

---

## 1. Neon Database Setup

1. Create a Neon project at https://console.neon.tech
2. Create a database named `customerly`
3. Copy the connection string (pooled connection for serverless)
4. Format: `postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/customerly?sslmode=require`

---

## 2. Vercel Project Setup

1. Push this repo to GitHub
2. Import in Vercel: https://vercel.com/new
3. Framework Preset: Next.js
4. Root Directory: `apps/web`
5. Build Command: `pnpm install && pnpm db:generate && pnpm build`
6. Install Command: `pnpm install`

### Environment Variables (Vercel Dashboard → Settings → Environment Variables)

```bash
# Database
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/customerly?sslmode=require"

# Auth (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="https://your-app.vercel.app"

# Google Places API (New)
GOOGLE_PLACES_API_KEY="your-google-cloud-api-key"

# WhatsApp Cloud API
WHATSAPP_APP_ID="your-meta-app-id"
WHATSAPP_APP_SECRET="your-meta-app-secret"
WHATSAPP_PHONE_NUMBER_ID="your-phone-number-id"
WHATSAPP_ACCESS_TOKEN="your-permanent-access-token"

# Resend (Email)
RESEND_API_KEY="re_xxxxx"
EMAIL_FROM="Customerly <noreply@yourdomain.com>"

# AI (OpenRouter)
OPENROUTER_API_KEY="sk-or-xxxxx"

# Billing - Razorpay (India)
RAZORPAY_KEY_ID="rzp_live_xxx"
RAZORPAY_KEY_SECRET="your-secret"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"

# Billing - Stripe (International)
STRIPE_SECRET_KEY="sk_live_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# Analytics
POSTHOG_KEY="phc_xxx"
POSTHOG_HOST="https://app.posthog.com"

# Inngest
INNGEST_EVENT_KEY="xxx"
INNGEST_SIGNING_KEY="xxx"
INNGEST_DEV="0"
```

---

## 3. Database Migration

After first deploy, run migrations:

```bash
# Option 1: Vercel CLI
vercel env pull .env.local
pnpm db:push

# Option 2: Local with production DATABASE_URL
DATABASE_URL="your-neon-url" pnpm db:push
```

For production, use Prisma Migrate:
```bash
pnpm db:migrate deploy
```

---

## 4. Domain & SSL

1. Add custom domain in Vercel: Settings → Domains
2. Configure DNS (CNAME to `cname.vercel-dns.com` or A record to `76.76.21.21`)
3. SSL auto-provisions via Let's Encrypt

---

## 5. Webhook Configuration

### Inngest
1. Create Inngest account at https://www.inngest.com
2. Add new app, copy Event Key and Signing Key
3. Register functions in Inngest dashboard → Functions

### Razorpay Webhook
URL: `https://your-app.vercel.app/api/billing/razorpay/webhook`
Events: `payment.captured`, `payment.failed`, `subscription.charged`, `subscription.cancelled`

### Stripe Webhook
URL: `https://your-app.vercel.app/api/billing/stripe/webhook`
Events: `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`

### WhatsApp Webhook
URL: `https://your-app.vercel.app/api/whatsapp/webhook`
Verify token: Set in Meta Developer Console

---

## 6. Google Cloud Console Setup

1. Enable Places API (New) in Google Cloud Console
2. Create API Key with restrictions:
   - Application restrictions: HTTP referrers (your Vercel domain)
   - API restrictions: Places API (New)
3. Set up billing account

---

## 7. Meta WhatsApp Setup

1. Create Meta Business Account
2. Create WhatsApp Business App
3. Add phone number, verify
4. Get permanent access token (System User token recommended)
5. Configure webhook in App Settings → WhatsApp → Configuration

---

## 8. Resend Setup

1. Create Resend account
2. Add and verify domain
3. Create API key
4. Set `EMAIL_FROM` to verified domain

---

## 9. Post-Deploy Checklist

- [ ] Run `pnpm db:push` or `pnpm db:migrate deploy`
- [ ] Test Google Places search in production
- [ ] Test WhatsApp deep-link and API send
- [ ] Test email send via Resend
- [ ] Verify Inngest functions executing
- [ ] Test Razorpay/Stripe checkout flow
- [ ] Check PostHog events flowing
- [ ] Set up monitoring alerts (Vercel + Neon)

---

## 10. Local Development with Production Services

```bash
# Pull production env (careful with secrets)
vercel env pull .env.local

# Or create .env.local manually with dev keys
cp .env.example .env.local
# Edit with your dev credentials

# Start local dev
docker-compose up -d
pnpm dev
```

---

## 11. CI/CD (Optional)

Add `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm db:generate
      - run: pnpm build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${ secrets.VERCEL_TOKEN }
          vercel-org-id: ${ secrets.VERCEL_ORG_ID }
          vercel-project-id: ${ secrets.VERCEL_PROJECT_ID }
          vercel-args: '--prod'
```

---

## Cost Estimate (Monthly, at scale)

| Service | Free Tier | Paid Estimate |
|---------|-----------|---------------|
| Vercel | Hobby | $20 (Pro) |
| Neon | 0.5 GB | $19 (Scale) |
| Inngest | 1M events | $25 |
| Google Places | 1000/day | $32/1000 calls |
| WhatsApp | 1000 conv/mo | $0.005-0.09/conv |
| Resend | 3000 emails | $20 |
| PostHog | 1M events | Free/Cloud |
| **Total** | **~$0** | **~$140-200/mo** |

---

## Support

- Vercel: https://vercel.com/docs
- Neon: https://neon.tech/docs
- Inngest: https://www.inngest.com/docs
- Google Places: https://developers.google.com/maps/documentation/places/web-service
- Meta WhatsApp: https://developers.facebook.com/docs/whatsapp
