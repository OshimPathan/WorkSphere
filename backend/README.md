# TaskFlow Pro - Backend

## Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Create a `.env` file with:
    ```env
    PORT=5000
    DATABASE_URL="postgresql://user:password@localhost:5432/taskflowpro"
    JWT_SECRET="your_secret_key"
    ```

3.  **Database Setup:**
    Ensure you have PostgreSQL running.
    ```bash
    # If you have Docker installed:
    docker-compose up -d

    # Run Migrations
    npx prisma migrate dev
    ```

4.  **Run Server:**
    ```bash
    npm run dev
    ```

## API Documentation

-   **Auth**: `/api/auth/register`, `/api/auth/login`
-   **Departments**: `/api/departments`
-   **Teams**: `/api/teams`
-   **Tasks**: `/api/tasks`

## Note on Docker
If `docker-compose` is not available, please install Docker Desktop or run a local PostgreSQL instance manually and update `DATABASE_URL` in `.env`.
