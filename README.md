# QuickDesk

QuickDesk is a comprehensive, full-featured customer support ticketing platform built using a modular Node.js (Express) backend and a modern React frontend. It enables organizations to efficiently manage customer support requests, optimize agent workflows, and deliver excellent support experiences through intuitive interfaces and robust backend services.

> **Project submission for Odoo Hackathon 2025**

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Development and Deployment](#development-and-deployment)
- [Contributing](#contributing)
- [License](#license)
- [Team](#team)

---

## Features

- **Secure Authentication & Authorization**  
  JWT-based authentication with role-based access controls for end-users and agents.

- **Advanced Ticket Management**  
  Users can create, view, filter, and manage support tickets. Agents can update statuses and collaborate on tickets through sharing and threaded discussions.

- **User Profiles & Customizable Settings**  
  Each user and agent can manage their own profile, personal details, and notification preferences.

- **Agent Collaboration**  
  Tickets can be shared among agents, allowing teamwork on complex issues. Internal notes and threaded replies facilitate clear communication.

- **Dashboards & Analytics**  
  Real-time dashboards for users and agents, providing key insights into ticket statuses, response times, and other support metrics.

- **RESTful API**  
  Clean REST API built with Express.js for easy integration with other systems or custom frontends.

- **Responsive Multi-Page UI**  
  The frontend is a multi-page React application, delivering a fast, interactive, and mobile-friendly user experience.

- **Cloud & On-Premise Ready**  
  Backend supports both traditional server hosting and serverless cloud deployments (e.g., Firebase Cloud Functions).

- **Highly Extensible**  
  Modular codebase designed for easy feature additions, third-party integrations, and workflow customizations.

---

## Architecture

QuickDesk is designed for scalability and maintainability with a clear separation of concerns:

- **Backend**:  
  Node.js & Express REST API, JWT for authentication, optional serverless deployment.

- **Frontend**:  
  Multi-page React application (not SPA), providing a modern and dynamic user interface.

- **No MongoDB or Bootstrap**:  
  The stack is kept minimal and flexible — data persistence and UI frameworks are left open for extension as per deployment needs.

---

## Project Structure

The repository is organized as follows:

```
Quickdesk/
│
├── backend/
│   ├── functions/      # Serverless (Firebase) functions support and cloud configuration
│   ├── lib/            # Compiled output or shared library code
│   ├── node_modules/   # Backend dependencies
│   ├── src/            # Main backend source code (Express routes, controllers, middleware, etc.)
│   ├── .firebaserc     # Firebase project configuration
│   ├── .gitignore      # Git ignore rules for backend
│   ├── firebase.json   # Firebase settings and deployment config
│   ├── package-lock.json
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── node_modules/   # Frontend dependencies
│   ├── public/         # Static assets and the HTML template
│   ├── src/            # Main frontend source code (React pages, components, hooks, state, etc.)
│   ├── .gitignore      # Git ignore rules for frontend
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   └── tsconfig.json
│
└── .git/               # Git repository data (not included in source control)
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
   Create a `.env` file in the `backend` directory for your environment variables (e.g., PORT, JWT_SECRET).

3. **Run the backend server**
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

## Development and Deployment

- **Backend**:
  - Built with Node.js, Express, and JWT.
  - Serverless support using Firebase Cloud Functions.

- **Frontend**:
  - Built as a multi-page application in React.
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

> **This project is an official entry for Odoo Hackathon 2025.**
