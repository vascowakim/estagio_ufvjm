// Tipos principais do sistema EstagioPro Web

export interface User {
  id: string;
  email: string;
  nome: string;
  tipo: 'administrador' | 'professor';
  status: 'Ativo' | 'Pendente' | 'Inativo';
  created_at: string;
  updated_at: string;
}

export interface Estudante {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  matricula: string;
  curso: string;
  periodo: string;
  status: 'Ativo' | 'Inativo';
  created_at: string;
  updated_at: string;
}

export interface Empresa {
  id: string;
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  representante?: string;
  status: 'Ativa' | 'Inativa';
  created_at: string;
  updated_at: string;
}

export interface Orientador {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  departamento?: string;
  status: 'Ativo' | 'Inativo';
  created_at: string;
  updated_at: string;
}

export interface EstagioObrigatorio {
  id: string;
  estudante_id: string;
  empresa_id: string;
  orientador_id: string;
  data_inicio: string;
  data_termino: string;
  carga_horaria: number;
  atividades?: string;
  status: 'Em Andamento' | 'Concluído' | 'Cancelado';
  documentos?: EstagioDocumento[];
  created_at: string;
  updated_at: string;
  
  // Relacionamentos
  estudante?: Estudante;
  empresa?: Empresa;
  orientador?: Orientador;
}

export interface EstagioNaoObrigatorio {
  id: string;
  estudante_id: string;
  empresa_id: string;
  orientador_id: string;
  data_inicio: string;
  data_termino: string;
  carga_horaria: number;
  atividades?: string;
  status: 'Em Andamento' | 'Concluído' | 'Cancelado';
  documentos?: EstagioDocumento[];
  created_at: string;
  updated_at: string;
  
  // Relacionamentos
  estudante?: Estudante;
  empresa?: Empresa;
  orientador?: Orientador;
}

export interface EstagioDocumento {
  id: string;
  estagio_id: string;
  tipo: 'Termo de Compromisso' | 'Plano de Atividades' | 'Relatório' | 'Avaliação' | 'Outros';
  nome_arquivo: string;
  url_arquivo: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface Relatorio {
  id: string;
  tipo: 'Semestral Obrigatório' | 'Semestral Não Obrigatório' | 'Geral' | 'Por Orientador';
  titulo: string;
  periodo: string;
  dados: any;
  created_at: string;
  updated_at: string;
}

export interface Certificado {
  id: string;
  estudante_id: string;
  estagio_id: string;
  tipo: 'Obrigatório' | 'Não Obrigatório';
  numero_certificado: string;
  data_emissao: string;
  url_arquivo: string;
  created_at: string;
  updated_at: string;
  
  // Relacionamentos
  estudante?: Estudante;
  estagio?: EstagioObrigatorio | EstagioNaoObrigatorio;
}

export interface Alerta {
  id: string;
  tipo: 'Vencimento Crítico' | 'Vencimento Urgente' | 'Vencimento Próximo' | 'Documento Pendente' | 'Avaliação Pendente' | 'Frequência Baixa' | 'Relatório Atrasado';
  prioridade: 'Alta' | 'Média' | 'Baixa';
  titulo: string;
  mensagem: string;
  destinatario_id: string;
  destinatario_tipo: 'estudante' | 'orientador';
  status: 'Pendente' | 'Enviado' | 'Lido';
  data_vencimento?: string;
  created_at: string;
  updated_at: string;
}

export interface ConfiguracaoEmail {
  id: string;
  nome: string;
  smtp_host: string;
  smtp_port: number;
  email: string;
  senha: string;
  usar_tls: boolean;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateEmail {
  id: string;
  nome: string;
  assunto: string;
  corpo_html: string;
  corpo_texto: string;
  variaveis: string[];
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_estudantes: number;
  total_empresas: number;
  total_orientadores: number;
  estagios_obrigatorios: {
    em_andamento: number;
    concluidos: number;
    total: number;
  };
  estagios_nao_obrigatorios: {
    em_andamento: number;
    concluidos: number;
    total: number;
  };
  alertas_pendentes: number;
  certificados_emitidos: number;
}

// Tipos para formulários
export interface LoginForm {
  email: string;
  password: string;
}

export interface EstudanteForm {
  nome: string;
  email: string;
  telefone?: string;
  cpf?: string;
  matricula: string;
  curso: string;
  periodo: string;
}

export interface EmpresaForm {
  nome: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  representante?: string;
}

export interface OrientadorForm {
  nome: string;
  email: string;
  telefone?: string;
  departamento?: string;
}

export interface EstagioForm {
  estudante_id: string;
  empresa_id: string;
  orientador_id: string;
  data_inicio: string;
  data_termino: string;
  carga_horaria: number;
  atividades?: string;
}

// Tipos para API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para filtros e pesquisa
export interface FilterOptions {
  search?: string;
  status?: string;
  tipo?: string;
  periodo?: string;
  orientador_id?: string;
  empresa_id?: string;
  data_inicio?: string;
  data_termino?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Tipos para Wix
export interface WixConfig {
  apiKey: string;
  siteId: string;
  instanceId: string;
}

// Tipos para notificações
export interface NotificationConfig {
  email: boolean;
  whatsapp: boolean;
  push: boolean;
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';
