import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { DashboardStats } from '@/types'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import {
  UserGroupIcon,
  BuildingOffice2Icon,
  AcademicCapIcon,
  DocumentTextIcon,
  BellIcon,
  CheckBadgeIcon
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-soft"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-600">{title}</p>
          <p className="text-3xl font-bold text-secondary-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-secondary-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = Cookies.get('auth-token');
        
        const response = await fetch('/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setStats(data.data);
        } else {
          toast.error('Erro ao carregar estatísticas');
        }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        toast.error('Erro ao conectar com o servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  
  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-soft">
                  <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-secondary-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!stats) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-secondary-600">Erro ao carregar dados do dashboard.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600">Visão geral do sistema de estágio</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total de Estudantes"
            value={stats.total_estudantes}
            icon={UserGroupIcon}
            color="blue"
          />
          
          <StatCard
            title="Total de Empresas"
            value={stats.total_empresas}
            icon={BuildingOffice2Icon}
            color="green"
          />
          
          <StatCard
            title="Total de Orientadores"
            value={stats.total_orientadores}
            icon={AcademicCapIcon}
            color="purple"
          />
          
          <StatCard
            title="Certificados Emitidos"
            value={stats.certificados_emitidos}
            icon={CheckBadgeIcon}
            color="indigo"
          />
        </div>

        {/* Estágios Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Estágios Obrigatórios */}
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2 text-primary-600" />
              Estágios Obrigatórios
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-600">Total</span>
                <span className="font-semibold text-lg">{stats.estagios_obrigatorios.total}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600">Em Andamento</span>
                  <span className="font-medium">{stats.estagios_obrigatorios.em_andamento}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600">Concluídos</span>
                  <span className="font-medium">{stats.estagios_obrigatorios.concluidos}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600">Cancelados</span>
                  <span className="font-medium">{stats.estagios_obrigatorios.cancelados}</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-secondary-500 mb-1">
                  <span>Progresso</span>
                  <span>
                    {stats.estagios_obrigatorios.total > 0 
                      ? Math.round((stats.estagios_obrigatorios.concluidos / stats.estagios_obrigatorios.total) * 100)
                      : 0
                    }%
                  </span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${stats.estagios_obrigatorios.total > 0 
                        ? (stats.estagios_obrigatorios.concluidos / stats.estagios_obrigatorios.total) * 100
                        : 0
                      }%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Estágios Não Obrigatórios */}
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2 text-success-600" />
              Estágios Não Obrigatórios
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-600">Total</span>
                <span className="font-semibold text-lg">{stats.estagios_nao_obrigatorios.total}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600">Em Andamento</span>
                  <span className="font-medium">{stats.estagios_nao_obrigatorios.em_andamento}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600">Concluídos</span>
                  <span className="font-medium">{stats.estagios_nao_obrigatorios.concluidos}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600">Cancelados</span>
                  <span className="font-medium">{stats.estagios_nao_obrigatorios.cancelados}</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-secondary-500 mb-1">
                  <span>Progresso</span>
                  <span>
                    {stats.estagios_nao_obrigatorios.total > 0 
                      ? Math.round((stats.estagios_nao_obrigatorios.concluidos / stats.estagios_nao_obrigatorios.total) * 100)
                      : 0
                    }%
                  </span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div
                    className="bg-success-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${stats.estagios_nao_obrigatorios.total > 0 
                        ? (stats.estagios_nao_obrigatorios.concluidos / stats.estagios_nao_obrigatorios.total) * 100
                        : 0
                      }%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2 text-primary-600" />
              Resumo de Estágios
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-secondary-600">Obrigatórios em Andamento</span>
                  <span className="font-medium">{stats.estagios_obrigatorios.em_andamento}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-secondary-600">Não Obrigatórios em Andamento</span>
                  <span className="font-medium">{stats.estagios_nao_obrigatorios.em_andamento}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-secondary-700">Total em Andamento</span>
                    <span className="font-semibold text-primary-600">
                      {stats.estagios_obrigatorios.em_andamento + stats.estagios_nao_obrigatorios.em_andamento}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <CheckBadgeIcon className="w-5 h-5 mr-2 text-success-600" />
              Certificados e Alertas
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Certificados Emitidos</span>
                <span className="text-2xl font-bold text-success-600">{stats.certificados_emitidos}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">Alertas Pendentes</span>
                <span className="text-2xl font-bold text-warning-600">{stats.alertas_pendentes}</span>
              </div>
              
              {stats.alertas_pendentes > 0 && (
                <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-md">
                  <div className="flex items-center">
                    <BellIcon className="w-4 h-4 text-warning-600 mr-2" />
                    <span className="text-sm text-warning-700">
                      Existem alertas pendentes que requerem atenção.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
