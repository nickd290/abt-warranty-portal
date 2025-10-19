# ABT Warranty Portal - Project Context

## Project Overview
- **Name:** abt-warranty-portal
- **Description:** Customer warranty registration and management portal
- **Priority:** P0 (Production Critical - customer-facing)
- **Status:** Production

## Tech Stack
- **Framework:** Vite + React 19 (frontend) + Express (backend)
- **Language:** TypeScript
- **Database:** PostgreSQL (Prisma ORM)
- **Styling:** Tailwind CSS v4
- **Package Manager:** npm
- **File Upload:** react-dropzone

## Deployment
- **Platform:** Vercel (frontend) + Railway (backend + database)
- **Production URL:** See LIVE_URLS.md
- **Staging URL:** N/A
- **Database Host:** Railway PostgreSQL

## Database
- **Type:** PostgreSQL
- **Connection:** DATABASE_URL (in .env)
- **Schema:** `server/prisma/schema.prisma`
- **Migrations:** Use `prisma db push` for development

## Environment Variables
Required .env variables:
```
DATABASE_URL=postgresql://...  # Railway PostgreSQL connection
VITE_API_URL=...              # Backend API endpoint
PORT=3000                     # Backend server port
```

## Development
- **Dev Server:** `npm run dev` (Vite on port 5173)
- **Backend Server:** Run separately in `server/` directory
- **Build Command:** `npm run build` (TypeScript + Vite)
- **Start Production:** `npm start` (serves dist folder)
- **Lint:** `npm run lint`

## Project Structure
```
abt-warranty-portal/
├── src/              # React frontend code
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── lib/          # Utilities
│   └── App.tsx       # Main app component
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── prisma/       # Database schema and migrations
│   └── routes/       # API routes
├── public/           # Static assets
└── dist/             # Production build output
```

## Key Files & Locations
- **Auth:** `server/routes/auth.ts` or similar
- **API Client:** Frontend uses axios for API calls
- **Database:** `server/prisma/schema.prisma`
- **State Management:** Zustand
- **Config:** `vite.config.ts`, `tsconfig.json`

## Key Features
- Customer warranty registration
- File upload for warranty documents (react-dropzone)
- Admin portal for warranty management
- PostgreSQL database with Prisma ORM
- SFTP integration (see SFTP_SETUP.md)

## Recent Changes
- **Oct 18:** Package updates
- **Oct 17:** Live URLs documented
- **Oct 16:** Production deployment to Vercel + Railway
- **Oct 15:** SFTP setup and production configuration

## Known Issues / Tech Debt
- [ ] No test suite configured
- [ ] Need to document API endpoints
- [ ] Consider adding request validation
- [ ] SFTP credentials stored separately (see SFTP_CREDENTIALS.md)

## Dependencies to Watch
- **React 19.1.1:** Latest major version - watch for ecosystem compatibility
- **Tailwind CSS 4.1.14:** Latest v4 - new features available
- **axios:** Keep updated for security patches

## Performance Notes
- **Current Bundle Size:** Unknown (run `/bundle-size` to check)
- **Build Time:** Unknown
- **Database Query Performance:** Monitor via Prisma logs

## Specific Instructions
- **Database Changes:** Always update schema.prisma and run `npx prisma db push`
- **Deployment:** Frontend (Vercel) and Backend (Railway) are separate deployments
- **SFTP:** See SFTP_SETUP.md for credentials and configuration
- **File Uploads:** Uses react-dropzone, ensure max file size limits configured
- **Environment:** Check .env.production.local for production-specific vars

## Related Projects
- **Shares code with:** None currently
- **Similar to:** None
- **Depends on:** Railway PostgreSQL, SFTP server for file storage
- **External Services:** Email service (check server code for integration)
