# 🚀 Guia de Instalação - EstagioPro Web

Este guia fornece instruções passo a passo para instalar e configurar o Sistema EstagioPro Web.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- **Node.js 18+** instalado ([Download](https://nodejs.org/))
- **npm** ou **yarn** como gerenciador de pacotes
- **Git** para controle de versão
- Conta no **Supabase** ([Criar conta](https://supabase.com))
- *(Opcional)* Conta no **Vercel** para deploy ([Criar conta](https://vercel.com))

## 🛠️ Instalação

### 1. Clone o Repositório

```bash
# Clone o repositório
git clone https://github.com/ufvjm/estagio-pro-web.git
cd estagio-pro-web/web

# ou se você já tem os arquivos localmente
cd caminho/para/estagio/web
```

### 2. Instale as Dependências

```bash
# Usando npm
npm install

# ou usando yarn
yarn install
```

### 3. Configure as Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp env.example .env.local

# Edite o arquivo .env.local com suas configurações
nano .env.local
```

**Configuração mínima necessária:**
```env
# Supabase (OBRIGATÓRIO)
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima

# Aplicação
NEXT_PUBLIC_APP_NAME=EstagioPro
NEXT_PUBLIC_UNIVERSITY_NAME=UFVJM
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🗄️ Configuração do Banco de Dados (Supabase)

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie uma nova organização (se necessário)
4. Clique em "New Project"
5. Preencha os dados:
   - **Name**: estagio-pro-ufvjm
   - **Database Password**: (crie uma senha segura)
   - **Region**: South America (São Paulo)

### 2. Obter Credenciais

1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Executar Script de Criação do Banco

1. Vá em **SQL Editor** no painel do Supabase
2. Cole e execute o seguinte SQL:

```sql
-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de orientadores (usuários do sistema)
CREATE TABLE orientadores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    departamento VARCHAR(255),
    tipo VARCHAR(50) DEFAULT 'professor' CHECK (tipo IN ('administrador', 'professor')),
    status VARCHAR(50) DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo', 'Pendente')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de estudantes
CREATE TABLE estudantes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(14),
    matricula VARCHAR(50) UNIQUE NOT NULL,
    curso VARCHAR(255) NOT NULL,
    periodo VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de empresas
CREATE TABLE empresas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18),
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco TEXT,
    cidade VARCHAR(255),
    estado VARCHAR(2),
    cep VARCHAR(10),
    representante VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Ativa' CHECK (status IN ('Ativa', 'Inativa')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de estágios obrigatórios
CREATE TABLE estagios_obrigatorios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    estudante_id UUID REFERENCES estudantes(id) ON DELETE CASCADE,
    empresa_id UUID REFERENCES empresas(id) ON DELETE RESTRICT,
    orientador_id UUID REFERENCES orientadores(id) ON DELETE RESTRICT,
    data_inicio DATE NOT NULL,
    data_termino DATE NOT NULL,
    carga_horaria INTEGER NOT NULL,
    atividades TEXT,
    status VARCHAR(50) DEFAULT 'Em Andamento' CHECK (status IN ('Em Andamento', 'Concluído', 'Cancelado')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de estágios não obrigatórios
CREATE TABLE estagios_nao_obrigatorios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    estudante_id UUID REFERENCES estudantes(id) ON DELETE CASCADE,
    empresa_id UUID REFERENCES empresas(id) ON DELETE RESTRICT,
    orientador_id UUID REFERENCES orientadores(id) ON DELETE RESTRICT,
    data_inicio DATE NOT NULL,
    data_termino DATE NOT NULL,
    carga_horaria INTEGER NOT NULL,
    atividades TEXT,
    status VARCHAR(50) DEFAULT 'Em Andamento' CHECK (status IN ('Em Andamento', 'Concluído', 'Cancelado')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de documentos
CREATE TABLE documentos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    estagio_id UUID NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    nome_arquivo VARCHAR(255) NOT NULL,
    url_arquivo TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Aprovado', 'Rejeitado')),
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de certificados
CREATE TABLE certificados (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    estudante_id UUID REFERENCES estudantes(id) ON DELETE CASCADE,
    estagio_id UUID NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Obrigatório', 'Não Obrigatório')),
    numero_certificado VARCHAR(100) UNIQUE NOT NULL,
    data_emissao DATE NOT NULL,
    url_arquivo TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de alertas
CREATE TABLE alertas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL,
    prioridade VARCHAR(50) DEFAULT 'Média' CHECK (prioridade IN ('Alta', 'Média', 'Baixa')),
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    destinatario_id UUID NOT NULL,
    destinatario_tipo VARCHAR(50) NOT NULL CHECK (destinatario_tipo IN ('estudante', 'orientador')),
    status VARCHAR(50) DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Enviado', 'Lido')),
    data_vencimento DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de configurações de email
CREATE TABLE configuracoes_email (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    smtp_host VARCHAR(255) NOT NULL,
    smtp_port INTEGER NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    usar_tls BOOLEAN DEFAULT true,
    ativo BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de templates de email
CREATE TABLE templates_email (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    assunto VARCHAR(255) NOT NULL,
    corpo_html TEXT NOT NULL,
    corpo_texto TEXT NOT NULL,
    variaveis JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de relatórios
CREATE TABLE relatorios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    periodo VARCHAR(100) NOT NULL,
    dados JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir usuário administrador padrão
INSERT INTO orientadores (nome, email, senha, tipo, status) 
VALUES (
    'Administrador do Sistema',
    'admin@ufvjm.edu.br',
    'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', -- senha: admin123 (SHA-256)
    'administrador',
    'Ativo'
);

-- Criar índices para melhor performance
CREATE INDEX idx_orientadores_email ON orientadores(email);
CREATE INDEX idx_estudantes_email ON estudantes(email);
CREATE INDEX idx_estudantes_matricula ON estudantes(matricula);
CREATE INDEX idx_empresas_cnpj ON empresas(cnpj);
CREATE INDEX idx_estagios_obrigatorios_estudante ON estagios_obrigatorios(estudante_id);
CREATE INDEX idx_estagios_nao_obrigatorios_estudante ON estagios_nao_obrigatorios(estudante_id);
CREATE INDEX idx_alertas_destinatario ON alertas(destinatario_id, destinatario_tipo);
CREATE INDEX idx_documentos_estagio ON documentos(estagio_id);
CREATE INDEX idx_certificados_estudante ON certificados(estudante_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas
CREATE TRIGGER update_orientadores_updated_at BEFORE UPDATE ON orientadores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_estudantes_updated_at BEFORE UPDATE ON estudantes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON empresas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_estagios_obrigatorios_updated_at BEFORE UPDATE ON estagios_obrigatorios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_estagios_nao_obrigatorios_updated_at BEFORE UPDATE ON estagios_nao_obrigatorios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documentos_updated_at BEFORE UPDATE ON documentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certificados_updated_at BEFORE UPDATE ON certificados FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alertas_updated_at BEFORE UPDATE ON alertas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configuracoes_email_updated_at BEFORE UPDATE ON configuracoes_email FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_email_updated_at BEFORE UPDATE ON templates_email FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_relatorios_updated_at BEFORE UPDATE ON relatorios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 4. Configurar Row Level Security (RLS)

Execute este SQL para configurar segurança:

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE orientadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE estudantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE estagios_obrigatorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE estagios_nao_obrigatorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes_email ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates_email ENABLE ROW LEVEL SECURITY;
ALTER TABLE relatorios ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (permitir acesso autenticado)
CREATE POLICY "Permitir leitura para usuários autenticados" ON orientadores FOR SELECT USING (true);
CREATE POLICY "Permitir leitura para usuários autenticados" ON estudantes FOR SELECT USING (true);
CREATE POLICY "Permitir leitura para usuários autenticados" ON empresas FOR SELECT USING (true);
CREATE POLICY "Permitir leitura para usuários autenticados" ON estagios_obrigatorios FOR SELECT USING (true);
CREATE POLICY "Permitir leitura para usuários autenticados" ON estagios_nao_obrigatorios FOR SELECT USING (true);
CREATE POLICY "Permitir leitura para usuários autenticados" ON documentos FOR SELECT USING (true);
CREATE POLICY "Permitir leitura para usuários autenticados" ON certificados FOR SELECT USING (true);
CREATE POLICY "Permitir leitura para usuários autenticados" ON alertas FOR SELECT USING (true);
CREATE POLICY "Permitir leitura para usuários autenticados" ON configuracoes_email FOR SELECT USING (true);
CREATE POLICY "Permitir leitura para usuários autenticados" ON templates_email FOR SELECT USING (true);
CREATE POLICY "Permitir leitura para usuários autenticados" ON relatorios FOR SELECT USING (true);
```

## 🚀 Executar a Aplicação

### Desenvolvimento

```bash
# Executar em modo de desenvolvimento
npm run dev

# A aplicação estará disponível em http://localhost:3000
```

### Verificar Instalação

1. Abra o navegador em `http://localhost:3000`
2. Você deve ver a página de login
3. Use as credenciais padrão:
   - **Email**: admin@ufvjm.edu.br
   - **Senha**: admin123

### Testar API

```bash
# Verificar saúde da aplicação
curl http://localhost:3000/api/health

# Resposta esperada:
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "2.0.0",
  "environment": "development",
  "services": {
    "database": "ok",
    "auth": "ok"
  }
}
```

## 🏗️ Build para Produção

```bash
# Gerar build otimizado
npm run build

# Testar build localmente
npm start

# Gerar arquivos estáticos (para Wix)
npm run export
```

## 📦 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy em produção
vercel --prod
```

### Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Deploy em produção
netlify deploy --prod
```

## ✅ Checklist Pós-Instalação

- [ ] Aplicação roda em `http://localhost:3000`
- [ ] Login funciona com admin@ufvjm.edu.br / admin123
- [ ] Dashboard carrega sem erros
- [ ] API health retorna status "ok"
- [ ] Banco de dados conectado
- [ ] Variáveis de ambiente configuradas
- [ ] Build de produção funciona
- [ ] Deploy realizado com sucesso

## 🔧 Configurações Opcionais

### 1. Configurar Email

Adicione ao `.env.local`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sistema@ufvjm.edu.br
SMTP_PASS=sua-senha-de-app
```

### 2. Configurar Analytics

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. Configurar Domínio Personalizado

No Vercel/Netlify:
1. Adicione o domínio: `estagio.ufvjm.edu.br`
2. Configure DNS: CNAME apontando para o provedor
3. SSL será configurado automaticamente

## 🆘 Troubleshooting

### Erro: "Supabase connection failed"
- Verifique se as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretas
- Confirme se o projeto Supabase está ativo

### Erro: "Login failed"
- Verifique se o usuário administrador foi criado no banco
- Confirme se a senha está correta (admin123)

### Erro: "Build failed"
- Execute `npm run type-check` para verificar erros TypeScript
- Execute `npm run lint` para verificar problemas de código

### Erro: "Port 3000 already in use"
```bash
# Usar porta diferente
npm run dev -- -p 3001
```

## 📞 Suporte

Para suporte técnico:
- **Email**: suporte.estagio@ufvjm.edu.br
- **Telefone**: (38) 3532-1200
- **Horário**: Segunda a Sexta, 8h às 18h

---

**© 2024 UFVJM - Universidade Federal dos Vales do Jequitinhonha e Mucuri**
