import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { clsx } from 'clsx'
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  BellIcon,
  CertificateIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { AuthService } from '@/services/auth'
import { User } from '@/types'

interface SidebarProps {
  user: User
  isCollapsed?: boolean
  onToggle?: () => void
}

interface MenuItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  adminOnly?: boolean
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
    icon: BuildingOfficeIcon,
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
    icon: CertificateIcon
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
]

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  isCollapsed = false,
  onToggle
}) => {
  const router = useRouter()
  const isAdmin = user.tipo === 'administrador'
  
  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || isAdmin
  )
  
  const handleLogout = async () => {
    try {
      await AuthService.logout()
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }
  
  return (
    <div className={clsx(
      'flex flex-col bg-primary-900 text-white transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary-800">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary-900 font-bold text-sm">EP</span>
            </div>
            <span className="font-semibold">EstagioPro</span>
          </div>
        )}
        
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-primary-800 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isCollapsed ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"}
              />
            </svg>
          </button>
        )}
      </div>
      
      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-primary-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {user.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.nome}</p>
              <p className="text-xs text-primary-300 capitalize">{user.tipo}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {filteredMenuItems.map((item) => {
          const isActive = router.pathname === item.href || 
            (item.href !== '/dashboard' && router.pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-200 hover:bg-primary-800 hover:text-white'
              )}
            >
              <item.icon
                className={clsx(
                  'flex-shrink-0 w-5 h-5',
                  isCollapsed ? 'mx-auto' : 'mr-3',
                  isActive ? 'text-white' : 'text-primary-400 group-hover:text-white'
                )}
              />
              {!isCollapsed && item.name}
            </Link>
          )
        })}
      </nav>
      
      {/* Logout */}
      <div className="p-2 border-t border-primary-800">
        <button
          onClick={handleLogout}
          className={clsx(
            'group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md text-primary-200 hover:bg-primary-800 hover:text-white transition-colors'
          )}
        >
          <ArrowRightOnRectangleIcon
            className={clsx(
              'flex-shrink-0 w-5 h-5 text-primary-400 group-hover:text-white',
              isCollapsed ? 'mx-auto' : 'mr-3'
            )}
          />
          {!isCollapsed && 'Sair'}
        </button>
      </div>
    </div>
  )
}
