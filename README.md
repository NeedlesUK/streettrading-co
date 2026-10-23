# Street Trading Co.

Initial holding page, based on the Vite + React structure used by the private `NeedlesUK/swordfish` site. The supplied Street Trading Co. logo is used as the page artwork and favicon.

## Local development

```sh
npm install
npm run dev
```

## Netlify

Build command: `npm run build`  
Publish directory: `dist`

The site uses the existing TattSync/Swordfish Supabase project only for the isolated `public.street_trading_co_site_config` table. It never reads or writes Swordfish tables. Set the project URL and browser-safe publishable key from `.env.example` for local development; keep service-role keys out of the client.
