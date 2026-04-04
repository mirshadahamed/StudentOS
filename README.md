<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
# StudentOS

StudentOS is now a single Next.js App Router application with MongoDB-backed API routes and no separate backend service.

## Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   ├── finance/
│   │   ├── focus/
│   │   └── tasks/
│   ├── finance/
│   └── productivity/
├── lib/
└── models/
```

## Environment

Only keep connection strings and external API secrets in `.env`:

```bash
MONGODB_URI=your_mongodb_connection_string
ANTHROPIC_API_KEY=optional_key
GOOGLE_API_KEY=optional_key
```

## Scripts

```bash
npm install
npm run dev
npm run build
npm run start
```

## API Routes

Finance APIs are same-origin and live under:

- `/api/finance/income`
- `/api/finance/expenses`
- `/api/finance/savings`
- `/api/finance/transactions`
- `/api/finance/reports`

Additional app APIs:

- `/api/tasks`
- `/api/focus`
- `/api/ai`

## Notes

- Finance, task, and focus data are stored in MongoDB through Mongoose models.
- Frontend fetches use same-origin `/api/...` endpoints, so there is no CORS layer to manage.
- User scoping is handled through `userId` on each document and request.
>>>>>>> productivity-task
