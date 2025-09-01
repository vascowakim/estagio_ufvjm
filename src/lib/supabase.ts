import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Função para verificar se o usuário está autenticado
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

// Função para fazer logout
export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Erro ao fazer logout:', error)
    throw error
  }
}

// Função para obter o usuário atual
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Função para obter dados do perfil do usuário
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('orientadores')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Erro ao buscar perfil:', error)
    throw error
  }
  
  return data
}

// Função para atualizar dados do usuário
export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('orientadores')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) {
    console.error('Erro ao atualizar perfil:', error)
    throw error
  }
  
  return data
}

// Função para upload de arquivos
export const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) {
    console.error('Erro ao fazer upload:', error)
    throw error
  }
  
  return data
}

// Função para obter URL pública de um arquivo
export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}

// Função para deletar arquivo
export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
  
  if (error) {
    console.error('Erro ao deletar arquivo:', error)
    throw error
  }
}

// Configurações de real-time
export const subscribeToTable = (
  table: string, 
  callback: (payload: any) => void,
  filter?: string
) => {
  let subscription = supabase
    .channel(`${table}_changes`)
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: table,
        filter: filter
      }, 
      callback
    )
    .subscribe()
  
  return subscription
}

// Função para unsubscribe
export const unsubscribeFromTable = (subscription: any) => {
  supabase.removeChannel(subscription)
}

export default supabase
