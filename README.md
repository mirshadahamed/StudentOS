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
