# Task Tracker

A simple task tracking application built with React (Vite) frontend and Node.js/Express backend, using SQLite for data persistence and Docker for containerization.

## Features

- Create, read, update, and delete tasks
- Task status management (pending, in-progress, completed)
- Priority levels (low, medium, high)
- Due date tracking
- Clean, responsive UI

## Tech Stack

- **Frontend**: React 19.2 with Vite 6.x
- **Backend**: Node.js 24.14.0 LTS with Express.js 5.2.1
- **Database**: SQLite 3.51.3
- **Containerization**: Docker & Docker Compose

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 24.14.0 LTS (for local development)

### Development

1. Clone the repository
2. Copy environment file: `cp .env.example .env`
3. Start the application: `npm run dev`

This will start all services using Docker Compose:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Local Development

For frontend-only development:
```bash
cd frontend && npm run dev
```

For backend-only development:
```bash
cd backend && npm start
```

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Project Structure

```
task-tracker/
├── frontend/          # React application
├── backend/           # Express.js API server
├── scripts/           # Build and deployment scripts
├── docs/             # Documentation
├── docker-compose.yml # Container orchestration
└── package.json      # Root package configuration
```

## Architecture

This application follows a microservices architecture with separate containers for:
- Frontend (React/Vite)
- Backend (Node.js/Express)
- Database (SQLite)

## Contributing

1. Follow the established code structure
2. Write tests for new features
3. Update documentation as needed
4. Ensure Docker builds work correctly

## License

MIT