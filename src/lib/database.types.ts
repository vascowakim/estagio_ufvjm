export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      orientadores: {
        Row: {
          id: string
          nome: string
          email: string
          senha: string
          telefone: string | null
          departamento: string | null
          tipo: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          email: string
          senha: string
          telefone?: string | null
          departamento?: string | null
          tipo?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string
          senha?: string
          telefone?: string | null
          departamento?: string | null
          tipo?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      estudantes: {
        Row: {
          id: string
          nome: string
          email: string
          telefone: string | null
          cpf: string | null
          matricula: string
          curso: string
          periodo: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          email: string
          telefone?: string | null
          cpf?: string | null
          matricula: string
          curso: string
          periodo: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string
          telefone?: string | null
          cpf?: string | null
          matricula?: string
          curso?: string
          periodo?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      empresas: {
        Row: {
          id: string
          nome: string
          cnpj: string | null
          email: string | null
          telefone: string | null
          endereco: string | null
          cidade: string | null
          estado: string | null
          cep: string | null
          representante: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          cnpj?: string | null
          email?: string | null
          telefone?: string | null
          endereco?: string | null
          cidade?: string | null
          estado?: string | null
          cep?: string | null
          representante?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          cnpj?: string | null
          email?: string | null
          telefone?: string | null
          endereco?: string | null
          cidade?: string | null
          estado?: string | null
          cep?: string | null
          representante?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      estagios_obrigatorios: {
        Row: {
          id: string
          estudante_id: string
          empresa_id: string
          orientador_id: string
          data_inicio: string
          data_termino: string
          carga_horaria: number
          atividades: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          estudante_id: string
          empresa_id: string
          orientador_id: string
          data_inicio: string
          data_termino: string
          carga_horaria: number
          atividades?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          estudante_id?: string
          empresa_id?: string
          orientador_id?: string
          data_inicio?: string
          data_termino?: string
          carga_horaria?: number
          atividades?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      estagios_nao_obrigatorios: {
        Row: {
          id: string
          estudante_id: string
          empresa_id: string
          orientador_id: string
          data_inicio: string
          data_termino: string
          carga_horaria: number
          atividades: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          estudante_id: string
          empresa_id: string
          orientador_id: string
          data_inicio: string
          data_termino: string
          carga_horaria: number
          atividades?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          estudante_id?: string
          empresa_id?: string
          orientador_id?: string
          data_inicio?: string
          data_termino?: string
          carga_horaria?: number
          atividades?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      documentos: {
        Row: {
          id: string
          estagio_id: string
          tipo: string
          nome_arquivo: string
          url_arquivo: string
          status: string
          observacoes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          estagio_id: string
          tipo: string
          nome_arquivo: string
          url_arquivo: string
          status?: string
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          estagio_id?: string
          tipo?: string
          nome_arquivo?: string
          url_arquivo?: string
          status?: string
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      certificados: {
        Row: {
          id: string
          estudante_id: string
          estagio_id: string
          tipo: string
          numero_certificado: string
          data_emissao: string
          url_arquivo: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          estudante_id: string
          estagio_id: string
          tipo: string
          numero_certificado: string
          data_emissao: string
          url_arquivo: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          estudante_id?: string
          estagio_id?: string
          tipo?: string
          numero_certificado?: string
          data_emissao?: string
          url_arquivo?: string
          created_at?: string
          updated_at?: string
        }
      }
      alertas: {
        Row: {
          id: string
          tipo: string
          prioridade: string
          titulo: string
          mensagem: string
          destinatario_id: string
          destinatario_tipo: string
          status: string
          data_vencimento: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tipo: string
          prioridade: string
          titulo: string
          mensagem: string
          destinatario_id: string
          destinatario_tipo: string
          status?: string
          data_vencimento?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tipo?: string
          prioridade?: string
          titulo?: string
          mensagem?: string
          destinatario_id?: string
          destinatario_tipo?: string
          status?: string
          data_vencimento?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      configuracoes_email: {
        Row: {
          id: string
          nome: string
          smtp_host: string
          smtp_port: number
          email: string
          senha: string
          usar_tls: boolean
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          smtp_host: string
          smtp_port: number
          email: string
          senha: string
          usar_tls?: boolean
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          smtp_host?: string
          smtp_port?: number
          email?: string
          senha?: string
          usar_tls?: boolean
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      templates_email: {
        Row: {
          id: string
          nome: string
          assunto: string
          corpo_html: string
          corpo_texto: string
          variaveis: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          assunto: string
          corpo_html: string
          corpo_texto: string
          variaveis?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          assunto?: string
          corpo_html?: string
          corpo_texto?: string
          variaveis?: Json
          created_at?: string
          updated_at?: string
        }
      }
      relatorios: {
        Row: {
          id: string
          tipo: string
          titulo: string
          periodo: string
          dados: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tipo: string
          titulo: string
          periodo: string
          dados: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tipo?: string
          titulo?: string
          periodo?: string
          dados?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
