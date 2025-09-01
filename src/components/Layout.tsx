import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Estudantes', href: '/estudantes', icon: UserGroupIcon, adminOnly: true },
  { name: 'Empresas', href: '/empresas', icon: BuildingOfficeIcon, adminOnly: true },
  { name: 'Orientadores', href: '/orientadores', icon: AcademicCapIcon, adminOnly: true },
  { name: 'Estágios Obrigatórios', href: '/estagios/obrigatorios', icon: DocumentTextIcon },
  { name: 'Estágios Não Obrigatórios', href: '/estagios/nao-obrigatorios', icon: DocumentTextIcon },
  { name: 'Certificados', href: '/certificados', icon: DocumentCheckIcon },
  { name: 'Relatórios', href: '/relatorios', icon: ChartBarIcon },
  { name: 'Configurações', href: '/configuracoes', icon: CogIcon, adminOnly: true },
];

export default function Layout({ children }: LayoutProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirecionar para login se não autenticado
  if (!isAuthenticated && router.pathname !== '/login') {
    router.push('/login');
    return null;
  }

  // Não mostrar layout na página de login
  if (router.pathname === '/login') {
    return <>{children}</>;
  }

  const isAdmin = user?.tipo === 'administrador';
  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-secondary-600 bg-opacity-75 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"
            >
              <MobileSidebar
                user={user}
                menuItems={filteredMenuItems}
                currentPath={router.pathname}
                onClose={() => setSidebarOpen(false)}
                onLogout={handleLogout}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <DesktopSidebar
          user={user}
          menuItems={filteredMenuItems}
          currentPath={router.pathname}
          onLogout={handleLogout}
        />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

interface SidebarProps {
  user: any;
  menuItems: MenuItem[];
  currentPath: string;
  onLogout: () => void;
  onClose?: () => void;
}

function DesktopSidebar({ user, menuItems, currentPath, onLogout }: SidebarProps) {
  return (
    <div className="flex flex-col bg-primary-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-primary-800 px-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <span className="text-sm font-bold text-primary-900">EP</span>
          </div>
          <span className="text-lg font-semibold">EstagioPro</span>
        </div>
      </div>

      {/* User info */}
      <div className="border-b border-primary-800 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-700">
            <span className="text-sm font-medium">
              {user?.nome?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.nome}</p>
            <p className="text-xs text-primary-300 capitalize">{user?.tipo}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.name}
            item={item}
            isActive={currentPath === item.href}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-primary-800 p-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-primary-200 hover:bg-primary-800 hover:text-white transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}

function MobileSidebar({ user, menuItems, currentPath, onClose, onLogout }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-primary-900 text-white">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-primary-800 px-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
            <span className="text-sm font-bold text-primary-900">EP</span>
          </div>
          <span className="text-lg font-semibold">EstagioPro</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-2 hover:bg-primary-800"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* User info */}
      <div className="border-b border-primary-800 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-700">
            <span className="text-sm font-medium">
              {user?.nome?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">{user?.nome}</p>
            <p className="text-xs text-primary-300 capitalize">{user?.tipo}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.name}
            item={item}
            isActive={currentPath === item.href}
            onClick={onClose}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-primary-800 p-4">
        <button
          onClick={() => {
            onLogout();
            onClose?.();
          }}
          className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-primary-200 hover:bg-primary-800 hover:text-white transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  item: MenuItem;
  isActive: boolean;
  onClick?: () => void;
}

function SidebarItem({ item, isActive, onClick }: SidebarItemProps) {
  return (
    <Link href={item.href} onClick={onClick}>
      <span
        className={clsx(
          'flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary-700 text-white'
            : 'text-primary-200 hover:bg-primary-800 hover:text-white'
        )}
      >
        <item.icon className="h-5 w-5" />
        <span>{item.name}</span>
      </span>
    </Link>
  );
}

interface HeaderProps {
  user: any;
  onMenuClick: () => void;
}

function Header({ user, onMenuClick }: HeaderProps) {
  const now = new Date();

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="rounded-md p-2 text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 lg:hidden"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div>
            <h1 className="text-xl font-semibold text-secondary-900">
              Sistema de Controle de Estágio
            </h1>
            <p className="text-sm text-secondary-600">
              UFVJM - Universidade Federal dos Vales do Jequitinhonha e Mucuri
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Date and Time */}
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium text-secondary-900">
              {now.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="text-sm text-secondary-600">
              {now.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          {/* Notifications */}
          <button className="rounded-md p-2 text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900">
            <BellIcon className="h-6 w-6" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600">
              <span className="text-sm font-medium text-white">
                {user?.nome?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-secondary-900">{user?.nome}</p>
              <p className="text-xs text-secondary-600 capitalize">{user?.tipo}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
