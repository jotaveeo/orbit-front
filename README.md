# Orbit - Frontend

Projeto que surgiu no evento O-HACKA-TA-ON 2025, iniciativa entre a parceria entre a Universidade de Fortaleza - instituição mantida pela Fundação Edson Queiroz - e o grupo M. Dias Branco, um dos mantenedores do Unifor Hub. O objetivo foi impulsionar o ecossistema de inovação e capacitar novas gerações de talentos.

Este documento fornece instruções detalhadas para implementação e deploy do frontend Orbit, com melhorias de resiliência e experiência do usuário.

## Melhorias Implementadas

### 1. Fallback Inteligente para API
- Implementação de operador ternário para URLs da API: `import.meta.env.VITE_API_URL || "https://orbit-backend-new.onrender.com"`
- Sistema de fallback em cascata para garantir que a aplicação sempre tenha uma API para consumir
- Armazenamento da URL da API que funcionou para uso em requisições futuras

### 2. Tratamento para API em Standby
- Detecção automática do status da API (online, offline, standby)
- Timeout configurado para não bloquear a interface quando a API estiver em standby
- Indicador visual do status da API na interface

### 3. Loading Visual e Feedback
- Indicadores de carregamento em todas as operações principais
- Feedback visual para operações bem-sucedidas e falhas
- Animações suaves para melhorar a experiência do usuário

### 4. Mocks Visuais para Falhas da API
- Dados de demonstração exibidos quando a API falha
- Indicação visual clara de que os dados são mocks (transparência e bordas tracejadas)
- Preservação da navegabilidade mesmo com backend offline

### 5. Toggle para Modo Desenvolvimento
- Opção para bypass completo da API
- Login e navegação mesmo com backend indisponível
- Indicação visual clara do modo de desenvolvimento ativo

## Arquivos e Estrutura

```
orbit-frontend/
├── dist/                  # Build de produção pronto para deploy
├── public/                # Arquivos públicos estáticos
├── src/
│   ├── components/        # Componentes reutilizáveis
│   ├── contexts/          # Contextos React (AuthContext com fallback)
│   ├── pages/             # Páginas da aplicação
│   ├── App.jsx            # Componente principal
│   └── main.jsx           # Ponto de entrada
├── .env                   # Configuração da URL da API
├── package.json           # Dependências e scripts
└── vite.config.js         # Configuração do Vite
```

## Instruções de Deploy

### 1. Deploy Local (Desenvolvimento)

```bash
# Extrair o ZIP
unzip orbit_frontend_final.zip -d orbit-frontend
cd orbit-frontend

# Instalar dependências
npm install
# ou
pnpm install

# Iniciar em modo de desenvolvimento
npm run dev
# ou
pnpm dev
```

### 2. Deploy em Produção (Netlify/Vercel)

#### Opção 1: Deploy via Git
1. Faça upload do código para seu repositório GitHub
2. Conecte o repositório ao Netlify ou Vercel
3. Configure a variável de ambiente `VITE_API_URL=https://orbit-backend-new.onrender.com`
4. Inicie o deploy

#### Opção 2: Deploy Direto (usando o build pré-compilado)
1. No Netlify, use a opção "Deploy manually"
2. Arraste e solte a pasta `dist` para o campo de upload
3. Configure a variável de ambiente `VITE_API_URL=https://orbit-backend-new.onrender.com`

### 3. Deploy via CLI do Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login no Netlify
netlify login

# Deploy do site
netlify deploy --prod --dir=dist
```

## Configuração da API

O frontend está configurado para usar a API na seguinte ordem de prioridade:

1. URL definida em `.env` como `VITE_API_URL`
2. URL padrão: `https://orbit-backend-new.onrender.com`
3. URL de fallback: `https://xkrmeuav4rx6g3sj.manus.space`

Para alterar a URL da API, edite o arquivo `.env`:

```
VITE_API_URL=https://sua-api-personalizada.com
```

## Recursos de Resiliência

### Modo de Desenvolvimento
- Ative o toggle "Modo Desenvolvimento" na tela de login para usar a aplicação mesmo com API offline
- Todos os dados serão simulados localmente
- Ideal para demonstrações ou quando o backend estiver indisponível

### Tratamento de Standby
- A aplicação detecta automaticamente quando a API está em standby no Render
- Exibe indicador visual e aguarda até que a API esteja disponível
- Implementa timeout para não bloquear a interface

### Mocks Visuais
- Quando a API falha, a aplicação exibe dados de demonstração
- Os dados mockados são claramente identificados visualmente
- A navegação e interatividade são preservadas mesmo sem backend

## Solução de Problemas

### API em Standby
O plano gratuito do Render desativa serviços após 15 minutos de inatividade. Na primeira requisição após inatividade, pode haver um atraso de até 30 segundos para reiniciar o serviço.

**Solução**: A aplicação detecta automaticamente este estado e exibe feedback visual apropriado.

### Erros de CORS
Se encontrar erros de CORS ao acessar a API:

1. Verifique se a API está configurada para aceitar requisições do domínio do frontend
2. Use o modo de desenvolvimento para bypass temporário

### Problemas de Login
Se não conseguir fazer login mesmo com a API online:

1. Verifique se as credenciais estão corretas (padrão: admin/password)
2. Ative o modo de desenvolvimento para bypass da autenticação
3. Verifique os logs do console para mensagens de erro específicas
