# QuickDesk

QuickDesk is a comprehensive, full-featured customer support ticketing platform built using the MERN stack (MongoDB, Express.js, React, Node.js). It enables organizations to efficiently manage customer support requests, optimize agent workflows, and deliver excellent support experiences through intuitive interfaces and robust backend services.

---

> **Project submission for Odoo Hackathon 2025**

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Development and Deployment](#development-and-deployment)
- [Contributing](#contributing)
- [License](#license)
- [Team](#team)

---

## Features

- **Secure Authentication & Authorization**  
  Robust JWT-based authentication, with role-based access controls for end-users and agents, ensuring data security and privacy.

- **Advanced Ticket Management**  
  Users can create, view, filter, and manage support tickets. Agents have access to ticket queues, advanced filtering, and the ability to update statuses and collaborate on tickets through sharing and threaded discussions.

- **User Profiles & Customizable Settings**  
  Each user and agent can manage their own profile, personal details, and notification preferences for a personalized experience.

- **Agent Collaboration**  
  Tickets can be shared among agents, allowing for teamwork on complex issues. Internal notes and threaded replies facilitate clear communication.

- **Dashboards & Analytics**  
  Real-time dashboards for users and agents, providing key insights into ticket statuses, category breakdowns, response times, and other support metrics.

- **Rich RESTful API**  
  Clean, versioned REST API built with Express.js, allowing for integration with additional systems or custom frontends.

- **Responsive Modern UI**  
  The frontend is built with React, delivering a fast, interactive, and mobile-friendly user experience.

- **Cloud & On-Premise Ready**  
  Backend supports both traditional server hosting and serverless cloud deployments (e.g., Firebase Cloud Functions).

- **Highly Extensible**  
  Modular codebase designed for easy feature additions, third-party integrations, and workflow customizations.

---

## Architecture

QuickDesk is designed for scalability and maintainability with a clear separation of concerns:

- **Backend**:  
  Node.js & Express.js REST API, MongoDB for data persistence, JWT for authentication, with optional support for serverless deployments.

- **Frontend**:  
  React SPA (Single Page Application), bootstrapped with Create React App, offering a modern and dynamic user interface.

---

## Project Structure

```
Quickdesk/
├── backend/       # Express.js REST API, authentication, MongoDB models, config
│   ├── functions/ # Serverless (Firebase) functions support
│   └── ... 
├── frontend/      # React app (Create React App)
│   └── ...
```

---

## Getting Started

### Backend Setup

1. **Install dependencies**
    ```bash
    cd backend
    npm install
    ```

2. **Configure Environment**
   Create a `.env` file in the `backend` directory with:
    ```
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/quickdesk
    JWT_SECRET=your-super-secret-jwt-key
    ```

3. **Start MongoDB**
   - Make sure MongoDB is running locally or provide a MongoDB Atlas URI.

4. **Run the backend server**
    ```bash
    npm start          # Production mode
    npm run dev        # Development mode (with nodemon)
    ```

### Frontend Setup

1. **Install dependencies**
    ```bash
    cd frontend
    npm install
    ```

2. **Run the React app**
    ```bash
    npm start
    ```
   - App runs at [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

### Authentication

- `POST /api/auth/register` — Register a new user (end-user or agent)
- `POST /api/auth/login` — Authenticate and receive a JWT

### Tickets

- `POST /api/tickets` — Create a support ticket
- `GET /api/tickets/user` — Get tickets for the current user
- `GET /api/tickets/agent` — Get tickets assigned to the agent or agent queue
- `GET /api/tickets/:id` — Get the details of a specific ticket
- `PUT /api/tickets/:id/status` — Update ticket status (agents only)
- `POST /api/tickets/:id/replies` — Add a threaded reply to a ticket
- `GET /api/tickets/:id/replies` — Retrieve all replies for a ticket

### User Management

- `GET /api/profile` — Get the current user's profile
- `PUT /api/profile` — Update profile information
- `GET /api/settings` — Retrieve user settings
- `PUT /api/settings` — Update user settings

### Dashboard & Metadata

- `GET /api/user/dashboard` — Dashboard statistics for end-users
- `GET /api/agent/dashboard` — Dashboard statistics for agents
- `GET /api/metadata` — List of all ticket categories, priorities, and statuses

---

## Database Models

- **User**:  
  Stores authentication credentials, profile details, role (end-user or agent), and personal settings.

- **Ticket**:  
  Represents a support ticket, including title, description, category, priority, status, creator, assigned agent, and optional attachments.

- **TicketReply**:  
  Contains threaded replies for tickets, capturing the conversation history between users and agents.

- **TicketShare**:  
  Enables collaborative workflows by allowing tickets to be shared among multiple agents.

---

## Development and Deployment

- **Backend**:
  - Built with Node.js, Express, MongoDB, and JWT.
  - API can be tested with Postman or similar tools.
  - Serverless support using Firebase Cloud Functions.

- **Frontend**:
  - Built with React (Create React App).
  - Easily customizable and extensible for additional features.

- **Deployment**:
  - Backend can be deployed to Heroku, AWS, DigitalOcean, or Firebase.
  - Frontend can be deployed to Vercel, Netlify, or any static hosting service.

---

## Contributing

We welcome contributions, feedback, and bug reports!  
Please open an issue or submit a pull request to help improve QuickDesk.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Team

Developed and maintained by the **CodeFlux Team**.
