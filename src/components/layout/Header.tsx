import React from 'react'
import { BellIcon, Bars3Icon } from '@heroicons/react/24/outline'
import { User } from '@/types'

interface HeaderProps {
  user: User
  onMenuToggle?: () => void
  alertsCount?: number
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onMenuToggle,
  alertsCount = 0
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-secondary-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 lg:hidden"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          )}
          
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
              {new Date().toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="text-sm text-secondary-600">
              {new Date().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-md text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100">
              <BellIcon className="w-6 h-6" />
              {alertsCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-danger-600 rounded-full">
                  {alertsCount > 99 ? '99+' : alertsCount}
                </span>
              )}
            </button>
          </div>
          
          {/* User Avatar */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-secondary-900">{user.nome}</p>
              <p className="text-xs text-secondary-600 capitalize">{user.tipo}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
