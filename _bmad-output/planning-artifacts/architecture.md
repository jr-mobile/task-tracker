---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ["prd.md"]
workflowType: 'architecture'
project_name: task-tracker
user_name: Jon
date: 2026-03-22
lastStep: 8
status: 'complete'
completedAt: '2026-03-22'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The application requires core CRUD operations for task management: adding new tasks, marking tasks complete, deleting tasks, and managing optional due dates. Data must persist using SQLite database with guaranteed data integrity across application restarts. The entire application must run successfully in a Docker environment.

**Non-Functional Requirements:**
- Reliability: Zero data loss, error-free CRUD operations
- Performance: Web interface loads within 2 seconds
- Deployment: Seamless Docker containerization
- Data Integrity: Clean shutdown preserves all task data
- Stability: No crashes during normal usage
- Validation: Invalid due dates must be rejected consistently across API and UI

**Scale & Complexity:**
- Primary domain: Web application with backend API
- Complexity level: Low (standard CRUD with database persistence)
- Estimated architectural components: 3 (frontend, backend, database)

### Technical Constraints & Dependencies

- Must use SQLite for data persistence
- Docker containerization required
- React frontend with Vite build tool
- Node.js/Express backend
- No external services or APIs required for MVP

### Cross-Cutting Concerns Identified

- Data persistence and integrity across container lifecycle
- Docker environment consistency and portability
- Error handling for database operations
- Clean application startup and shutdown processes

## Starter Template Evaluation

### Recommended Starter Options

**Frontend: Vite React Template**
- **Technology Stack:** React 19.2, Vite 6.x, JavaScript/TypeScript
- **Architectural Decisions Made:** 
  - Modern React with hooks and concurrent features
  - Fast HMR (Hot Module Replacement) for development
  - Optimized production builds with code splitting
  - Minimal configuration, extensible with plugins
- **Project Structure:** Standard Vite layout with src/, public/, and build output
- **Development Experience:** Instant startup, fast rebuilds, built-in dev server
- **Maintenance Status:** Actively maintained by Vite team, frequent updates

**Backend: Express.js Generator**
- **Technology Stack:** Node.js 24.14.0 LTS, Express 5.2.1
- **Architectural Decisions Made:**
  - MVC pattern with routes, controllers, and middleware
  - RESTful API structure ready
  - Error handling and logging setup
  - Static file serving and CORS configured
- **Project Structure:** Organized with routes/, views/, public/, and bin/ directories
- **Development Experience:** Generator creates complete skeleton, easy to extend
- **Maintenance Status:** Express is stable, widely adopted, regular security updates

**Database: SQLite with sqlite3**
- **Technology Stack:** SQLite 3.51.3, sqlite3 npm package
- **Architectural Decisions Made:**
  - Embedded database, no separate server process
  - File-based storage with ACID transactions
  - SQL interface with prepared statements
  - Cross-platform compatibility
- **Project Structure:** Database file in project root or data/ directory
- **Development Experience:** Simple setup, no configuration needed
- **Maintenance Status:** SQLite is mature, stable, and widely used

**Containerization: Docker + Docker Compose**
- **Technology Stack:** Docker latest, docker-compose
- **Architectural Decisions Made:**
  - Multi-service architecture with separate containers
  - Networking between frontend, backend, and database
  - Volume mounting for data persistence
  - Environment-based configuration
- **Project Structure:** docker-compose.yml in root, Dockerfile per service
- **Development Experience:** Consistent environments, easy deployment
- **Maintenance Status:** Docker is industry standard, active development

### CLI Commands for Setup

```bash
# Frontend setup
npm create vite@latest frontend -- --template react

# Backend setup  
npx express-generator backend
cd backend && npm install

# Database setup
npm install sqlite3

# Docker setup
# Create docker-compose.yml and Dockerfiles manually
```

### Why This Starter Stack

