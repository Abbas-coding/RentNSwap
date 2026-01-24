# RentNSwap

RentNSwap is a comprehensive full-stack platform designed to facilitate the renting and swapping of items within a community. It enables users to list personal items, browse available listings, propose swaps, and book rentals, all while ensuring a secure and interactive user experience through real-time messaging and administrative oversight.

## Key Features

- **User Authentication:** Secure Signup and Login functionality using JWT.
- **Item Management:** Users can list items with images and descriptions, and browse a catalog of available items.
- **Rentals & Bookings:** Complete flow for booking items for specific dates.
- **Swap System:** Dedicated functionality for users to propose and negotiate item swaps.
- **Real-Time Messaging:** Integrated inbox for instant communication between buyers, sellers, and swappers (powered by Socket.io).
- **Admin Dashboard:** A robust backend interface for administrators to manage users, listings, bookings, and swaps.
- **Dispute Resolution:** Built-in system for handling disputes between users.
- **Reviews & Ratings:** Trust-building mechanism allowing users to review transactions and items.
- **Community Insights:** Analytics and insights for platform usage.

## Tech Stack

### Frontend
- **Framework:** [React](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
- **Language:** TypeScript
- **Styling:** CSS / Tailwind (inferred) with custom UI components
- **State Management:** React Context API (Auth, Socket)
- **Routing:** React Router

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Language:** TypeScript
- **Database:** [MongoDB](https://www.mongodb.com/) (using [Mongoose](https://mongoosejs.com/))
- **Real-Time Engine:** [Socket.io](https://socket.io/)
- **File Uploads:** Multer

## Prerequisites

Before running the project, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v10 or higher)
- **MongoDB** (Running locally on `mongodb://localhost:27017` or a cloud instance)

## Getting Started

### 1. Repository Setup

Clone the repository and install dependencies for both the frontend and backend.

**Root (Frontend):**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 2. Environment Configuration

You need to set up environment variables for both the client and the server.

**Frontend:**
Copy the example file and update if necessary.
```bash
cp .env.example .env
```
*Variables:*
- `VITE_API_URL`: The URL of the backend API (default: `http://localhost:4000`)

**Backend:**
Navigate to the `server/` directory and create your `.env` file.
```bash
cd server
cp .env.example .env
```
*Required Variables:*
- `MONGO_URI`: Connection string for MongoDB (e.g., `mongodb://localhost:27017/rentnswap`)
- `JWT_SECRET`: A secure random string for signing tokens.
- `CLIENT_ORIGIN`: The URL of the frontend (e.g., `http://localhost:5173`)

### 3. Database Seeding (Optional)

To populate the database with initial test data (users, items, etc.), you can run the seed script.

```bash
cd server
npm run seed
```

### 4. Running the Application

**Start the Backend:**
From the `server/` directory:
```bash
npm run dev
```
The server will start on port `4000` (or as configured).

**Start the Frontend:**
From the root directory:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## Project Structure

```
RentNSwap/
├── src/                  # Frontend source code
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React Context providers (Auth, Socket)
│   ├── layouts/          # Page layouts (Root, Auth)
│   ├── pages/            # Application views (Home, Dashboard, Inbox, etc.)
│   └── lib/              # Utilities and API clients
├── server/               # Backend source code
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Express middleware (Auth, Error handling)
│   │   ├── models/       # Mongoose data models
│   │   └── routes/       # API route definitions
│   └── uploads/          # Directory for uploaded files
└── public/               # Static assets
```

## Contributing

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/AmazingFeature`).
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.