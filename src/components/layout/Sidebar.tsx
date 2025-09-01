import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { clsx } from 'clsx';
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  AcademicCapIcon,
  DocumentTextIcon,
  BellIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { User } from '@/types';

interface SidebarProps {
  user: User;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    name: 'Estudantes',
    href: '/estudantes',
    icon: UserGroupIcon,
    adminOnly: true
  },
  {
    name: 'Empresas',
    href: '/empresas',
    icon: BuildingOffice2Icon,
    adminOnly: true
  },
  {
    name: 'Orientadores',
    href: '/orientadores',
    icon: AcademicCapIcon,
    adminOnly: true
  },
  {
    name: 'Estágios Obrigatórios',
    href: '/estagios/obrigatorios',
    icon: DocumentTextIcon
  },
  {
    name: 'Estágios Não Obrigatórios',
    href: '/estagios/nao-obrigatorios',
    icon: DocumentTextIcon
  },
  {
    name: 'Central de Alertas',
    href: '/alertas',
    icon: BellIcon,
    adminOnly: true
  },
  {
    name: 'Certificados',
    href: '/certificados',
    icon: DocumentTextIcon
  },
  {
    name: 'Relatórios',
    href: '/relatorios',
    icon: ChartBarIcon
  },
  {
    name: 'Configurações',
    href: '/configuracoes',
    icon: CogIcon,
    adminOnly: true
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  isCollapsed = false, 
  onToggle 
}) => {
  const router = useRouter();
  const isAdmin = user?.tipo === 'administrador';

  // Filtrar itens de menu baseado no tipo de usuário
  const filteredMenuItems = menuItems.filter((item: MenuItem) => !item.adminOnly || isAdmin);

  const handleLogout = (): void => {
    // Limpar dados de autenticação
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Limpar cookies se existirem
      document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'user-data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    
    // Redirecionar para login
    router.push('/login');
  };

  const getInitials = (name: string): string => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div 
      className={clsx(
        'bg-primary-900 text-white h-screen flex flex-col transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-primary-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-900 font-bold text-sm">EP</span>
              </div>
              <span className="font-semibold text-lg">EstagioPro</span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mx-auto">
              <span className="text-primary-900 font-bold text-sm">EP</span>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="p-4 border-b border-primary-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {getInitials(user.nome)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.nome}</p>
              <p className="text-xs text-primary-300 capitalize">{user.tipo}</p>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredMenuItems.map((item: MenuItem) => {
          const isActive = router.pathname === item.href;
          const Icon = item.icon;

          return (
            <div key={item.name}>
              <Link href={item.href} legacyBehavior>
                <a 
                  className={clsx(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer',
                    isActive
                      ? 'bg-primary-700 text-white'
                      : 'text-primary-200 hover:bg-primary-800 hover:text-white',
                    isCollapsed ? 'justify-center' : 'space-x-3'
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </a>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-primary-800">
        <button
          type="button"
          onClick={handleLogout}
          className={clsx(
            'w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-primary-200 hover:bg-primary-800 hover:text-white transition-colors',
            isCollapsed ? 'justify-center' : 'space-x-3'
          )}
          title={isCollapsed ? 'Sair' : undefined}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  );
};