# Hotel Avadh

A Next.js hotel booking demo with MongoDB models and API routes for rooms, users, bookings, and payments.

## Setup

1. Copy the environment example:

```bash
cd hotelavadh
cp .env.example .env.local
```

2. Add your MongoDB connection string to `.env.local`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.example.mongodb.net/hotelavadh?retryWrites=true&w=majority
```

3. Install dependencies and start the app:

```bash
npm install
npm run dev
```

4. Visit [http://localhost:3000](http://localhost:3000).

## API endpoints

- `GET /api/rooms`
- `POST /api/rooms`
- `GET /api/users`
- `POST /api/users`
- `GET /api/bookings`
- `POST /api/bookings`
- `GET /api/payments`
- `POST /api/payments`

## Project structure

- `src/models/` — Mongoose schemas for users, rooms, bookings, and payments.
- `src/lib/mongodb.ts` — Reusable MongoDB connection helper.
- `app/api/` — Server route handlers for core CRUD operations.
- `app/page.tsx` — Landing page with feature overview.

## Notes

- The app uses `mongoose.models` guards to avoid model overwrites during development.
- Room availability is automatically updated when bookings are created.