This combination provides:
- **Modern Development:** Vite's speed and React's ecosystem
- **Simple Backend:** Express's minimalism matches your MVP scope
- **Reliable Data:** SQLite's embedded nature fits containerized apps
- **Easy Deployment:** Docker ensures consistent environments
- **Low Complexity:** Aligns with your low-complexity classification
- **Future-Proof:** All technologies are actively maintained and widely adopted

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:** 15 areas where AI agents could make different choices that would cause integration issues

### Naming Patterns

**Database Naming Conventions:**
- Tables: snake_case (e.g., `user_tasks`, `task_categories`) - follows SQL conventions and avoids case sensitivity issues
- Columns: snake_case (e.g., `user_id`, `task_title`, `created_at`) - consistent with SQLite best practices
- Foreign keys: `{referenced_table}_id` format (e.g., `user_id`, `category_id`) - clear relationship indication
- Indexes: `idx_{table}_{column}` format (e.g., `idx_user_tasks_user_id`) - predictable and searchable

**API Naming Conventions:**
- Endpoints: plural nouns with RESTful patterns (e.g., `/api/tasks`, `/api/users`) - standard REST conventions
- Route parameters: `:id` format (e.g., `/api/tasks/:id`) - Express.js standard
- Query parameters: camelCase (e.g., `userId`, `isCompleted`) - JavaScript convention for API consumers
- Headers: `X-Custom-Header` format for custom headers - follows HTTP standards

