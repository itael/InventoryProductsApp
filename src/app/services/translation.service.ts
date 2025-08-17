import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { LanguageService, Language } from './language.service';

interface Translations {
  [key: string]: {
    en: string;
    es: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations: Translations = {
    // Header and Navigation
    'app.title': {
      en: 'Inventory Products Admin',
      es: 'Administrador de Productos'
    },
    'nav.dashboard': {
      en: 'Dashboard',
      es: 'Panel Principal'
    },
    'nav.products': {
      en: 'Products',
      es: 'Productos'
    },
    'nav.users': {
      en: 'Users',
      es: 'Usuarios'
    },
    'nav.roles': {
      en: 'Roles',
      es: 'Roles'
    },
    'nav.logout': {
      en: 'Logout',
      es: 'Cerrar Sesión'
    },
    'nav.actions': {
      en: 'Actions',
      es: 'Acciones'
    },
    'common.clearSearch': {
      en: 'Clear Search',
      es: 'Limpiar Búsqueda'
    },
    'common.backToDashboard': {
      en: 'Back to Dashboard',
      es: 'Volver al Panel'
    },
    'common.confirmDelete': {
      en: 'Confirm Delete',
      es: 'Confirmar Eliminación'
    },
    'common.view': {
      en: 'View',
      es: 'Ver'
    },
    'common.edit': {
      en: 'Edit',
      es: 'Editar'
    },
    'common.delete': {
      en: 'Delete',
      es: 'Eliminar'
    },
    'common.search': {
      en: 'Search',
      es: 'Buscar'
    },
    'common.actions': {
      en: 'Actions',
      es: 'Acciones'
    },
    'common.cancel': {
      en: 'Cancel',
      es: 'Cancelar'
    },

    // Login
    'login.title': {
      en: '📦 Inventory Products Admin',
      es: '📦 Administrador de Productos'
    },
    'login.subtitle': {
      en: 'Sign in to manage your product inventory',
      es: 'Inicia sesión para gestionar tu inventario de productos'
    },
    'login.username': {
      en: 'Username',
      es: 'Usuario'
    },
    'login.password': {
      en: 'Password',
      es: 'Contraseña'
    },
    'login.signin': {
      en: 'Sign In',
      es: 'Iniciar Sesión'
    },
    'login.signing.in': {
      en: 'Signing in...',
      es: 'Iniciando sesión...'
    },
    'login.demo.credentials': {
      en: 'Demo Credentials:',
      es: 'Credenciales de Demostración:'
    },
    'login.placeholder.username': {
      en: 'Enter your username',
      es: 'Ingresa tu usuario'
    },
    'login.placeholder.password': {
      en: 'Enter your password',
      es: 'Ingresa tu contraseña'
    },

    // Dashboard
    'dashboard.welcome': {
      en: 'Welcome to your Dashboard',
      es: 'Bienvenido a tu Panel Principal'
    },
    'dashboard.overview': {
      en: 'Here\'s what\'s happening with your product inventory today.',
      es: 'Esto es lo que está pasando con tu inventario de productos hoy.'
    },
    'dashboard.stats.products': {
      en: 'Total Products',
      es: 'Productos Totales'
    },
    'dashboard.stats.roles': {
      en: 'Active Roles',
      es: 'Roles Activos'
    },
    'dashboard.stats.users': {
      en: 'Total Users',
      es: 'Usuarios Totales'
    },
    'dashboard.stats.revenue': {
      en: 'Total Revenue',
      es: 'Ingresos Totales'
    },
    'dashboard.stats.discount': {
      en: 'Avg. Discount',
      es: 'Descuento Promedio'
    },
    'dashboard.recent.products': {
      en: 'Recent Products',
      es: 'Productos Recientes'
    },
    'dashboard.quick.actions': {
      en: 'Quick Actions',
      es: 'Acciones Rápidas'
    },
    'dashboard.actions.add.product': {
      en: 'Add Product',
      es: 'Agregar Producto'
    },
    'dashboard.actions.create.role': {
      en: 'Create Role',
      es: 'Crear Rol'
    },
    'dashboard.actions.add.user': {
      en: 'Add User',
      es: 'Agregar Usuario'
    },
    'dashboard.actions.view.inventory': {
      en: 'View Inventory',
      es: 'Ver Inventario'
    },
    'dashboard.actions.manage.roles': {
      en: 'Manage Roles',
      es: 'Gestionar Roles'
    },
    'dashboard.actions.manage.users': {
      en: 'Manage Users',
      es: 'Gestionar Usuarios'
    },
    'dashboard.actions.view.stats': {
      en: 'View Statistics',
      es: 'Ver Estadísticas'
    },

    // Products
    'products.title': {
      en: '📦 Product Inventory',
      es: '📦 Inventario de Productos'
    },
    'products.add': {
      en: '➕ Add Product',
      es: '➕ Agregar Producto'
    },
    'products.create': {
      en: 'Create Product',
      es: 'Crear Producto'
    },
    'products.edit': {
      en: 'Edit Product',
      es: 'Editar Producto'
    },
    'products.detail': {
      en: 'Product Details',
      es: 'Detalles del Producto'
    },
    'products.search.placeholder': {
      en: 'Search products by name, description, or account...',
      es: 'Buscar productos por nombre, descripción o cuenta...'
    },
    'products.view.grid': {
      en: 'Grid View',
      es: 'Vista Cuadrícula'
    },
    'products.view.list': {
      en: 'List View',
      es: 'Vista Lista'
    },
    'products.loading': {
      en: 'Loading products...',
      es: 'Cargando productos...'
    },
    'products.empty.title': {
      en: 'No products found',
      es: 'No se encontraron productos'
    },
    'products.empty.subtitle': {
      en: 'Start by creating your first product.',
      es: 'Comienza creando tu primer producto.'
    },
    'products.empty.search': {
      en: 'Try adjusting your search criteria.',
      es: 'Intenta ajustar tus criterios de búsqueda.'
    },
    'products.empty.create.first': {
      en: '➕ Create Your First Product',
      es: '➕ Crear Tu Primer Producto'
    },
    'products.addProduct': {
      en: 'Add Product',
      es: 'Agregar Producto'
    },
    'products.addNewProduct': {
      en: '➕ Add New Product',
      es: '➕ Agregar Nuevo Producto'
    },
    'products.editProduct': {
      en: '✏️ Edit Product',
      es: '✏️ Editar Producto'
    },
    'products.backToProducts': {
      en: 'Back to Products',
      es: 'Volver a Productos'
    },
    'products.searchPlaceholder': {
      en: 'Search products by name, description, or account...',
      es: 'Buscar productos por nombre, descripción o cuenta...'
    },
    'products.gridView': {
      en: 'Grid View',
      es: 'Vista Cuadrícula'
    },
    'products.listView': {
      en: 'List View',
      es: 'Vista Lista'
    },
    'products.grid': {
      en: 'Grid',
      es: 'Cuadrícula'
    },
    'products.list': {
      en: 'List',
      es: 'Lista'
    },
    'products.loadingProducts': {
      en: 'Loading products...',
      es: 'Cargando productos...'
    },
    'products.loadingProduct': {
      en: 'Loading product...',
      es: 'Cargando producto...'
    },
    'products.savingProduct': {
      en: 'Saving product...',
      es: 'Guardando producto...'
    },
    'products.product': {
      en: 'Product',
      es: 'Producto'
    },
    'products.account': {
      en: 'Account',
      es: 'Cuenta'
    },
    'products.description': {
      en: 'Description',
      es: 'Descripción'
    },
    'products.price': {
      en: 'Price',
      es: 'Precio'
    },
    'products.unit': {
      en: 'Unit',
      es: 'Unidad'
    },
    'products.updated': {
      en: 'Updated',
      es: 'Actualizado'
    },
    'products.noProductsFound': {
      en: 'No products found',
      es: 'No se encontraron productos'
    },
    'products.createFirstProduct': {
      en: 'Start by creating your first product.',
      es: 'Comienza creando tu primer producto.'
    },
    'products.adjustSearchCriteria': {
      en: 'Try adjusting your search criteria.',
      es: 'Intenta ajustar tus criterios de búsqueda.'
    },
    'products.createFirstProductButton': {
      en: 'Create Your First Product',
      es: 'Crear Tu Primer Producto'
    },
    'products.productDetails': {
      en: 'Product Details',
      es: 'Detalles del Producto'
    },
    'products.productName': {
      en: 'Product Name',
      es: 'Nombre del Producto'
    },
    'products.namePlaceholder': {
      en: 'e.g., Premium Laptop',
      es: 'ej., Laptop Premium'
    },
    'products.accountCode': {
      en: 'Account Code',
      es: 'Código de Cuenta'
    },
    'products.accountPlaceholder': {
      en: 'e.g., PRD-001',
      es: 'ej., PRD-001'
    },
    'products.accountFormat': {
      en: 'Format: ABC-123',
      es: 'Formato: ABC-123'
    },
    'products.descriptionPlaceholder': {
      en: 'Describe the product features, specifications, or special characteristics...',
      es: 'Describe las características del producto, especificaciones o propiedades especiales...'
    },
    'products.pricingInformation': {
      en: 'Pricing Information',
      es: 'Información de Precios'
    },

    // Users
    'users.title': {
      en: 'User Management',
      es: 'Gestión de Usuarios'
    },
    'users.add': {
      en: 'Add User',
      es: 'Agregar Usuario'
    },
    'users.create': {
      en: 'Create User',
      es: 'Crear Usuario'
    },
    'users.edit': {
      en: 'Edit User',
      es: 'Editar Usuario'
    },
    'users.loading': {
      en: 'Loading users...',
      es: 'Cargando usuarios...'
    },
    'users.empty.title': {
      en: 'No users found',
      es: 'No se encontraron usuarios'
    },
    'users.joined': {
      en: 'Joined',
      es: 'Se unió'
    },
    'users.last.login': {
      en: 'Last login',
      es: 'Último acceso'
    },
    'users.never.logged': {
      en: 'Never logged in',
      es: 'Nunca ha iniciado sesión'
    },
    'users.addNewUser': {
      en: 'Add New User',
      es: 'Agregar Nuevo Usuario'
    },
    'users.active': {
      en: 'Active',
      es: 'Activo'
    },
    'users.inactive': {
      en: 'Inactive',
      es: 'Inactivo'
    },
    'users.role': {
      en: 'Role',
      es: 'Rol'
    },
    'users.neverLoggedIn': {
      en: 'Never logged in',
      es: 'Nunca ha iniciado sesión'
    },
    'users.loadingUsers': {
      en: 'Loading users...',
      es: 'Cargando usuarios...'
    },
    'users.confirmDeleteMessage': {
      en: 'Are you sure you want to delete the user',
      es: '¿Estás seguro de que quieres eliminar el usuario'
    },
    'users.deleteWarning': {
      en: 'This action cannot be undone and will remove all user data.',
      es: 'Esta acción no se puede deshacer y eliminará todos los datos del usuario.'
    },
    'users.deleting': {
      en: 'Deleting...',
      es: 'Eliminando...'
    },
    'users.deleteUser': {
      en: 'Delete User',
      es: 'Eliminar Usuario'
    },

    // Roles
    'roles.title': {
      en: 'Role Management',
      es: 'Gestión de Roles'
    },
    'roles.add': {
      en: 'Add Role',
      es: 'Agregar Rol'
    },
    'roles.create': {
      en: 'Create Role',
      es: 'Crear Rol'
    },
    'roles.edit': {
      en: 'Edit Role',
      es: 'Editar Rol'
    },
    'roles.loading': {
      en: 'Loading roles...',
      es: 'Cargando roles...'
    },
    'roles.empty.title': {
      en: 'No roles found',
      es: 'No se encontraron roles'
    },
    'roles.permissions': {
      en: 'Permissions',
      es: 'Permisos'
    },
    'roles.addNewRole': {
      en: 'Add New Role',
      es: 'Agregar Nuevo Rol'
    },
    'roles.active': {
      en: 'Active',
      es: 'Activo'
    },
    'roles.inactive': {
      en: 'Inactive',
      es: 'Inactivo'
    },
    'roles.created': {
      en: 'Created',
      es: 'Creado'
    },
    'roles.updated': {
      en: 'Updated',
      es: 'Actualizado'
    },
    'roles.loadingRoles': {
      en: 'Loading roles...',
      es: 'Cargando roles...'
    },
    'roles.confirmDeleteMessage': {
      en: 'Are you sure you want to delete the role',
      es: '¿Estás seguro de que quieres eliminar el rol'
    },
    'roles.deleteWarning': {
      en: 'This action cannot be undone and may affect users assigned to this role.',
      es: 'Esta acción no se puede deshacer y puede afectar a los usuarios asignados a este rol.'
    },
    'roles.deleting': {
      en: 'Deleting...',
      es: 'Eliminando...'
    },
    'roles.deleteRole': {
      en: 'Delete Role',
      es: 'Eliminar Rol'
    },

    // Common Actions
    'actions.view': {
      en: 'View',
      es: 'Ver'
    },
    'actions.edit': {
      en: 'Edit',
      es: 'Editar'
    },
    'actions.delete': {
      en: 'Delete',
      es: 'Eliminar'
    },
    'actions.search': {
      en: 'Search',
      es: 'Buscar'
    },
    'actions.create': {
      en: 'Create',
      es: 'Crear'
    },
    'actions.save': {
      en: 'Save',
      es: 'Guardar'
    },
    'actions.cancel': {
      en: 'Cancel',
      es: 'Cancelar'
    },
    'actions.back': {
      en: 'Back to Dashboard',
      es: 'Volver al Panel'
    },
    'actions.clear.search': {
      en: '🔄 Clear Search',
      es: '🔄 Limpiar Búsqueda'
    },
    'actions.list': {
      en: 'List',
      es: 'Lista'
    },

    // Common Fields
    'fields.name': {
      en: 'Name',
      es: 'Nombre'
    },
    'fields.description': {
      en: 'Description',
      es: 'Descripción'
    },
    'fields.price': {
      en: 'Price',
      es: 'Precio'
    },
    'fields.account': {
      en: 'Account',
      es: 'Cuenta'
    },
    'fields.unit': {
      en: 'Unit',
      es: 'Unidad'
    },
    'fields.updated': {
      en: 'Updated',
      es: 'Actualizado'
    },
    'fields.actions': {
      en: 'Actions',
      es: 'Acciones'
    },
    'fields.product': {
      en: 'Product',
      es: 'Producto'
    },
    'fields.firstname': {
      en: 'First Name',
      es: 'Nombre'
    },
    'fields.lastname': {
      en: 'Last Name',
      es: 'Apellido'
    },
    'fields.email': {
      en: 'Email',
      es: 'Correo Electrónico'
    },
    'fields.username': {
      en: 'Username',
      es: 'Usuario'
    },
    'fields.role': {
      en: 'Role',
      es: 'Rol'
    },
    'fields.status': {
      en: 'Status',
      es: 'Estado'
    },

    // Common Messages
    'messages.loading': {
      en: 'Loading...',
      es: 'Cargando...'
    },
    'messages.no.data': {
      en: 'No data available',
      es: 'No hay datos disponibles'
    },
    'messages.error': {
      en: 'An error occurred',
      es: 'Ha ocurrido un error'
    },
    'messages.success': {
      en: 'Operation completed successfully',
      es: 'Operación completada exitosamente'
    }
  };

  constructor(private languageService: LanguageService) {}

  translate(key: string): Observable<string> {
    return this.languageService.currentLanguage$.pipe(
      map(language => {
        const translation = this.translations[key];
        if (translation) {
          return translation[language] || translation.en || key;
        }
        return key;
      })
    );
  }

  translateSync(key: string): string {
    const language = this.languageService.getCurrentLanguage();
    const translation = this.translations[key];
    if (translation) {
      return translation[language] || translation.en || key;
    }
    return key;
  }

  // Helper method for synchronous interpolation
  translateSyncWithParams(key: string, params: { [key: string]: string }): string {
    let result = this.translateSync(key);
    Object.keys(params).forEach(param => {
      result = result.replace(`{{${param}}}`, params[param]);
    });
    return result;
  }

  // Helper method for interpolation
  translateWithParams(key: string, params: { [key: string]: string }): Observable<string> {
    return this.translate(key).pipe(
      map(text => {
        let result = text;
        Object.keys(params).forEach(param => {
          result = result.replace(`{{${param}}}`, params[param]);
        });
        return result;
      })
    );
  }
}
