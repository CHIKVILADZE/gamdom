🎬 Cinema Seat Booking App
A full-stack web application for booking cinema seats in real time using React + Vite, Node.js + Express, PostgreSQL, and WebSocket. Built with TypeScript, Dockerized for local development.

📁 Project Structure
graphql
Copy
Edit
gamdom/
├── backend/         # Express backend API (Node.js + Prisma + WebSocket)
├── frontend/        # React frontend (Vite + Bootstrap)
├── shared/          # Shared interfaces and schemas used across frontend & backend
├── docker-compose.yml
⚙️ Prerequisites
Docker & Docker Compose

Node.js (optional if running without Docker)

PostgreSQL client (optional for DB inspection)

🚀 Running the App
1. Clone the repo
bash
Copy
Edit
git clone https://github.com/your-username/gamdom.git
cd gamdom
2. Start the whole app (frontend + backend + db)
bash
Copy
Edit
docker compose up --build
This will:

Start PostgreSQL at localhost:5432

Start backend API at http://localhost:5000

Start frontend at http://localhost:3000

3. Seed Database (manually)
Access PostgreSQL inside the container:

bash
Copy
Edit
docker exec -it gamdom-db-1 psql -U postgres -d cinema_booking
Insert some movies:

sql
Copy
Edit
INSERT INTO "Movie" ("title", "duration") VALUES
  ('Inception', 148),
  ('Interstellar', 169),
  ('The Dark Knight', 152);

 
 API Endpoints (Sample)
Method	Endpoint	Description
GET	/movies	Get all movies
GET	/sessions	List all sessions
GET	/sessions/:id	Get session with seat info
POST	/sessions/:id/reserve	Reserve seats
POST	/bookings/:id/confirm	Confirm a booking

 WebSocket
Used to broadcast seat updates in real-time. Handled via a WebSocket server in the backend and connected in the frontend.

 	Shared Folder
The shared/ directory contains TypeScript:
Interfaces (Movie, Seat, Session, etc.)
Zod schemas (validation)

Used by both frontend and backend via path alias: @shared/*

🧪 Tech Stack
Frontend: React, Vite, Bootstrap

Backend: Express, Prisma, WebSocket

Database: PostgreSQL

Dev Tools: Docker, Docker Compose, Postman











