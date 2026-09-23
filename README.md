# GrandStay Hotel Management Pro

A Next.js hotel management + guest booking experience with separate admin authentication, customer registration/login, Google OAuth, persistent Supabase bookings, room photography, and optional Razorpay checkout.

## Local setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and configure the values below.

## Admin login

Admin credentials are intentionally separate from guest accounts:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `AUTH_SECRET`

Set these in Vercel Environment Variables for Production.

## Guest authentication + bookings

Create a Supabase project at https://supabase.com/ and add:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Run `supabase-schema.sql` in the Supabase SQL Editor. This creates profiles, bookings and RLS policies.

### Google login

In Supabase: Authentication → Providers → Google. Add your Google OAuth client ID/secret and configure the callback URL shown by Supabase. Add your deployed GrandStay URL to Supabase's allowed redirect URLs.

### Email/password registration

Supabase Authentication → Providers → Email should be enabled. If email confirmation is enabled, new users receive a confirmation email before signing in.

## Payments

The guest checkout supports **Pay at hotel** immediately. For online Card / UPI / NetBanking checkout, configure Razorpay:

```env
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
```

The app creates and verifies Razorpay orders server-side before saving the booking as paid.

For Vercel, add all environment variables under Production (and Preview/Development if desired), then redeploy after changing them.

## Deploy to Vercel

1. Push the project root to GitHub. `package.json` must be at the repository root.
2. Import the repository into Vercel.
3. Framework: Next.js.
4. Root Directory: `./`.
5. Build command: `next build`.
6. Add the environment variables above.
7. Deploy.

## Important

The admin PMS starter data remains browser-local for the front desk screens. Customer accounts and customer bookings are persistent in Supabase. For a fully shared PMS across multiple staff devices, the admin reservations/rooms should also be migrated to Supabase tables with staff roles and RLS.
