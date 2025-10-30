# Car Dealership - MERN Stack Application

This is a car dealership application built with the MERN (MongoDB, Express, React, Node.js) stack.

## Project Structure

```
.
├── client/                 # React frontend application
│   ├── src/                # Source files
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utility functions
│   │   ├── App.tsx         # Main App component
│   │   ├── main.tsx        # Entry point
│   │   └── ...
│   ├── package.json        # Client dependencies
│   └── ...
├── server/                 # Node.js backend application
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data storage logic
│   ├── package.json        # Server dependencies
│   └── ...
├── shared/                 # Shared code between client and server
│   ├── src/types           # Domain and API schemas (Zod)
│   └── src/index.ts        # Shared exports
├── tsconfig.base.json      # Base TS config (path aliases)
├── prettier.config.cjs     # Prettier config
├── docker-compose.yml      # Local dev/prod docker compose
├── package.json            # Root package.json with workspace scripts
└── ...
```

## Setup

1. Install dependencies for all workspaces:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

This starts both the client and server in development mode with hot reload.

## Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run dev:client` - Start only the client
- `npm run dev:server` - Start only the server
- `npm run build` - Build client and server
- `npm run start` - Start the production server

### Environment Variables
- Server sample: `server/env.example`
- Client sample: `client/env.example`

Copy and rename them to `.env` in the same folders (values required as needed).

### Docker
Build and run the full stack with Postgres:
```bash
docker compose up --build
```

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: Postgres via Drizzle ORM (current), MongoDB compatible structure
- **UI Components**: Radix UI, Tailwind CSS
- **State Management**: React Query
- **Form Handling**: React Hook Form, Zod