import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ApiService } from '@/services/api'
import { DashboardStats } from '@/types'
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  BellIcon,
  CertificateIcon
} from '@heroicons/react/24/outline'

interface StatCardProps {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo'
  subtitle?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500'
  }
  
  return (
    <Card hover>
      <CardContent className="flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-secondary-600">{title}</p>
          <p className="text-2xl font-bold text-secondary-900">{value.toLocaleString()}</p>
          {subtitle && (
            <p className="text-xs text-secondary-500">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await ApiService.getDashboardStats()
        
        if (response.success && response.data) {
          setStats(response.data)
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadStats()
  }, [])
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-secondary-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-500">Erro ao carregar dados do dashboard</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-600">Visão geral do sistema de controle de estágio</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total de Estudantes"
          value={stats.total_estudantes}
          icon={UserGroupIcon}
          color="blue"
        />
        
        <StatCard
          title="Total de Empresas"
          value={stats.total_empresas}
          icon={BuildingOfficeIcon}
          color="green"
        />
        
        <StatCard
          title="Total de Orientadores"
          value={stats.total_orientadores}
          icon={AcademicCapIcon}
          color="purple"
        />
        
        <StatCard
          title="Estágios Obrigatórios"
          value={stats.estagios_obrigatorios.total}
          icon={DocumentTextIcon}
          color="indigo"
          subtitle={`${stats.estagios_obrigatorios.em_andamento} em andamento, ${stats.estagios_obrigatorios.concluidos} concluídos`}
        />
        
        <StatCard
          title="Estágios Não Obrigatórios"
          value={stats.estagios_nao_obrigatorios.total}
          icon={DocumentTextIcon}
          color="yellow"
          subtitle={`${stats.estagios_nao_obrigatorios.em_andamento} em andamento, ${stats.estagios_nao_obrigatorios.concluidos} concluídos`}
        />
        
        <StatCard
          title="Alertas Pendentes"
          value={stats.alertas_pendentes}
          icon={BellIcon}
          color="red"
        />
      </div>
      
      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2 text-primary-600" />
              Resumo de Estágios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-secondary-600">Obrigatórios em Andamento</span>
                  <span className="font-medium">{stats.estagios_obrigatorios.em_andamento}</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{
                      width: `${stats.estagios_obrigatorios.total > 0 
                        ? (stats.estagios_obrigatorios.em_andamento / stats.estagios_obrigatorios.total) * 100 
                        : 0}%`
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-secondary-600">Não Obrigatórios em Andamento</span>
                  <span className="font-medium">{stats.estagios_nao_obrigatorios.em_andamento}</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div 
                    className="bg-success-600 h-2 rounded-full" 
                    style={{
                      width: `${stats.estagios_nao_obrigatorios.total > 0 
                        ? (stats.estagios_nao_obrigatorios.em_andamento / stats.estagios_nao_obrigatorios.total) * 100 
                        : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CertificateIcon className="w-5 h-5 mr-2 text-success-600" />
              Certificados e Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Certificados Emitidos</span>
                <span className="text-2xl font-bold text-success-600">{stats.certificados_emitidos}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Alertas Pendentes</span>
                <span className={`text-2xl font-bold ${stats.alertas_pendentes > 0 ? 'text-danger-600' : 'text-success-600'}`}>
                  {stats.alertas_pendentes}
                </span>
              </div>
              
              {stats.alertas_pendentes > 0 && (
                <div className="bg-danger-50 border border-danger-200 rounded-md p-3">
                  <p className="text-sm text-danger-700">
                    Existem alertas pendentes que requerem atenção.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
