/*
  DEMO MODE
  true  -> staff tools are visible (for the client approval demo)
  false -> only the public, customer-facing pages are shown
  This only hides things from view. It is NOT security.
  Real protection (login + server-side checks) comes with the main app.

  ON by default (so the Vercel demo always shows the staff pages).
  To hide them, set NEXT_PUBLIC_DEMO_MODE=false in Vercel and redeploy.
*/
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE?.trim().toLowerCase() !== "false";