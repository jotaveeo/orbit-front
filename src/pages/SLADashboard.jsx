import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Target,
  Calendar,
  BarChart3
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const API_URL = import.meta.env.VITE_API_URL || "https://orbit-backend-new.onrender.com"

const SLADashboard = () => {
  const [slaData, setSlaData] = useState(null)
  const [historico, setHistorico] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSLAData()
    fetchHistorico()
  }, [])

  const fetchSLAData = async () => {
    try {
      const token = localStorage.getItem('orbit_token')
      const response = await fetch(`${API_URL}/api/sla-dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        setSlaData(result.data)
      }
    } catch (error) {
      console.error('Erro ao carregar dados SLA:', error)
    }
  }

  const fetchHistorico = async () => {
    try {
      const token = localStorage.getItem('orbit_token')
      const response = await fetch(`${API_URL}/api/sla-historico`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        setHistorico(result.data)
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'NO_PRAZO': return 'bg-green-500'
      case 'ATENÇÃO': return 'bg-yellow-500'
      case 'CRÍTICO': return 'bg-orange-500'
      case 'VENCIDO': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'NO_PRAZO': return <CheckCircle className="h-4 w-4" />
      case 'ATENÇÃO': return <Clock className="h-4 w-4" />
      case 'CRÍTICO': return <AlertTriangle className="h-4 w-4" />
      case 'VENCIDO': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!slaData) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar dados de SLA. Tente novamente.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard SLA/SLI/SLO</h1>
          <p className="text-gray-600 mt-2">Monitoramento de prazos e indicadores de performance</p>
        </div>
      </div>

      {/* Alertas */}
      {slaData.alertas && slaData.alertas.length > 0 && (
        <div className="space-y-2">
          {slaData.alertas.map((alerta, index) => (
            <Alert key={index} className={alerta.criticidade === 'ALTA' ? 'border-red-500' : 'border-yellow-500'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{alerta.mensagem}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Demandas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{slaData.resumo.total_requisicoes}</div>
            <p className="text-xs text-muted-foreground">Requisições ativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Prazo</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{slaData.resumo.no_prazo}</div>
            <p className="text-xs text-muted-foreground">
              {slaData.resumo.percentual_cumprimento}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{slaData.resumo.criticas}</div>
            <p className="text-xs text-muted-foreground">Próximas do vencimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{slaData.resumo.vencidas}</div>
            <p className="text-xs text-muted-foreground">Fora do prazo</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="indicadores" className="space-y-4">
        <TabsList>
          <TabsTrigger value="indicadores">Indicadores SLI/SLO</TabsTrigger>
          <TabsTrigger value="demandas">Demandas por Status</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="indicadores" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SLI - Service Level Indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  SLI - Indicadores de Nível de Serviço
                </CardTitle>
                <CardDescription>Métricas atuais de performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Cumprimento de Prazo</span>
                    <span className="font-medium">{slaData.sli.cumprimento_prazo}%</span>
                  </div>
                  <Progress value={slaData.sli.cumprimento_prazo} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Demandas Críticas</span>
                    <span className="font-medium">{slaData.sli.demandas_criticas}%</span>
                  </div>
                  <Progress value={slaData.sli.demandas_criticas} className="h-2" />
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Tempo Médio de Resolução</span>
                    <span className="font-medium">{slaData.sli.tempo_medio_resolucao} dias</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa de Retrabalho</span>
                    <span className="font-medium">{slaData.sli.taxa_retrabalho}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SLO - Service Level Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  SLO - Objetivos de Nível de Serviço
                </CardTitle>
                <CardDescription>Metas e status de cumprimento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Meta de Cumprimento</p>
                    <p className="text-sm text-gray-600">≥ {slaData.slo.meta_cumprimento}%</p>
                  </div>
                  <Badge 
                    variant={slaData.slo.status_cumprimento === 'ATINGIDO' ? 'default' : 'destructive'}
                  >
                    {slaData.slo.status_cumprimento}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Meta de Criticidade</p>
                    <p className="text-sm text-gray-600">≤ {slaData.slo.meta_criticidade}%</p>
                  </div>
                  <Badge 
                    variant={slaData.slo.status_criticidade === 'ATINGIDO' ? 'default' : 'destructive'}
                  >
                    {slaData.slo.status_criticidade}
                  </Badge>
                </div>

                <Alert className="mt-4">
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Prazos por Tipo de Demanda:</strong><br />
                    • RC: 2 dias para gerar + 2-4 dias aprovação + 2 dias NF<br />
                    • NF Mercadoria: até último dia útil do mês<br />
                    • NF Serviço: até dia 24 de cada mês
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demandas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demandas por Status de SLA</CardTitle>
              <CardDescription>Lista detalhada de todas as demandas ativas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {slaData.requisicoes.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(req.status)}`}></div>
                      <div>
                        <p className="font-medium">{req.id}</p>
                        <p className="text-sm text-gray-600">{req.responsavel}</p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm font-medium">R$ {req.valor?.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">{req.status_atual}</p>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getStatusIcon(req.status)}
                        {req.status.replace('_', ' ')}
                      </Badge>
                      <p className="text-xs text-gray-600 mt-1">
                        {req.dias_restantes > 0 ? `${req.dias_restantes} dias restantes` : `${Math.abs(req.dias_restantes)} dias em atraso`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolução do Cumprimento de SLA</CardTitle>
                <CardDescription>Percentual de demandas cumpridas no prazo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="cumprimento" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={{ fill: '#2563eb' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demandas Críticas e Vencidas</CardTitle>
                <CardDescription>Evolução de demandas fora do prazo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={historico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="criticas" fill="#f59e0b" name="Críticas" />
                    <Bar dataKey="vencidas" fill="#ef4444" name="Vencidas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SLADashboard

