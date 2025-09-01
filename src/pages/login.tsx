import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { AuthService } from '@/services/auth'
import { LoginForm } from '@/types'
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>()
  
  useEffect(() => {
    // Verificar se já está logado
    const checkAuth = async () => {
      const isAuth = await AuthService.isAuthenticated()
      if (isAuth) {
        router.push('/dashboard')
      }
    }
    
    checkAuth()
  }, [router])
  
  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    
    try {
      const response = await AuthService.login(data)
      
      if (response.success) {
        toast.success('Login realizado com sucesso!')
        router.push('/dashboard')
      } else {
        toast.error(response.error || 'Erro ao fazer login')
      }
    } catch (error) {
      console.error('Erro no login:', error)
      toast.error('Erro interno do servidor')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">EP</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-secondary-900">
            EstagioPro
          </h2>
          <p className="mt-2 text-sm text-secondary-600">
            Sistema de Controle de Estágio - UFVJM
          </p>
          <p className="text-xs text-secondary-500">
            Universidade Federal dos Vales do Jequitinhonha e Mucuri
          </p>
        </div>
        
        {/* Form */}
        <Card className="shadow-xl">
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Input
                  label="Email"
                  type="email"
                  placeholder="seu-email@ufvjm.edu.br"
                  leftIcon={<EnvelopeIcon className="w-5 h-5" />}
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                />
              </div>
              
              <div>
                <Input
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  leftIcon={<LockClosedIcon className="w-5 h-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-secondary-400 hover:text-secondary-600"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  }
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 3,
                      message: 'Senha deve ter pelo menos 3 caracteres'
                    }
                  })}
                />
              </div>
              
              <div>
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  loading={loading}
                >
                  Entrar
                </Button>
              </div>
            </form>
            
            {/* Help */}
            <div className="mt-6 text-center">
              <p className="text-xs text-secondary-500">
                Problemas para acessar? Entre em contato com o administrador do sistema.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="text-center text-xs text-secondary-500">
          <p>© 2024 UFVJM - Todos os direitos reservados</p>
          <p className="mt-1">Sistema desenvolvido para o Curso de Ciências Contábeis</p>
        </div>
      </div>
    </div>
  )
}
