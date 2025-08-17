# 📦 Inventory Products App

An Angular application for managing product inventory with comprehensive management features and role-based access control system.

## 🚀 Features

### Product Management
- **CRUD Operations**: Create, read, update, and delete products
- **Product Attributes**: 
  - Name and description
  - Account number for tracking
  - Price and original price
  - Discount percentage calculation
  - Unit of measurement (piece, box, unit, kg, liter, etc.)
- **Search Functionality**: Search products by name, description, or account
- **Inventory Tracking**: Monitor product updates and creation dates

### Role-Based Access Control
- **Role Management**: Create and manage user roles with specific permissions
- **Permission System**: Granular permissions for different actions (create, read, update, delete)
- **Resource-Based Security**: Permissions organized by resources (products, roles, permissions, dashboard)
- **Dynamic UI**: Interface adapts based on user permissions

### User Authentication
- **Login System**: Secure authentication with role-based access
- **Session Management**: Persistent login sessions
- **Demo Accounts**: Pre-configured accounts for testing

### Dashboard
- **Statistics Overview**: Total products, roles, revenue, and average discounts
- **Recent Activity**: Display recently updated products
- **Quick Actions**: Easy access to common inventory tasks
- **Responsive Design**: Mobile-friendly interface

## 🔐 Demo Credentials

The application includes three demo accounts with different permission levels:

- **Administrator**: `admin` / `admin123` (Full system access)
- **Manager**: `manager` / `manager123` (Product management access)
- **Employee**: `employee` / `employee123` (Read-only access)

## 🛠 Technology Stack

- **Framework**: Angular (Latest version with SSR and Zoneless)
- **Language**: TypeScript
- **Styling**: SCSS with responsive design
- **State Management**: Angular Services with RxJS
- **Architecture**: Standalone components with lazy-loaded feature modules

## 📱 Application Structure

```
src/
├── app/
│   ├── components/          # Shared components
│   │   ├── login/          # Authentication
│   │   └── dashboard/      # Main dashboard
│   ├── features/           # Feature modules
│   │   ├── products/       # Product management
│   │   ├── roles/          # Role management
│   │   └── permissions/    # Permission management
│   ├── models/             # TypeScript interfaces
│   ├── services/           # Business logic and data services
│   └── app.routes.ts       # Application routing
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository** (if using git):
```bash
git clone <repository-url>
# Navigate to project directory
cd InventoryProductsApp
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
ng serve
```

4. **Open your browser** and navigate to `http://localhost:4200/`

### First Steps

1. **Login** using one of the demo accounts
2. **Explore the Dashboard** to see system statistics
3. **Manage Products** - Create, edit, and delete ice cream products
4. **Configure Roles** - Set up user roles and permissions (admin only)
5. **Test Permissions** - Switch between different user accounts to see role-based access

## 🧪 Development

### Code Scaffolding

Generate new components:
```bash
ng generate component component-name
```

Generate new services:
```bash
ng generate service service-name
```

### Building for Production

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests

```bash
ng test
```

### Code Quality

```bash
ng lint
```

## 🏗 Architecture Decisions

- **Standalone Components**: Utilizes Angular's latest standalone component architecture
- **Feature Modules**: Organized by business domains with lazy loading
- **Service-Based State**: Uses Angular services with RxJS for state management
- **Mock Data**: Includes comprehensive mock data for development and demo purposes
- **Responsive Design**: Mobile-first approach with SCSS styling

## 📝 API Integration

Currently configured with mock services. To integrate with a real API:

1. Update service files in `src/app/services/`
2. Replace mock data with HTTP client calls
3. Configure authentication interceptors
4. Update error handling for network requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For questions or support, please refer to the Angular documentation or create an issue in the repository.

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
