# GrandStay Hotel Management — Pro HMS

A polished, responsive hotel-management starter rebuilt from the supplied project.

## Included
- GrandStay branding and premium hospitality UI
- Dashboard with occupancy, revenue and room snapshots
- Reservations: create, search, check-in/out/status changes, overlap validation
- Rooms: visual room cards with hotel/room photography and live status controls
- Customers: guest directory from reservations
- Payments: collect outstanding balance and payment ledger
- CSV export for reservations, payments and reports
- Reports/analytics
- Settings with persisted hotel profile
- Responsive desktop/tablet/mobile navigation
- Server-side credential verification through Next.js API routes with an HttpOnly session cookie
- Browser persistence for the starter reservation/room workspace

## Login
Default development credentials:
- Email: `admin@grandstay.com`
- Password: `GrandStay@123`

For deployment, set:
`ADMIN_EMAIL`
`ADMIN_PASSWORD`
`AUTH_SECRET`

See `.env.example`.

## Run
```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Production note
The authentication endpoint is real server-side credential verification, but the hotel data in this starter is stored in the browser. For a multi-user production HMS, connect the existing UI to Supabase/Postgres, Firebase, or your own database/API and replace the starter credentials with managed user accounts. Payment collection is represented as a ledger action; connect Stripe/Razorpay/etc. before charging real cards.

Images use curated Unsplash-hosted hospitality photography. Replace URLs with your licensed hotel photography for production.
