import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { AuthService } from '@/services/auth'
import { User } from '@/types'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userResponse = await AuthService.getCurrentUser()
        
        if (!userResponse.success || !userResponse.data) {
          router.push('/login')
          return
        }
        
        setUser(userResponse.data)
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    
    // Não verificar auth na página de login
    if (router.pathname === '/login') {
      setLoading(false)
      return
    }
    
    checkAuth()
  }, [router])
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-sm text-secondary-600">Carregando...</p>
        </div>
      </div>
    )
  }
  
  // Login page doesn't need layout
  if (router.pathname === '/login' || !user) {
    return <>{children}</>
  }
  
  return (
    <div className="min-h-screen bg-secondary-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${
        sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
      }`}>
        <Sidebar
          user={user}
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      
      {/* Overlay for mobile */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          user={user}
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
