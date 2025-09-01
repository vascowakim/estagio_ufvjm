# 🎯 Guia Completo de Integração com Wix

Este guia detalha como integrar o Sistema EstagioPro com a plataforma Wix de forma profissional e eficiente.

## 🌟 Opções de Integração

### 1. 📱 Embed via iFrame (Mais Simples)
### 2. 🔧 Wix Velo Integration (Mais Avançada)
### 3. 🌐 Deploy Independente + Widget (Mais Flexível)

---

## 📱 OPÇÃO 1: Embed via iFrame

### Vantagens
- ✅ Implementação rápida (2-3 horas)
- ✅ Funciona imediatamente
- ✅ Mantém todas as funcionalidades
- ✅ Atualizações automáticas

### Desvantagens
- ❌ Limitações de responsividade
- ❌ Possíveis problemas de SEO
- ❌ Menos integração visual com o site

### Passo a Passo

#### 1.1 Preparar a Aplicação

```bash
# Na pasta web/
npm install
npm run build
npm run export
```

#### 1.2 Deploy da Aplicação

**Opção A: Vercel (Recomendado)**
```bash
npm install -g vercel
vercel --prod
```

**Opção B: Netlify**
```bash
# Fazer upload da pasta 'out/' via interface web
# ou usar Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=out
```

#### 1.3 Integração no Wix

1. **Abrir o Wix Editor**
2. **Adicionar Elemento HTML**:
   - Clique em "Adicionar" (+)
   - Vá em "Embeds" → "HTML iframe"

3. **Configurar o iFrame**:
```html
<iframe 
  src="https://seu-dominio.vercel.app" 
  width="100%" 
  height="800px"
  frameborder="0"
  style="border: none; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
</iframe>
```

4. **Configurar Responsividade**:
```html
<div style="position: relative; width: 100%; height: 0; padding-bottom: 75%;">
  <iframe 
    src="https://seu-dominio.vercel.app"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    allowfullscreen>
  </iframe>
</div>
```

---

## 🔧 OPÇÃO 2: Wix Velo Integration

### Vantagens
- ✅ Integração nativa com Wix
- ✅ Melhor SEO
- ✅ Acesso a APIs do Wix
- ✅ Design totalmente customizável

### Desvantagens
- ❌ Mais complexo de implementar
- ❌ Requer conhecimento de Velo
- ❌ Limitações da plataforma Wix

### Passo a Passo

#### 2.1 Configurar Projeto Wix Velo

1. **Criar Site Wix**:
   - Acesse [wix.com](https://wix.com)
   - Crie um novo site
   - Ative o Wix Velo (Dev Mode)

2. **Instalar Wix CLI**:
```bash
npm install -g @wix/cli
wix login
```

3. **Clonar Site**:
```bash
wix pull
cd my-site
```

#### 2.2 Estrutura de Arquivos Wix

```
wix-site/
├── src/
│   ├── pages/
│   │   ├── dashboard.js
│   │   ├── estudantes.js
│   │   └── login.js
│   ├── backend/
│   │   ├── data.jsw
│   │   └── auth.jsw
│   └── public/
│       ├── components/
│       └── styles/
```

#### 2.3 Implementar Backend Wix

**backend/data.jsw**:
```javascript
import { query } from 'wix-data';
import wixUsers from 'wix-users';

export function getEstudantes() {
  return query("Estudantes")
    .find()
    .then((results) => {
      return results.items;
    });
}

export function createEstudante(estudanteData) {
  return wixData.insert("Estudantes", estudanteData);
}

export function authenticateUser(email, password) {
  return wixUsers.login(email, password);
}
```

**backend/auth.jsw**:
```javascript
import wixUsers from 'wix-users';

export function getCurrentUser() {
  return wixUsers.currentUser;
}

export function isUserLoggedIn() {
  return wixUsers.currentUser.loggedIn;
}
```

#### 2.4 Implementar Frontend Wix

**pages/dashboard.js**:
```javascript
import { getEstudantes } from 'backend/data.jsw';

$w.onReady(function () {
  loadDashboard();
});

async function loadDashboard() {
  try {
    const estudantes = await getEstudantes();
    
    $w('#estudantesCount').text = estudantes.length.toString();
    
    // Preencher tabela
    $w('#estudantesTable').rows = estudantes.map(e => ({
      nome: e.nome,
      email: e.email,
      status: e.status
    }));
    
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
  }
}
```

#### 2.5 Configurar Database Collections

No Wix Editor:
1. Vá em **Database** → **Content Manager**
2. Crie as seguintes coleções:

**Estudantes**:
```json
{
  "nome": "text",
  "email": "text",
  "telefone": "text",
  "matricula": "text",
  "curso": "text",
  "periodo": "text",
  "status": "text"
}
```

**Empresas**:
```json
{
  "nome": "text",
  "cnpj": "text",
  "email": "text",
  "telefone": "text",
  "endereco": "text",
  "status": "text"
}
```

---

## 🌐 OPÇÃO 3: Deploy Independente + Widget

### Vantagens
- ✅ Máxima flexibilidade
- ✅ Melhor performance
- ✅ Fácil manutenção
- ✅ Integração parcial com Wix

### Passo a Passo

#### 3.1 Deploy da Aplicação

```bash
# Deploy no Vercel
vercel --prod

# ou Deploy no Netlify
netlify deploy --prod --dir=out
```

#### 3.2 Criar Widget Wix

**wix-widget.js**:
```javascript
// Widget para comunicação entre Wix e EstagioPro
class EstagioProWidget {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = {
      url: 'https://estagio-pro.vercel.app',
      height: '800px',
      ...options
    };
    
    this.init();
  }
  
  init() {
    const container = document.getElementById(this.containerId);
    const iframe = this.createIframe();
    
    container.appendChild(iframe);
    this.setupMessageListener();
  }
  
  createIframe() {
    const iframe = document.createElement('iframe');
    iframe.src = this.options.url;
    iframe.style.width = '100%';
    iframe.style.height = this.options.height;
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    iframe.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    
    return iframe;
  }
  
  setupMessageListener() {
    window.addEventListener('message', (event) => {
      if (event.origin !== new URL(this.options.url).origin) return;
      
      if (event.data.type === 'RESIZE') {
        this.resize(event.data.height);
      }
      
      if (event.data.type === 'NAVIGATE') {
        this.onNavigate(event.data.path);
      }
    });
  }
  
  resize(height) {
    const iframe = document.querySelector(`#${this.containerId} iframe`);
    if (iframe) {
      iframe.style.height = height + 'px';
    }
  }
  
  onNavigate(path) {
    // Atualizar URL do Wix se necessário
    console.log('Navegando para:', path);
  }
}

