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
│   └── schema.ts           # Data schemas
├── package.json            # Root package.json with workspace scripts
└── ...
```

## Setup

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

This will start both the client and server in development mode.

## Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run dev:client` - Start only the client
- `npm run dev:server` - Start only the server
- `npm run build` - Build both client and server
- `npm run start` - Start the production server
- `npm run install:all` - Install dependencies for all workspaces

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (planned)
- **UI Components**: Radix UI, Tailwind CSS
- **State Management**: React Query
- **Form Handling**: React Hook Form, Zod