import { supabase } from '@/lib/supabase'
import { User, LoginForm, ApiResponse } from '@/types'

export class AuthService {
  static async login(credentials: LoginForm): Promise<ApiResponse<User>> {
    try {
      // Primeiro, tentar autenticar com Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (authError) {
        // Se falhar, tentar com o sistema legado (hash SHA-256)
        const hashedPassword = await this.hashPassword(credentials.password)
        
        const { data: userData, error: userError } = await supabase
          .from('orientadores')
          .select('*')
          .eq('email', credentials.email)
          .eq('senha', hashedPassword)
          .eq('status', 'Ativo')
          .single()

        if (userError || !userData) {
          return {
            success: false,
            error: 'Credenciais inválidas ou usuário inativo'
          }
        }

        // Criar sessão manual se necessário
        const user: User = {
          id: userData.id,
          email: userData.email,
          nome: userData.nome,
          tipo: userData.tipo as 'administrador' | 'professor',
          status: userData.status as 'Ativo' | 'Pendente' | 'Inativo',
          created_at: userData.created_at,
          updated_at: userData.updated_at
        }

        return {
          success: true,
          data: user,
          message: 'Login realizado com sucesso'
        }
      }

      // Se autenticação com Supabase Auth foi bem-sucedida
      const { data: profileData, error: profileError } = await supabase
        .from('orientadores')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profileError || !profileData) {
        await supabase.auth.signOut()
        return {
          success: false,
          error: 'Perfil de usuário não encontrado'
        }
      }

      const user: User = {
        id: profileData.id,
        email: profileData.email,
        nome: profileData.nome,
        tipo: profileData.tipo as 'administrador' | 'professor',
        status: profileData.status as 'Ativo' | 'Pendente' | 'Inativo',
        created_at: profileData.created_at,
        updated_at: profileData.updated_at
      }

      return {
        success: true,
        data: user,
        message: 'Login realizado com sucesso'
      }

    } catch (error) {
      console.error('Erro no login:', error)
      return {
        success: false,
        error: 'Erro interno do servidor'
      }
    }
  }

  static async logout(): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return {
          success: false,
          error: 'Erro ao fazer logout'
        }
      }

      return {
        success: true,
        message: 'Logout realizado com sucesso'
      }
    } catch (error) {
      console.error('Erro no logout:', error)
      return {
        success: false,
        error: 'Erro interno do servidor'
      }
    }
  }

  static async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        return {
          success: false,
          error: 'Usuário não autenticado'
        }
      }

      const { data: profileData, error: profileError } = await supabase
        .from('orientadores')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError || !profileData) {
        return {
          success: false,
          error: 'Perfil de usuário não encontrado'
        }
      }

      const userData: User = {
        id: profileData.id,
        email: profileData.email,
        nome: profileData.nome,
        tipo: profileData.tipo as 'administrador' | 'professor',
        status: profileData.status as 'Ativo' | 'Pendente' | 'Inativo',
        created_at: profileData.created_at,
        updated_at: profileData.updated_at
      }

      return {
        success: true,
        data: userData
      }

    } catch (error) {
      console.error('Erro ao obter usuário:', error)
      return {
        success: false,
        error: 'Erro interno do servidor'
      }
    }
  }

  static async updatePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return {
          success: false,
          error: 'Erro ao atualizar senha'
        }
      }

      return {
        success: true,
        message: 'Senha atualizada com sucesso'
      }
    } catch (error) {
      console.error('Erro ao atualizar senha:', error)
      return {
        success: false,
        error: 'Erro interno do servidor'
      }
    }
  }

  static async resetPassword(email: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        return {
          success: false,
          error: 'Erro ao enviar email de recuperação'
        }
      }

      return {
        success: true,
        message: 'Email de recuperação enviado com sucesso'
      }
    } catch (error) {
      console.error('Erro ao resetar senha:', error)
      return {
        success: false,
        error: 'Erro interno do servidor'
      }
    }
  }

  // Função auxiliar para hash SHA-256 (compatibilidade com sistema legado)
  private static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  }

  // Verificar se o usuário tem permissão de administrador
  static async isAdmin(): Promise<boolean> {
    const userResponse = await this.getCurrentUser()
    return userResponse.success && userResponse.data?.tipo === 'administrador'
  }

  // Verificar se o usuário está autenticado
  static async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  }
}
