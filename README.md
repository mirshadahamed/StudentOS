# StudentOS

An integrated student management platform with separate frontend and backend services.

## Project Structure

```
studentOS/
├── frontend/          # Next.js React frontend
│   ├── app/           # Next.js app directory
│   ├── components/    # Reusable components
│   ├── public/        # Static assets
│   ├── package.json
│   └── ...
├── backend/           # Express.js API server
│   ├── server.js      # Main server entry point
│   ├── database.js    # Database configuration
│   ├── services/      # Business logic services
│   ├── package.json
│   └── ...
├── package.json       # Root monorepo configuration
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Install dependencies for all workspaces
npm install
```

### Development

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend
npm run dev:backend
```

### Building

```bash
# Build all workspaces
npm run build

# Or build individually
npm run build:frontend
npm run build:backend
```

### Running in Production

```bash
# Start frontend
npm start

# Start backend
npm run start:backend
```

## API Endpoints

All backend API endpoints are served from `http://localhost:3001` (or configured port).

## Frontend Routes

The frontend is available at `http://localhost:3000` and includes routes for:
- `/Finance` - Finance management
- `/productivity` - Productivity tools
- And other features

## Environment Variables

Create `.env.local` files in both `frontend/` and `backend/` directories as needed.

### Backend `.env.local`
```
PORT=3001
DATABASE_URL=your_database_url
```

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run dev:frontend` | Start only the frontend |
| `npm run dev:backend` | Start only the backend |
| `npm run build` | Build both frontend and backend |
| `npm run start` | Start frontend in production |
| `npm run start:backend` | Start backend in production |
| `npm run lint` | Run ESLint on frontend code |
