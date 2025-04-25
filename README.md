# Employee Management System

## Overview

The Employee Management System is a full-stack application designed to manage employees, tasks, attendance, and other administrative functions. It consists of a React-based frontend and an ASP.NET Core backend.

---

## Features

- Employee management (CRUD operations).
- Task assignments and tracking.
- Attendance and leave management.
- Feedback and announcements.
- Real-time chat functionality.

---

## Project Structure

### Frontend

- **Path**: `employeemanagementsystem.client`
- **Technologies**: React, Vite, CSS.
- **Key Folders**:
  - `src/components`: Reusable UI components.
  - `src/Pages`: Application pages.
  - `src/services`: API integration.

### Backend

- **Path**: `EmployeeManagementSystem.Server`
- **Technologies**: ASP.NET Core, Entity Framework Core, SQL Server.
- **Key Folders**:
  - `Controllers`: API endpoints.
  - `Data`: Database models and migrations.
  - `Extensions`: Middleware and service extensions.

---

## Environment Setup

### Prerequisites

- **Frontend**: Node.js, npm.
- **Backend**: .NET SDK, SQL Server.

### Steps to Run

#### Frontend

1. Navigate to the client folder:
   ```bash
   cd employeemanagementsystem.client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

#### Backend

1. Navigate to the server folder:
   ```bash
   cd EmployeeManagementSystem.Server
   ```
2. Restore dependencies:
   ```bash
   dotnet restore
   ```
3. Run the application:
   ```bash
   dotnet run
   ```

---

## Database Configuration

### Local Database

- **Connection String**: Configured in `appsettings.Development.json`.
- Example:
  ```json
  "DefaultConnection": "Server=GARUD\\SQLEXPRESS;Database=EmployeeManagementSystem;Trusted_connection=true;TrustServerCertificate=true;"
  ```

### AWS RDS (Production)

- **Connection String**: Uncomment and configure the RDS connection string in `appsettings.Development.json`.
- Example:
  ```json
  "DefaultConnection": "Server=b2worlddbinstance.ch40gmgacg4r.ap-south-1.rds.amazonaws.com;Database=EMS;User Id=admin;Password=your_password;TrustServerCertificate=true;"
  ```

---

## Deployment

### Frontend

- **Hosting**: AWS S3 and CloudFront.
- **Build Command**:
  ```bash
  npm run build
  ```

### Backend

- **Hosting**: AWS Elastic Beanstalk.
- **Environment Variables**: Configure in Elastic Beanstalk environment settings.

---

## API Documentation

- **Swagger**: Available at `/swagger`.
- Example URL:
  ```
  http://localhost:5249/swagger
  ```

---

## Troubleshooting

### Common Issues

1. **Swagger Not Opening**:

   - Ensure `ASPNETCORE_ENVIRONMENT` is set to `Development`.
   - Access Swagger at `/swagger`.

2. **Database Connection Errors**:

   - Verify the connection string in `appsettings.Development.json`.
   - Ensure the database server is running.

3. **Frontend Build Issues**:
   - Clear `node_modules` and reinstall dependencies:
     ```bash
     rm -rf node_modules
     npm install
     ```

---

## Future Enhancements

- Role-based access control (RBAC).
- Enhanced reporting and analytics.
- Integration with third-party services (e.g., Slack, Zoom).
