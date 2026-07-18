const isDev = process.env.NODE_ENV === 'development';

const commonHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];

// 'unsafe-inline' is required for next-themes' anti-flash inline script, the JSON-LD
// block, and highlight.js inline styles. A nonce would force dynamic rendering and lose
// static/ISR caching, which isn't worth it here. 'unsafe-eval' is dev-only (React
// hot-reload); production stays strict.
const publicCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://res.cloudinary.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

// Sanity Studio needs Monaco from jsdelivr, eval, blob workers, and live API/websocket
// connections to Sanity.
const studioCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://cdn.jsdelivr.net https://*.sanity.io",
  "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io https://res.cloudinary.com",
  "font-src 'self' data: https://cdn.jsdelivr.net",
  "connect-src 'self' https://*.sanity.io https://*.api.sanity.io https://*.apicdn.sanity.io wss://*.api.sanity.io https://cdn.jsdelivr.net",
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
].join('; ');

// Site-wide common headers + strict public CSP, with a Studio-only override placed last
// so its CSP wins for /studio while the common headers still apply.
const securityHeaders = [
  {
    source: '/:path*',
    headers: [...commonHeaders, { key: 'Content-Security-Policy', value: publicCsp }],
  },
  {
    source: '/studio/:path*',
    headers: [{ key: 'Content-Security-Policy', value: studioCsp }],
  },
];

module.exports = { securityHeaders };
