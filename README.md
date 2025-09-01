# EstagioPro Web - Sistema de Controle de Estágio

Sistema web desenvolvido em Next.js + TypeScript + Supabase para controle de estágios obrigatórios e não obrigatórios do curso de Ciências Contábeis da UFVJM.

## 🚀 Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI, Heroicons
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Charts**: Recharts
- **PDF Generation**: jsPDF, html2canvas
- **File Upload**: React Dropzone
- **Deployment**: Vercel, Wix (via iframe/embed)

## 📁 Estrutura do Projeto

```
web/
├── src/
│   ├── components/
│   │   ├── ui/           # Componentes básicos (Button, Input, Modal, etc.)
│   │   ├── layout/       # Layout principal (Sidebar, Header, Layout)
│   │   └── forms/        # Formulários específicos
│   ├── lib/             # Configurações (Supabase, utils)
│   ├── pages/           # Páginas Next.js
│   ├── services/        # Serviços de API
│   ├── styles/          # Estilos globais
│   ├── types/           # Tipos TypeScript
│   ├── utils/           # Utilitários
│   └── hooks/           # Custom hooks
├── public/              # Arquivos estáticos
└── docs/               # Documentação
```

## 🛠️ Instalação e Configuração

### 1. Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase
- Conta no Wix (para integração)

### 2. Instalação

```bash
# Navegar para a pasta web
cd web

# Instalar dependências
npm install

# ou
yarn install
```

### 3. Configuração do Ambiente

Copie o arquivo `env.example` para `.env.local`:

```bash
cp env.example .env.local
```

Configure as variáveis de ambiente no `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App
NEXT_PUBLIC_APP_NAME=EstagioPro
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_UNIVERSITY_NAME=UFVJM
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### 4. Configuração do Supabase

#### 4.1 Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova organização e projeto
3. Anote a URL e a chave anônima do projeto

#### 4.2 Executar Migrações do Banco

Execute o SQL no editor do Supabase:

```sql
-- Criar tabelas principais
CREATE TABLE orientadores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    departamento VARCHAR(255),
    tipo VARCHAR(50) DEFAULT 'professor',
    status VARCHAR(50) DEFAULT 'Ativo',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE estudantes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(14),
    matricula VARCHAR(50) UNIQUE NOT NULL,
    curso VARCHAR(255) NOT NULL,
    periodo VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Ativo',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE empresas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18),
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco TEXT,
    cidade VARCHAR(255),
    estado VARCHAR(2),
    cep VARCHAR(10),
    representante VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Ativa',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Continue com as outras tabelas...
```

### 5. Executar o Projeto

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

## 🌐 Integração com Wix

### Opção 1: Embed via iFrame

1. **Deploy da Aplicação**:
   ```bash
   npm run build
   npm run export
   ```

2. **Upload para Wix**:
   - Faça upload dos arquivos da pasta `dist/` para o Wix
   - Configure o domínio personalizado

3. **Embed no Wix**:
   ```html
   <iframe 
     src="https://your-domain.com" 
     width="100%" 
     height="800px"
     frameborder="0">
   </iframe>
   ```

### Opção 2: Wix Velo Integration

1. **Instalar Wix CLI**:
   ```bash
   npm install -g @wix/cli
   ```

2. **Criar Projeto Wix**:
   ```bash
   wix create my-estagio-pro
   cd my-estagio-pro
   ```

3. **Integrar Código**:
   - Copie os componentes para `src/pages/`
   - Configure APIs no Wix Backend
   - Implemente autenticação Wix

### Opção 3: Deploy Independente + Widget Wix

1. **Deploy no Vercel**:
   ```bash
   npm run build
   vercel --prod
   ```

2. **Criar Widget Wix**:
   ```javascript
   // wix-widget.js
   window.addEventListener('message', function(event) {
     if (event.data.type === 'ESTAGIO_PRO_RESIZE') {
       document.getElementById('estagio-frame').height = event.data.height;
     }
   });
   ```

## 📊 Funcionalidades Implementadas

### ✅ Autenticação e Autorização
- Login com email/senha
- Integração com Supabase Auth
- Controle de acesso por tipo de usuário
- Sessões persistentes

### ✅ Dashboard
- Estatísticas gerais do sistema
- Gráficos e métricas
- Alertas e notificações
- Interface responsiva

### ✅ Gestão de Entidades
- **Estudantes**: CRUD completo
- **Empresas**: CRUD completo  
- **Orientadores**: CRUD completo
- **Estágios**: Obrigatórios e não obrigatórios

### ✅ Sistema de Alertas
- Central de alertas inteligente
- Notificações por email
- Alertas de vencimento
- Status de documentos

### ✅ Relatórios
- Relatórios semestrais
- Exportação em PDF/Excel
- Filtros avançados
- Gráficos interativos

### ✅ Certificados
- Geração automática
- Templates customizáveis
- Download em PDF
- Controle de numeração

## 🔧 Configurações Avançadas

### Customização de Temas

Edite `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Cores da UFVJM
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

### Configuração de Email

Configure SMTP no Supabase Edge Functions:

```typescript
// supabase/functions/send-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { to, subject, html } = await req.json()
  
  // Implementar envio de email
  // usando Resend, SendGrid, ou outro provedor
  
  return new Response(
    JSON.stringify({ success: true }),
    { headers: { "Content-Type": "application/json" } }
  )
})
```

### Configuração WhatsApp

Integre com WhatsApp Business API:

```typescript
// src/services/whatsapp.ts
export class WhatsAppService {
  static async sendMessage(phone: string, message: string) {
    // Implementar integração com WhatsApp Business API
    // ou usar serviços como Twilio, MessageBird
  }
}
```

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- ✅ Desktop (1920x1080+)
- ✅ Laptop (1366x768+)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667+)

## 🔒 Segurança

### Implementadas:
- Autenticação JWT via Supabase
- Row Level Security (RLS)
- Validação de entrada
- Sanitização de dados
- HTTPS obrigatório

### Recomendações:
- Configure CSP headers
- Implemente rate limiting
- Use CAPTCHA em formulários
- Configure backup automático

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify

```bash
# Build
npm run build && npm run export

# Deploy manual via interface web
# ou usar Netlify CLI
```

### Wix Hosting

1. Exporte o projeto:
   ```bash
   npm run export
   ```

2. Faça upload da pasta `out/` para o Wix

3. Configure domínio personalizado

## 📞 Suporte

Para suporte técnico:
- **Email**: suporte@ufvjm.edu.br
- **Documentação**: [Link da documentação]
- **Issues**: [GitHub Issues]

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Contribuidores

- **Prof. Dr. Vasconcelos Reis Wakim** - UFVJM
- **Equipe de Desenvolvimento** - Ciências Contábeis UFVJM

---

**Universidade Federal dos Vales do Jequitinhonha e Mucuri**  
**Curso de Ciências Contábeis**  
**Sistema EstagioPro v2.0**
