This is a Next.js StudentOS app with finance tracking, split bills, savings goals, AI advisor support, and WhatsApp expense logging.

## Getting Started

1. Create a local env file from the example and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

- `MONGODB_URI` for MongoDB
- `GEMINI_API_KEY` for the finance advisor
- `EMAIL_USER` and `EMAIL_PASS` for split-bill email alerts

2. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Finance API

Finance features already live inside the Next app, so this repo does not need a separate `server.js` Express backend for them.

- `/api/finance/transactions`
- `/api/finance/savings`
- `/api/finance/splits`
- `/api/finance/streak`
- `/api/finance/advisor`
- `/api/whatsapp`

## Notes

- Split-bill email sending happens in [`src/app/api/finance/splits/route.js`](/Users/mirshadahamed/StudentOS/src/app/api/finance/splits/route.js).
- WhatsApp logging happens in [`src/app/api/whatsapp/route.js`](/Users/mirshadahamed/StudentOS/src/app/api/whatsapp/route.js).
- MongoDB connection setup lives in [`src/app/libs/mongodb.js`](/Users/mirshadahamed/StudentOS/src/app/libs/mongodb.js).
- If you want the monthly recurring-expense cron from your old Express server, add it as a scheduled job. `node-cron` inside Next route files is not reliable for deployment.
