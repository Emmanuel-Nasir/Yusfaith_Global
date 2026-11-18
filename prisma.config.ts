import "dotenv/config";
import { defineConfig } from "prisma/config";

/*
  DATABASE_URL is only needed to create tables (prisma migrate deploy) and
  for the live site. "prisma generate" (run on every npm install and Vercel
  build) works without it, so installs never fail when it isn't set yet.
*/
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env.DATABASE_URL ?? "" },
});
