# Street Trading Co.

Initial holding page, based on the functional admin surface in the private `NeedlesUK/swordfish-tattoo` repository. The Swordfish colour palette, artwork, and branding are not copied; the supplied Street Trading Co. logo remains the holding-page artwork and favicon.

## Local development

```sh
npm install
npm run dev
```

## Netlify

Build command: `npm run build`  
Publish directory: `dist`

The site uses the existing TattSync/Swordfish Supabase project for shared infrastructure, but all Street Trading content lives in isolated `street_trading_co_*` tables. The admin workspace follows the tested Swordfish feature map: company and holding-page controls, products, categories, image uploads, variations, stock variants, orders with status actions, discounts and discount URLs, delivery rates, artists and portfolios, reviews, offers, events, analytics, email templates, and PDF templates. It never reads or writes Swordfish application tables. Set the project URL and browser-safe publishable key from `.env.example` for local development; keep service-role keys out of the client.

The `/admin` route uses Supabase email/password authentication plus a separate `public.street_trading_co_admin_users` allow-list. It does not use the Swordfish `admin_users` table. Administrator accounts are provisioned separately from the public client, and the login includes a secure password-recovery flow. Every admin table has forced RLS and is accessible only to an allow-listed authenticated user. Street Trading image uploads use a separate `street-trading-co-images` storage bucket, and order status actions use the `street-trading-update-order-status` Edge Function against prefixed tables only.