**Code Naming Conventions:**
- React components: PascalCase (e.g., `TaskList`, `UserProfile`) - React standard
- Files: kebab-case for components (e.g., `task-list.tsx`), camelCase for utilities (e.g., `apiClient.ts`)
- Functions/variables: camelCase (e.g., `getUserTasks`, `taskTitle`) - JavaScript standard
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`) - clear constant identification

### Structure Patterns

**Project Organization:**
- Tests: Co-located with source files using `.test.ts` suffix (e.g., `TaskList.test.tsx` next to `TaskList.tsx`) - easier maintenance and refactoring
- Components: Organized by feature in `/src/components/{feature}/` directories (e.g., `/src/components/tasks/`, `/src/components/auth/`)
- Shared utilities: `/src/lib/` directory for reusable functions, `/src/hooks/` for custom React hooks
- Services: `/src/services/` for API clients and business logic

**File Structure Patterns:**
- Configuration: Root-level for Docker (`docker-compose.yml`), environment files (`.env.example`), and build configs
- Static assets: `/public/` for images/icons, `/src/assets/` for component-specific assets
- Documentation: `/docs/` for user docs, inline JSDoc for code documentation

### Format Patterns

**API Response Formats:**
- Success responses: Direct data objects (e.g., `{id: 1, title: "Task"}`) - simple and predictable
- Error responses: `{error: {message: "Error description", code: "ERROR_CODE"}}` - consistent error handling
- Date formats: ISO 8601 strings (e.g., "2024-01-15T10:30:00Z") - universal compatibility
- Pagination: `{data: [...], pagination: {page: 1, limit: 10, total: 50}}` - standard pagination structure

**Data Exchange Formats:**
- JSON fields: camelCase (e.g., `userId`, `taskTitle`) - JavaScript convention
- Booleans: true/false literals - clear and unambiguous
- Null values: Explicit null for missing data, empty arrays/objects for collections
- Single items: Objects, not arrays (e.g., `{id: 1, title: "Task"}` not `[{id: 1, title: "Task"}]`)

### Communication Patterns

**Event System Patterns:**
- Event naming: dot-separated lowercase (e.g., `task.created`, `user.updated`) - follows Node.js conventions
- Event payloads: Consistent structure with `type`, `data`, and optional `metadata` fields
- State updates: Immutable patterns using spread operators and array methods - prevents side effects

**State Management Patterns:**
- Local state: React useState/useReducer for component-specific state
- Global state: Context API for app-wide state, custom hooks for state logic
- Actions: Descriptive names (e.g., `SET_TASKS_LOADING`, `UPDATE_TASK`) - clear intent

### Process Patterns

**Error Handling Patterns:**
- Global error boundary: React Error Boundary component for UI errors
- API errors: Centralized error handling in API client with user-friendly messages
- Validation: Client-side validation with consistent error display patterns
- Logging: Structured logging with levels (error, warn, info) and consistent formats

**Loading State Patterns:**
- Component-level: `isLoading` boolean state with conditional rendering
- Global: Loading context for full-app loading states (e.g., initial data fetch)
- UI patterns: Skeleton loaders for lists, spinners for actions - consistent user experience

### Enforcement Guidelines

**All AI Agents MUST:**
- Follow established naming conventions in all code generation
- Use the defined project structure for new files and components
- Implement consistent API response formats across all endpoints
- Apply error handling patterns uniformly throughout the application
- Use the specified state management approaches for data flow

**Pattern Enforcement:**
- Code reviews will check for pattern compliance
- Pattern violations documented in commit messages with "PATTERN:" prefix
- Patterns can be updated through architecture review process

### Pattern Examples

**Good Examples:**
```typescript
// Database table
CREATE TABLE user_tasks (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

// API endpoint
app.get('/api/tasks/:id', async (req, res) => {
  const task = await getTaskById(req.params.id);
  res.json(task);
});

// React component
const TaskList = ({ tasks, isLoading }) => {
  if (isLoading) return <TaskListSkeleton />;
  return <div>{tasks.map(task => <TaskItem key={task.id} task={task} />)}</div>;
};
```

**Anti-Patterns:**
- Mixing snake_case and camelCase in database schemas
- Inconsistent error response formats across endpoints
- Scattered utility functions without centralized organization
- Direct state mutations instead of immutable updates

## Project Structure & Boundaries

### Complete Project Directory Structure

```
task-tracker/
├── README.md                           # Project overview and setup instructions
├── docker-compose.yml                  # Multi-service container orchestration
├── docker-compose.dev.yml              # Development environment configuration
├── .env.example                        # Environment variables template
├── .gitignore                         # Git ignore patterns
├── docs/                              # Documentation
│   ├── api.md                         # API documentation
│   └── deployment.md                  # Deployment guide
├── frontend/                          # React/Vite frontend application
│   ├── package.json                   # Frontend dependencies and scripts
│   ├── vite.config.js                 # Vite build configuration
│   ├── index.html                     # Main HTML template
│   ├── public/                        # Static assets
│   │   └── favicon.ico                # App favicon
│   └── src/
│       ├── main.tsx                   # React application entry point
│       ├── App.tsx                    # Main app component
│       ├── index.css                  # Global styles
│       ├── components/
│       │   ├── tasks/
│       │   │   ├── TaskList.tsx       # Task list component
│       │   │   ├── TaskList.test.tsx  # Task list tests
│       │   │   ├── TaskItem.tsx       # Individual task component
│       │   │   ├── TaskItem.test.tsx  # Task item tests
│       │   │   ├── TaskForm.tsx       # Add/edit task form
│       │   │   ├── TaskForm.test.tsx  # Task form tests
│       │   │   └── index.ts           # Task component exports
│       │   └── ui/
│       │       ├── Button.tsx         # Reusable button component
│       │       ├── Input.tsx          # Reusable input component
│       │       └── Loading.tsx        # Loading spinner component
│       ├── services/
│       │   ├── apiClient.ts           # API client for backend communication
│       │   └── taskService.ts         # Task-specific API calls
│       ├── lib/
│       │   ├── utils.ts               # Utility functions
│       │   └── constants.ts           # App constants
│       ├── hooks/
│       │   ├── useTasks.ts            # Custom hook for task operations
│       │   └── useApi.ts              # Custom hook for API state
│       └── types/
│           └── index.ts                # TypeScript type definitions
├── backend/                           # Node/Express backend API
│   ├── package.json                   # Backend dependencies and scripts
│   ├── server.js                      # Express server entry point
│   ├── Dockerfile                     # Backend container configuration
│   ├── data/                          # Database files
│   │   └── tasks.db                   # SQLite database file
│   ├── routes/
│   │   ├── tasks.js                   # Task API routes
│   │   └── index.js                   # Route index
│   ├── controllers/
│   │   └── taskController.js          # Task business logic
│   ├── models/
│   │   └── Task.js                    # Task data model
│   ├── middleware/
│   │   ├── cors.js                    # CORS configuration
│   │   ├── errorHandler.js            # Global error handling
│   │   └── validation.js              # Request validation
│   ├── services/
│   │   └── database.js                # Database connection and queries
│   ├── utils/
│   │   ├── logger.js                  # Logging utility
│   │   └── response.js                # API response helpers
│   └── tests/
│       ├── unit/
│       │   ├── controllers/
│       │   └── models/
│       └── integration/
│           └── routes/
└── scripts/                           # Utility scripts
    ├── init-db.js                     # Database initialization
    └── seed-data.js                   # Sample data seeding
```

### Architectural Boundaries

**API Boundaries:**
- External API: `/api/tasks/*` endpoints exposed by backend service
- Internal service: Database service accessible only within backend container
- Authentication: No auth boundaries (MVP), future extension point
- Data access: SQLite database file boundary within backend container

**Component Boundaries:**
- Frontend components: React components communicate via props and custom hooks
- Service layer: API client handles all backend communication
- State management: Local component state with future Context API extension
- Event system: React state updates for component communication

**Service Boundaries:**
- Frontend service: API client as single point of backend communication
- Backend service: Express routes as single entry point for all API calls
- Database service: SQLite connection managed by database service module
- Container boundaries: Docker networks define service communication paths

**Data Boundaries:**
- Database schema: Single `tasks` table with defined columns
- API data format: JSON with camelCase fields and ISO date strings
- Component data: React props and state with TypeScript interfaces
- File persistence: SQLite database file with ACID transaction boundaries

## Data Model & API Contract Updates

### Canonical Task Entity

The `Task` entity remains the single domain model for the MVP. Due dates are an optional attribute on the task, not a separate reminder or scheduling subsystem.

**Database shape:**
- Table: `tasks`
- Primary key: `id TEXT`
- Required fields: `title`, `status`, `priority`, `created_at`, `updated_at`
- Optional fields: `description`, `due_date`

**Database column contract:**

| Column | Type | Null | Notes |
| --- | --- | --- | --- |
| `id` | `TEXT` | No | UUID string |
| `title` | `TEXT` | No | Non-empty trimmed title |
| `description` | `TEXT` | Yes | Optional free text |
| `status` | `TEXT` | No | Enum: `pending`, `in-progress`, `completed` |
| `priority` | `TEXT` | No | Enum: `low`, `medium`, `high` |
| `due_date` | `TEXT` | Yes | ISO-style date string in `YYYY-MM-DD` format |
| `created_at` | `TEXT` | No | ISO 8601 timestamp |
| `updated_at` | `TEXT` | No | ISO 8601 timestamp |

**Architectural decisions:**
- `due_date` is stored as nullable text because SQLite has no strict native date type and the app does not require timezone-aware scheduling in MVP.
- The API should treat `due_date` as a date-only field, not a datetime.
- `null` represents "no due date". Empty strings should be normalized to `null` before persistence.

### API Contract

The backend continues to expose a simple REST surface under `/api/tasks`. Due date support is folded into the existing create and update flows rather than introducing new endpoints.

**Endpoints:**
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

**Response shape:**

```json
{
  "id": "8b2d6d53-8e74-4a6d-9f11-bf8c7b4aa001",
  "title": "Prepare sprint demo",
  "description": "Collect screenshots and notes",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-03-30",
  "createdAt": "2026-03-22T14:00:00.000Z",
  "updatedAt": "2026-03-22T14:00:00.000Z"
}
```

**Request contract:**
- `POST /api/tasks`
  - Required: `title`
  - Optional: `description`, `status`, `priority`, `dueDate`
- `PUT /api/tasks/:id`
  - All fields optional
  - `dueDate: null` clears the due date

**Validation rules:**
- `title` must be a non-empty string after trimming
- `status` must be one of the supported enum values
- `priority` must be one of the supported enum values
- `dueDate` must be either:
  - omitted
  - `null`
  - a valid calendar date in `YYYY-MM-DD` format

**Error handling contract:**
- Invalid payloads return `400 Bad Request`
- Missing tasks return `404 Not Found`
- Persistence or unexpected failures return `500 Internal Server Error`

### Mapping Rules Between Layers

To avoid inconsistency between storage and API layers, the following mapping is authoritative:

- Database columns use `snake_case`
- API payloads use `camelCase`
- `due_date` in SQLite maps to `dueDate` in API responses and requests
- `created_at` maps to `createdAt`
- `updated_at` maps to `updatedAt`

This preserves the existing architecture rule: storage conventions follow SQL norms, while transport contracts follow JavaScript client expectations.

### Requirements to Structure Mapping

**Core Task Management (Primary Epic):**
- Components: `frontend/src/components/tasks/` - All task UI components
- Services: `frontend/src/services/taskService.ts` - Task CRUD operations
- API Routes: `backend/routes/tasks.js` - RESTful task endpoints
- Database: `backend/data/tasks.db` - SQLite task persistence
- Tests: Co-located `.test.tsx` files in frontend, `backend/tests/` directories
- Task schema: optional due-date support in both storage and API serialization

**Data Persistence (Cross-Cutting):**
- Models: `backend/models/Task.js` - Task data structure
- Database service: `backend/services/database.js` - SQLite operations
- Initialization: `scripts/init-db.js` - Schema setup
- Migration: Database file in `backend/data/` - Simple file-based versioning
- Validation: shared date validation rules enforced before persistence

**Docker Deployment (Infrastructure):**
- Orchestration: Root `docker-compose.yml` - Service definitions
- Containers: `backend/Dockerfile` - Backend containerization
- Volumes: Database data persistence in Docker volumes
- Networking: Internal container network for frontend-backend communication

### Integration Points

**Internal Communication:**
- Frontend-Backend: HTTP REST API calls via `apiClient.ts`
- Component-Component: React props and custom hooks
- Service-Service: Direct function calls within backend
- Database-Application: SQLite queries through database service

**External Integrations:**
- Docker networking: Container-to-container communication
- Volume mounting: Persistent database storage
- Port mapping: Host access to frontend and backend services
- Environment variables: Configuration injection via Docker

**Data Flow:**
- User Action → React Component → Custom Hook → API Service → HTTP Request → Express Route → Controller → Database Service → SQLite Query → Response Flow (reverse)
- Due date normalization occurs before persistence and before API serialization, so the client sees a stable `null | YYYY-MM-DD` contract

### File Organization Patterns

**Configuration Files:**
- Root level: `docker-compose.yml`, `.env.example` for infrastructure
- Frontend: `vite.config.js`, `package.json` for build and dependencies
- Backend: `package.json` for runtime dependencies

**Source Organization:**
- Feature-based: Components grouped by feature (tasks)
- Layer-based: Backend separated into routes, controllers, services, models
- Utility-first: Shared functions in `lib/` and `utils/` directories

**Test Organization:**
- Co-located: Frontend tests next to components (`.test.tsx`)
- Structured: Backend tests in `tests/unit/` and `tests/integration/` subdirectories
- Coverage: Unit tests for individual functions, integration for API endpoints

**Asset Organization:**
- Static: `frontend/public/` for unchanging assets (favicon, icons)
- Dynamic: `frontend/src/assets/` for component-specific assets (future use)
- Build output: Vite handles optimization and bundling automatically

### Development Workflow Integration

**Development Server Structure:**
- Frontend: `npm run dev` in `frontend/` starts Vite dev server on port 5173
- Backend: `npm start` in `backend/` starts Express server on port 3001
- Database: SQLite file created automatically on first run
- Docker: `docker-compose up` starts all services with hot reload

**Build Process Structure:**
- Frontend: Vite builds optimized bundle to `dist/` directory
- Backend: No build step, runs directly from source
- Docker: Multi-stage builds for production optimization
- Assets: Vite handles code splitting, minification, and asset optimization

**Deployment Structure:**
- Docker images: Separate images for frontend (nginx) and backend (Node.js)
- Volumes: Database persistence through named Docker volumes
- Networking: Internal network for service communication, exposed ports for external access
- Environment: Production environment variables via Docker secrets or configs

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices are fully compatible: React 19.2 works seamlessly with Vite 6.x, Node.js 24.14.0 LTS supports Express 5.2.1, SQLite 3.51.3 integrates cleanly with Node.js, and Docker provides consistent containerization across all services. No version conflicts or integration issues identified.

**Pattern Consistency:**
Implementation patterns perfectly align with technology choices: snake_case database naming matches SQLite conventions, RESTful API patterns work naturally with Express, React component patterns leverage modern hooks, and Docker container boundaries respect service separation. All patterns reinforce rather than conflict with architectural decisions.

**Structure Alignment:**
Project structure fully supports all architectural decisions: feature-based component organization enables React development patterns, layered backend structure supports Express MVC approach, co-located testing aligns with modern development practices, and Docker orchestration enables the defined service boundaries.

### Requirements Coverage Validation ✅

**Functional Requirements Coverage:**
All core CRUD operations (create, read, update, delete tasks) are fully supported through the defined API endpoints, database schema, and React component structure. Task completion marking, deletion, and due-date creation/edit/clearing are explicitly handled in the API contract and component interactions.

**Non-Functional Requirements Coverage:**
- Reliability: SQLite ACID transactions and Express error handling ensure zero data loss
- Performance: Vite's optimized builds and Express middleware support sub-2-second load times
- Deployment: Docker containerization provides seamless deployment with volume persistence
- Data Integrity: SQLite file-based storage with proper transaction handling
- Stability: Comprehensive error boundaries and validation prevent crashes

**Cross-Cutting Concerns Coverage:**
Data persistence across container lifecycles is addressed through Docker volumes, environment consistency through docker-compose, database error handling through middleware, clean startup/shutdown through proper Express server management, and due-date validation through a shared request-contract layer.

### Implementation Readiness Validation ✅

**Decision Completeness:**
All critical decisions are documented with specific versions and rationales. Technology stack is fully specified with current stable versions. Integration approaches are clearly defined with Docker networking and API communication patterns.

**Structure Completeness:**
Project structure is comprehensive and specific, with every directory and key file explicitly defined. Component boundaries are clearly established through service separation. Integration points are well-mapped through API client patterns and database service layers.

**Pattern Completeness:**
All major conflict points are addressed: database naming prevents schema conflicts, API patterns ensure consistent endpoints, code naming conventions enable team consistency, and communication patterns prevent state management issues. Concrete examples are provided for all critical patterns.

### Gap Analysis Results

**Critical Gaps:** None identified - all blocking issues have been resolved through architectural decisions.

**Important Gaps:** None identified - all significant implementation concerns are addressed.

**Minor Gaps:**
- Authentication system foundation (marked as future extension point)
- Advanced error monitoring/logging (basic logging implemented)
- Performance monitoring hooks (infrastructure ready for addition)
- API documentation generation (structure supports OpenAPI/Swagger)

### Validation Issues Addressed

No critical or important issues found during validation. The architecture demonstrates strong coherence between all decisions, complete requirements coverage, and high implementation readiness. All identified gaps are minor and don't impact MVP functionality.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High - comprehensive validation shows strong architectural foundation

**Key Strengths:**
- Complete technology stack alignment with no conflicts
- Thorough pattern documentation preventing AI agent inconsistencies
- Detailed project structure enabling immediate development start
- Strong requirements coverage ensuring MVP delivery
- Docker-based deployment ready for production

**Areas for Future Enhancement:**
- Authentication system expansion
- Advanced monitoring and logging
- Performance optimization features
- API documentation automation

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Priority:**
Run `docker-compose up` to start the development environment, then implement the database schema and basic API endpoints following the defined patterns.
