import { supabase } from '@/lib/supabase'
import { 
  Estudante, 
  Empresa, 
  Orientador, 
  EstagioObrigatorio, 
  EstagioNaoObrigatorio,
  Certificado,
  Alerta,
  DashboardStats,
  ApiResponse,
  PaginatedResponse,
  FilterOptions,
  SortOptions
} from '@/types'

export class ApiService {
  // ============= ESTUDANTES =============
  
  static async getEstudantes(
    page: number = 1,
    limit: number = 10,
    filters?: FilterOptions,
    sort?: SortOptions
  ): Promise<ApiResponse<PaginatedResponse<Estudante>>> {
    try {
      let query = supabase
        .from('estudantes')
        .select('*', { count: 'exact' })

      // Aplicar filtros
      if (filters?.search) {
        query = query.or(`nome.ilike.%${filters.search}%,email.ilike.%${filters.search}%,matricula.ilike.%${filters.search}%`)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      // Aplicar ordenação
      if (sort) {
        query = query.order(sort.field, { ascending: sort.direction === 'asc' })
      } else {
        query = query.order('nome', { ascending: true })
      }

      // Aplicar paginação
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        return { success: false, error: error.message }
      }

      return {
        success: true,
        data: {
          data: data || [],
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar estudantes:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async getEstudante(id: string): Promise<ApiResponse<Estudante>> {
    try {
      const { data, error } = await supabase
        .from('estudantes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar estudante:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async createEstudante(estudante: Omit<Estudante, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Estudante>> {
    try {
      const { data, error } = await supabase
        .from('estudantes')
        .insert(estudante)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data, message: 'Estudante criado com sucesso' }
    } catch (error) {
      console.error('Erro ao criar estudante:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async updateEstudante(id: string, updates: Partial<Estudante>): Promise<ApiResponse<Estudante>> {
    try {
      const { data, error } = await supabase
        .from('estudantes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data, message: 'Estudante atualizado com sucesso' }
    } catch (error) {
      console.error('Erro ao atualizar estudante:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async deleteEstudante(id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('estudantes')
        .delete()
        .eq('id', id)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, message: 'Estudante excluído com sucesso' }
    } catch (error) {
      console.error('Erro ao excluir estudante:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  // ============= EMPRESAS =============

  static async getEmpresas(
    page: number = 1,
    limit: number = 10,
    filters?: FilterOptions,
    sort?: SortOptions
  ): Promise<ApiResponse<PaginatedResponse<Empresa>>> {
    try {
      let query = supabase
        .from('empresas')
        .select('*', { count: 'exact' })

      if (filters?.search) {
        query = query.or(`nome.ilike.%${filters.search}%,cnpj.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (sort) {
        query = query.order(sort.field, { ascending: sort.direction === 'asc' })
      } else {
        query = query.order('nome', { ascending: true })
      }

      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        return { success: false, error: error.message }
      }

      return {
        success: true,
        data: {
          data: data || [],
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async createEmpresa(empresa: Omit<Empresa, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Empresa>> {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .insert(empresa)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data, message: 'Empresa criada com sucesso' }
    } catch (error) {
      console.error('Erro ao criar empresa:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  // ============= ORIENTADORES =============

  static async getOrientadores(
    page: number = 1,
    limit: number = 10,
    filters?: FilterOptions,
    sort?: SortOptions
  ): Promise<ApiResponse<PaginatedResponse<Orientador>>> {
    try {
      let query = supabase
        .from('orientadores')
        .select('id, nome, email, telefone, departamento, status, created_at, updated_at', { count: 'exact' })

      if (filters?.search) {
        query = query.or(`nome.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (sort) {
        query = query.order(sort.field, { ascending: sort.direction === 'asc' })
      } else {
        query = query.order('nome', { ascending: true })
      }

      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        return { success: false, error: error.message }
      }

      return {
        success: true,
        data: {
          data: data || [],
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar orientadores:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  // ============= ESTÁGIOS OBRIGATÓRIOS =============

  static async getEstagiosObrigatorios(
    page: number = 1,
    limit: number = 10,
    filters?: FilterOptions,
    sort?: SortOptions
  ): Promise<ApiResponse<PaginatedResponse<EstagioObrigatorio>>> {
    try {
      let query = supabase
        .from('estagios_obrigatorios')
        .select(`
          *,
          estudante:estudantes(*),
          empresa:empresas(*),
          orientador:orientadores(id, nome, email, telefone, departamento, status, created_at, updated_at)
        `, { count: 'exact' })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.orientador_id) {
        query = query.eq('orientador_id', filters.orientador_id)
      }
      if (filters?.data_inicio) {
        query = query.gte('data_inicio', filters.data_inicio)
      }
      if (filters?.data_termino) {
        query = query.lte('data_termino', filters.data_termino)
      }

      if (sort) {
        query = query.order(sort.field, { ascending: sort.direction === 'asc' })
      } else {
        query = query.order('data_inicio', { ascending: false })
      }

      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        return { success: false, error: error.message }
      }

      return {
        success: true,
        data: {
          data: data || [],
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar estágios obrigatórios:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  static async createEstagioObrigatorio(estagio: Omit<EstagioObrigatorio, 'id' | 'created_at' | 'updated_at' | 'estudante' | 'empresa' | 'orientador'>): Promise<ApiResponse<EstagioObrigatorio>> {
    try {
      const { data, error } = await supabase
        .from('estagios_obrigatorios')
        .insert(estagio)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data, message: 'Estágio obrigatório criado com sucesso' }
    } catch (error) {
      console.error('Erro ao criar estágio obrigatório:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  // ============= ESTÁGIOS NÃO OBRIGATÓRIOS =============

  static async getEstagiosNaoObrigatorios(
    page: number = 1,
    limit: number = 10,
    filters?: FilterOptions,
    sort?: SortOptions
  ): Promise<ApiResponse<PaginatedResponse<EstagioNaoObrigatorio>>> {
    try {
      let query = supabase
        .from('estagios_nao_obrigatorios')
        .select(`
          *,
          estudante:estudantes(*),
          empresa:empresas(*),
          orientador:orientadores(id, nome, email, telefone, departamento, status, created_at, updated_at)
        `, { count: 'exact' })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.orientador_id) {
        query = query.eq('orientador_id', filters.orientador_id)
      }

      if (sort) {
        query = query.order(sort.field, { ascending: sort.direction === 'asc' })
      } else {
        query = query.order('data_inicio', { ascending: false })
      }

      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        return { success: false, error: error.message }
      }

      return {
        success: true,
        data: {
          data: data || [],
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar estágios não obrigatórios:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  // ============= DASHBOARD =============

  static async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const [
        estudantesCount,
        empresasCount,
        orientadoresCount,
        estagiosObrigatoriosStats,
        estagiosNaoObrigatoriosStats,
        alertasCount,
        certificadosCount
      ] = await Promise.all([
        supabase.from('estudantes').select('id', { count: 'exact', head: true }),
        supabase.from('empresas').select('id', { count: 'exact', head: true }),
        supabase.from('orientadores').select('id', { count: 'exact', head: true }),
        supabase.from('estagios_obrigatorios').select('status', { count: 'exact' }),
        supabase.from('estagios_nao_obrigatorios').select('status', { count: 'exact' }),
        supabase.from('alertas').select('id', { count: 'exact', head: true }).eq('status', 'Pendente'),
        supabase.from('certificados').select('id', { count: 'exact', head: true })
      ])

      const estagiosObrigatoriosData = estagiosObrigatoriosStats.data || []
      const estagiosNaoObrigatoriosData = estagiosNaoObrigatoriosStats.data || []

      const stats: DashboardStats = {
        total_estudantes: estudantesCount.count || 0,
        total_empresas: empresasCount.count || 0,
        total_orientadores: orientadoresCount.count || 0,
        estagios_obrigatorios: {
          em_andamento: estagiosObrigatoriosData.filter(e => e.status === 'Em Andamento').length,
          concluidos: estagiosObrigatoriosData.filter(e => e.status === 'Concluído').length,
          total: estagiosObrigatoriosData.length
        },
        estagios_nao_obrigatorios: {
          em_andamento: estagiosNaoObrigatoriosData.filter(e => e.status === 'Em Andamento').length,
          concluidos: estagiosNaoObrigatoriosData.filter(e => e.status === 'Concluído').length,
          total: estagiosNaoObrigatoriosData.length
        },
        alertas_pendentes: alertasCount.count || 0,
        certificados_emitidos: certificadosCount.count || 0
      }

      return { success: true, data: stats }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  // ============= ALERTAS =============

  static async getAlertas(
    page: number = 1,
    limit: number = 10,
    filters?: FilterOptions
  ): Promise<ApiResponse<PaginatedResponse<Alerta>>> {
    try {
      let query = supabase
        .from('alertas')
        .select('*', { count: 'exact' })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.tipo) {
        query = query.eq('tipo', filters.tipo)
      }

      query = query.order('created_at', { ascending: false })

      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        return { success: false, error: error.message }
      }

      return {
        success: true,
        data: {
          data: data || [],
          total: count || 0,
          page,
          limit,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar alertas:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }
}
