# WorkSphere

**WorkSphere** is a comprehensive Enterprise Resource Planning (ERP) and team collaboration platform designed to streamline business operations. It integrates project management, HR, finance, and support ticketing into a unified, multi-tenant application.

## 🚀 Features

### Core Modules
- **Multi-Tenancy**: Organization-based data isolation.
- **Role-Based Access Control (RBAC)**: secure access for Admins, HR, Team Leaders, and Employees.
- **Authentication**: JWT-based secure login and signup.

### 1. Project Management 📂
- **Projects & Tasks**: Create, assign, and track tasks with deadlines and priorities.
- **Kanban Boards**: Visualize workflow progress.
- **Team Collaboration**: dedicated workspaces for teams.

### 2. HR Management 👥
- **Employee Directory**: Centralized profile management.
- **Leave Management**: Request and approve leaves (Vacation, Sick, etc.).
- **Departments & Teams**: Organize workforce hierarchy.

### 3. Support & Ticketing 🎫
- **Helpdesk**: Raise and track support tickets.
- **Ticket Management**: Priority levels, status tracking, and commenting system.
- **Issue Types**: Bug reports, feature requests, and general support.

### 4. Finance (Coming Soon) 💰
- **Payroll**: Salary slip generation and management.
- **Expenses**: Reimbursement claims and tracking.

## 🛠 Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express.js, TypeScript.
- **Database**: PostgreSQL, Prisma ORM.
- **Authentication**: JSON Web Tokens (JWT), Bcrypt.

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### 1. Clone the Repository
```bash
git clone https://github.com/OshimPathan/WorkSphere.git
cd WorkSphere
```

### 2. Backend Setup
```bash
cd backend
npm install

# Configure Environment Variables
# Create a .env file based on .env.example
# DATABASE_URL="postgresql://user:password@localhost:5432/worksphere"
# JWT_SECRET="your_secret_key"

# Run Database Migrations
npx prisma migrate dev

# Seed Database (Optional)
npx prisma db seed

# Start Server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start Development Server
npm run dev
```

## 📚 API Documentation

The backend API is accessible at `http://localhost:5000/api`. Key endpoints include:

- `/auth`: Login and Signup.
- `/users`: Employee management.
- `/projects`: Project CRUD.
- `/tasks`: Task management.
- `/tickets`: Helpdesk and support tickets.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is licensed under the MIT License.