// Uso no Wix
window.EstagioProWidget = EstagioProWidget;
```

#### 3.3 Implementar no Wix

**HTML Embed no Wix**:
```html
<div id="estagio-pro-container"></div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    new EstagioProWidget('estagio-pro-container', {
      url: 'https://seu-dominio.vercel.app',
      height: '800px'
    });
  });
</script>
```

---

## 🎨 Customização Visual

### Integração com Tema Wix

**CSS para harmonizar com Wix**:
```css
/* web/src/styles/wix-theme.css */
:root {
  --wix-primary: #116dff;
  --wix-secondary: #45474d;
  --wix-background: #ffffff;
  --wix-text: #162d3d;
}

.wix-integration {
  font-family: 'Madefor', sans-serif; /* Fonte padrão do Wix */
  --primary-600: var(--wix-primary);
  --secondary-900: var(--wix-text);
}
```

### Componente de Integração

**src/components/WixIntegration.tsx**:
```typescript
import { useEffect } from 'react';

interface WixIntegrationProps {
  onResize?: (height: number) => void;
  onNavigate?: (path: string) => void;
}

export const WixIntegration: React.FC<WixIntegrationProps> = ({
  onResize,
  onNavigate
}) => {
  useEffect(() => {
    // Comunicação com parent window (Wix)
    const sendMessage = (type: string, data: any) => {
      if (window.parent !== window) {
        window.parent.postMessage({ type, ...data }, '*');
      }
    };
    
    // Notificar mudanças de altura
    const resizeObserver = new ResizeObserver((entries) => {
      const height = entries[0].contentRect.height;
      sendMessage('RESIZE', { height });
      onResize?.(height);
    });
    
    resizeObserver.observe(document.body);
    
    return () => resizeObserver.disconnect();
  }, [onResize]);
  
  return null;
};
```

---

## 🔐 Configuração de Domínio e SSL

### 1. Domínio Personalizado

**Para Vercel**:
```bash
# Adicionar domínio
vercel domains add estagio.ufvjm.edu.br

# Configurar DNS
# CNAME: estagio -> cname.vercel-dns.com
```

**Para Netlify**:
```bash
# Configurar domínio customizado
netlify domains:add estagio.ufvjm.edu.br
```

### 2. SSL Certificate

Ambas as plataformas (Vercel/Netlify) fornecem SSL automático via Let's Encrypt.

---

## 📊 Monitoramento e Analytics

### 1. Google Analytics

**pages/_app.tsx**:
```typescript
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { gtag } from '@/lib/gtag';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);
  
  return <Component {...pageProps} />;
}
```

### 2. Wix Analytics Integration

```javascript
// Integração com Wix Analytics
import { analytics } from 'wix-analytics';

export function trackEvent(eventName, parameters) {
  if (typeof window !== 'undefined' && window.wixAnalytics) {
    analytics.track(eventName, parameters);
  }
}
```

---

## 🚀 Checklist de Deploy

### Pré-Deploy
- [ ] Configurar variáveis de ambiente
- [ ] Testar todas as funcionalidades
- [ ] Configurar Supabase RLS
- [ ] Otimizar imagens e assets
- [ ] Configurar CSP headers

### Deploy
- [ ] Build sem erros
- [ ] Deploy em ambiente de produção
- [ ] Configurar domínio personalizado
- [ ] Configurar SSL
- [ ] Testar responsividade

### Pós-Deploy
- [ ] Configurar monitoramento
- [ ] Configurar backups
- [ ] Documentar acessos
- [ ] Treinar usuários
- [ ] Configurar suporte

---

## 🆘 Troubleshooting

### Problemas Comuns

**1. iFrame não carrega**
```javascript
// Verificar CSP headers
// Adicionar no next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          }
        ]
      }
    ];
  }
};
```

**2. Problemas de CORS**
```typescript
// Configurar CORS no Supabase
// ou usar proxy no Next.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Sua lógica aqui
}
```

**3. Problemas de Autenticação**
```typescript
// Verificar configurações do Supabase
// Adicionar domínio nas configurações de Auth
```

---

## 📞 Suporte

Para dúvidas sobre a integração:

- **Email**: suporte.estagio@ufvjm.edu.br
- **Telefone**: (38) 3532-1200
- **Horário**: Segunda a Sexta, 8h às 18h

---

**© 2024 UFVJM - Universidade Federal dos Vales do Jequitinhonha e Mucuri**
