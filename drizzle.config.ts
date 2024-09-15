import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './src/db',
  dbCredentials: {
    url: process.env.POSTGRES_URI!,
  },
});
