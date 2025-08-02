# QuickDesk Backend - Express Server (MERN Stack)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB locally or use MongoDB Atlas

3. Create `.env` file with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quickdesk
JWT_SECRET=your-super-secret-jwt-key
```

4. Start the server:
```bash
npm start          # Production
npm run dev        # Development with nodemon
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tickets
- `POST /api/tickets` - Create ticket (end users)
- `GET /api/tickets/user` - Get user's tickets with filters
- `GET /api/tickets/agent` - Get agent tickets with queues
- `GET /api/tickets/:id` - Get ticket details
- `PUT /api/tickets/:id/status` - Update ticket status (agents)
- `POST /api/tickets/:id/replies` - Add reply
- `GET /api/tickets/:id/replies` - Get replies

### User Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings

### Dashboard
- `GET /api/user/dashboard` - End user dashboard
- `GET /api/agent/dashboard` - Agent dashboard
- `GET /api/metadata` - Get categories, priorities, statuses

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt-token>
```

## User Registration/Login

### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "end_user" // or "agent"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## Database Models

- **User**: Authentication, profile, settings
- **Ticket**: Support tickets with categories, priorities
- **TicketReply**: Threaded conversations
- **TicketShare**: Agent collaboration

## Features

✅ JWT Authentication
✅ Role-based access control
✅ Ticket management with filters
✅ User profiles and settings
✅ Dashboard analytics
✅ MongoDB integration
✅ Express.js REST API