# Copilot Instructions for Heladeria Admin App

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is an Angular application for managing an ice cream shop (heladeria) with inventory management and role-based access control.

## Project Context
- **Framework**: Angular (latest version with SSR and zoneless)
- **Language**: TypeScript
- **Styling**: SCSS
- **State Management**: Angular Services with RxJS
- **Architecture**: Feature modules with shared components

## Key Features
1. **Ice Cream Product Management**
   - CRUD operations for ice cream products
   - Properties: name, description, account, price, original price, discount, unit of measurement
   
2. **Role Management**
   - CRUD operations for user roles
   - Role-based permissions for pages and actions
   
3. **Permission System**
   - Granular permissions for different actions
   - Role-permission associations

## Code Style Guidelines
- Use Angular standalone components
- Follow Angular style guide conventions
- Use reactive programming patterns with RxJS
- Implement proper error handling and loading states
- Use TypeScript interfaces for type safety
- Follow SCSS BEM methodology for styling
