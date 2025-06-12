import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  FileText, 
  Code, 
  RefreshCw, 
  Mail,
  Database,
  Settings,
  Clock,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react'

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const faqData = [
    {
      id: 'rc',
      category: 'Conceitos Básicos',
      icon: <FileText className="h-5 w-5" />,
      question: 'O que é uma RC?',
      answer: `RC significa "Requisição de Compra". É um documento formal usado para solicitar a aquisição de produtos ou serviços dentro da organização.

**Características principais:**
• **Identificação única**: Cada RC possui um código único (ex: RC-1001)
• **Workflow de aprovação**: Passa por diferentes status (Solicitado → Em Análise → Aprovado → Recebido)
• **Controle financeiro**: Inclui valor estimado e centro de custo
• **Rastreabilidade**: Histórico completo de ações e responsáveis

**Tipos de RC:**
• **Padrão**: Compras regulares de produtos/serviços
• **Contrato**: Renovações ou aditivos contratuais
• **Interna**: Transferências entre unidades
• **Delegada**: Compras com aprovação delegada

A RC é o ponto central do processo de compras, permitindo controle, auditoria e gestão eficiente dos recursos.`
    },
    {
      id: 'miro',
      category: 'Sistemas Integrados',
      icon: <Code className="h-5 w-5" />,
      question: 'O que é código Miro?',
      answer: `O código Miro é um identificador único usado no sistema de gestão de projetos e colaboração visual da empresa.

**Funcionalidades:**
• **Identificação de projetos**: Cada projeto possui um código Miro único
• **Integração com RC**: RCs podem ser vinculadas a projetos específicos
• **Rastreamento visual**: Permite acompanhar o progresso em boards visuais
• **Colaboração**: Facilita o trabalho em equipe em projetos complexos

**Formato típico:**
• Exemplo: MIRO_ABC123, PROJ_2025_001
• Geralmente alfanumérico com prefixos identificadores

**Integração com Orbit:**
O sistema Orbit reconhece automaticamente códigos Miro em emails e documentos, criando vínculos automáticos entre RCs e projetos para melhor rastreabilidade.`
    },
    {
      id: 'atualizacao',
      category: 'Sistema',
      icon: <RefreshCw className="h-5 w-5" />,
      question: 'De quanto em quanto tempo os dados são atualizados?',
      answer: `O sistema Orbit possui diferentes frequências de atualização dependendo do tipo de dados:

**Atualizações em Tempo Real:**
• **Status de RCs**: Imediatamente após mudanças
• **Comentários e anexos**: Instantâneo
• **Notificações**: Em tempo real via WebSocket

**Atualizações Periódicas:**
• **Dashboard principal**: A cada 30 segundos
• **Métricas de SLA/SLO**: A cada 5 minutos
• **Dados de gamificação**: A cada 10 minutos
• **Ranking de unidades**: A cada 15 minutos

**Atualizações Programadas:**
• **Integração SAP**: 4x por dia (6h, 12h, 18h, 24h)
• **Sincronização COUPA**: 2x por dia (8h, 20h)
• **Backup de dados**: Diariamente às 2h
• **Relatórios consolidados**: Semanalmente

**Modo Dados Crescentes:**
Quando ativado, simula atualizações mais frequentes para demonstração, com novos dados a cada 10 segundos.

Você pode forçar uma atualização manual clicando no botão "Atualizar" em qualquer tela.`
    },
    {
      id: 'integracao',
      category: 'Integrações',
      icon: <Database className="h-5 w-5" />,
      question: 'Como que o SAP, RC, COUPA e Miro se conversam e interagem com e-mails?',
      answer: `O Orbit atua como um hub central que integra todos esses sistemas através de APIs e processamento inteligente de e-mails:

**Fluxo de Integração:**

**1. SAP (Sistema ERP)**
• **Entrada**: Dados financeiros, centros de custo, aprovações
• **Saída**: Status de RCs aprovadas, dados para faturamento
• **Frequência**: Sincronização 4x por dia
• **Formato**: XML/JSON via API REST

**2. COUPA (Procurement)**
• **Entrada**: Catálogos de fornecedores, cotações, contratos
• **Saída**: RCs para processo de compra
• **Frequência**: Sincronização 2x por dia
• **Formato**: JSON via API REST

**3. Miro (Gestão de Projetos)**
• **Entrada**: Códigos de projeto, status, responsáveis
• **Saída**: RCs vinculadas a projetos
• **Frequência**: Tempo real via webhooks
• **Formato**: JSON via API REST

**4. Processamento de E-mails:**
• **Algoritmo de Vinculação Automática**:
  - Analisa assunto e corpo do e-mail
  - Extrai códigos RC, Miro, SAP, COUPA usando regex
  - Vincula automaticamente aos registros correspondentes
  - Notifica responsáveis sobre atualizações

**Exemplo de Fluxo Completo:**
1. RC criada no Orbit (RC-1001)
2. Enviada para aprovação no SAP
3. E-mail de aprovação recebido: "SAP: Documento 123456 aprovado para RC-1001"
4. Sistema vincula automaticamente o documento SAP à RC
5. Status atualizado para "Aprovado"
6. Notificação enviada ao solicitante
7. RC enviada para COUPA para processo de compra
8. Se vinculada a projeto Miro, atualiza status no board visual

**Benefícios:**
• **Rastreabilidade completa**: Histórico unificado
• **Redução de erros**: Vinculação automática
• **Eficiência**: Menos trabalho manual
• **Visibilidade**: Dashboard centralizado`
    },
    {
      id: 'sla',
      category: 'Gestão de Prazos',
      icon: <Clock className="h-5 w-5" />,
      question: 'Como funcionam os prazos e SLA do sistema?',
      answer: `O sistema Orbit implementa um rigoroso controle de SLA (Service Level Agreement) baseado em diferentes tipos de demanda:

**Prazos por Tipo de Demanda:**

**Requisições de Compra (RC):**
• **Geração da RC**: 2 dias após recebimento do e-mail
• **Aprovação**: 2-4 dias (varia conforme valor)
  - Até R$ 10.000: 2 dias
  - Acima R$ 10.000: 4 dias
• **Lançamento NF via OTRS**: 2 dias

**Notas Fiscais:**
• **NF de Mercadoria**: Até o último dia útil do mês
• **NF de Serviço**: Até o dia 24 de cada mês

**Indicadores de Performance:**

**SLI (Service Level Indicators):**
• Taxa de cumprimento de prazo
• Tempo médio de resolução
• Percentual de demandas críticas
• Taxa de retrabalho

**SLO (Service Level Objectives):**
• Meta: 95% das demandas cumpridas no prazo
• Máximo: 10% de demandas críticas/vencidas
• Tempo médio: Máximo 8 dias para RCs completas

**Status de Criticidade:**
• **🟢 No Prazo**: Mais de 5 dias restantes
• **🟡 Atenção**: 3-5 dias restantes
• **🟠 Crítico**: 1-2 dias restantes
• **🔴 Vencido**: Prazo ultrapassado

O dashboard SLA/SLO fornece visibilidade completa sobre performance e permite ações preventivas.`
    },
    {
      id: 'gamificacao',
      category: 'Gamificação',
      icon: <CheckCircle className="h-5 w-5" />,
      question: 'Como funciona o sistema de gamificação?',
      answer: `O Orbit possui um sistema de gamificação completo para engajar usuários e reconhecer boas práticas:

**Sistema de Pontuação:**
• **RC criada**: +50 pontos
• **RC aprovada rapidamente**: +100 pontos
• **Documentação completa**: +25 pontos
• **Feedback positivo**: +30 pontos
• **Meta mensal atingida**: +200 pontos

**Níveis de Usuário:**
• **Nível 1-2**: Iniciante (0-500 pts)
• **Nível 3-4**: Intermediário (500-1500 pts)
• **Nível 5-6**: Avançado (1500-3000 pts)
• **Nível 7+**: Expert (3000+ pts)

**Coleção de Cartas:**
• **Cartas Comuns**: Conquistas básicas
• **Cartas Raras**: Marcos importantes
• **Cartas Épicas**: Conquistas excepcionais
• **Cartas Lendárias**: Recordes e feitos únicos

**Ranking por Unidades:**
• Competição saudável entre unidades
• Métricas: eficiência, qualidade, cumprimento de prazos
• Reconhecimento mensal das melhores unidades

**Benefícios:**
• Maior engajamento dos usuários
• Melhoria na qualidade dos processos
• Reconhecimento de boas práticas
• Competição saudável entre equipes`
    },
    {
      id: 'cards',
      category: 'Interface',
      icon: <Settings className="h-5 w-5" />,
      question: 'Como abrir e visualizar detalhes dos cards?',
      answer: `Os cards no Orbit são interativos e fornecem acesso completo às informações das RCs:

**Como Abrir um Card:**
• **Clique simples**: Em qualquer lugar do card no quadro Kanban
• **Atalho de teclado**: Selecione o card e pressione Enter
• **Menu contextual**: Clique direito → "Ver Detalhes"

**Informações Disponíveis:**

**Aba Detalhes:**
• Informações básicas (criador, data, valor)
• Informações financeiras (centro de custo, conta contábil)
• Descrição completa e justificativa
• Status atual e responsável

**Aba Anexos:**
• Lista de documentos anexados
• Visualização inline de PDFs e imagens
• Download de arquivos
• Upload de novos anexos

**Aba Comentários:**
• Histórico de comunicação
• Adicionar novos comentários
• Menções a outros usuários
• Notificações automáticas

**Aba Histórico:**
• Timeline completa de ações
• Mudanças de status
• Usuários responsáveis por cada ação
• Timestamps precisos

**Funcionalidades Interativas:**
• **Edição inline**: Campos editáveis diretamente no modal
• **Drag & Drop**: Arrastar arquivos para anexar
• **Notificações**: Atualizações em tempo real
• **Compartilhamento**: Link direto para o card

**Atalhos Úteis:**
• **Esc**: Fechar modal
• **Tab**: Navegar entre abas
• **Ctrl+E**: Modo edição
• **Ctrl+S**: Salvar alterações`
    },
    {
      id: 'api-indisponivel',
      category: 'Problemas Técnicos',
      icon: <AlertTriangle className="h-5 w-5" />,
      question: 'O que fazer quando a API está indisponível?',
      answer: `Quando a API do Manus está temporariamente indisponível, o sistema exibe uma tela de erro com opções de resolução:

**Por que isso acontece?**
• O Manus usa suspensão automática para economizar recursos
• Após período de inatividade, a API "dorme"
• Isso é normal e esperado na plataforma

**Como Resolver:**

**1. Ativação Automática:**
• Clique no botão "Ativar API"
• Aguarde 10-30 segundos para reativação
• O sistema tentará reconectar automaticamente

**2. Verificação Manual:**
• Use "Verificar Novamente" para testar conectividade
• Verifique sua conexão com internet
• Confirme se não há bloqueios de firewall

**3. Recarregamento:**
• Como último recurso, recarregue a página
• Isso força uma nova tentativa de conexão

**Indicadores de Status:**
• **🟢 API Online**: Funcionando normalmente
• **🟡 Verificando**: Testando conectividade
• **🔴 API Indisponível**: Necessita ativação
• **⚫ Sem Internet**: Problema de conectividade local

**Prevenção:**
• Mantenha a aplicação ativa durante o uso
• Use o modo "Dados Crescentes" para manter atividade
• Salve trabalhos importantes regularmente

**Suporte:**
Se o problema persistir após várias tentativas, entre em contato com o suporte técnico através da documentação do Manus.`
    }
  ]

  const filteredFAQ = faqData.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categories = [...new Set(faqData.map(item => item.category))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Perguntas Frequentes</h1>
          <p className="text-gray-600 mt-2">
            Encontre respostas para as dúvidas mais comuns sobre o sistema Orbit
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar nas perguntas frequentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge key={category} variant="outline" className="cursor-pointer hover:bg-blue-50">
            {category}
          </Badge>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQ.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum resultado encontrado
              </h3>
              <p className="text-gray-600">
                Tente usar termos diferentes ou navegue pelas categorias disponíveis.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredFAQ.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <Collapsible
                open={openItems[item.id]}
                onOpenChange={() => toggleItem(item.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {item.icon}
                        </div>
                        <div className="text-left">
                          <CardTitle className="text-lg">{item.question}</CardTitle>
                          <CardDescription>
                            <Badge variant="secondary" className="mt-1">
                              {item.category}
                            </Badge>
                          </CardDescription>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`h-5 w-5 text-gray-500 transition-transform ${
                          openItems[item.id] ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                        {item.answer}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))
        )}
      </div>

      {/* Help Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Mail className="h-5 w-5" />
            <span>Precisa de mais ajuda?</span>
          </CardTitle>
          <CardDescription>
            Não encontrou a resposta que procurava? Entre em contato conosco.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Enviar E-mail</span>
            </Button>
            <Button variant="outline" asChild>
              <a 
                href="https://docs.manus.space" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Documentação Completa</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FAQPage

