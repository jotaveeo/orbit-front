import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

const StatsCards = () => {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/dashboard-stats`)
      .then(res => res.json())
      .then(result => {
        setStats(result.data)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const getStatusColor = (status) => {
    const colors = {
      'Solicitado': 'bg-blue-100 text-blue-800',
      'Em Análise': 'bg-yellow-100 text-yellow-800',
      'Aprovado': 'bg-green-100 text-green-800',
      'Recebido': 'bg-purple-100 text-purple-800',
      'Rejeitado': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    const icons = {
      'Solicitado': <FileText className="h-4 w-4" />,
      'Em Análise': <Clock className="h-4 w-4" />,
      'Aprovado': <CheckCircle className="h-4 w-4" />,
      'Recebido': <CheckCircle className="h-4 w-4" />,
      'Rejeitado': <XCircle className="h-4 w-4" />
    }
    return icons[status] || <AlertCircle className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Requisições</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total_requisicoes || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+12% este mês</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.valor_total)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+8% este mês</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Análise</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.status_distribution?.['Em Análise'] || 0}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-yellow-600">Requer atenção</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats.status_distribution?.['Aprovado'] || 0) + 
                   (stats.status_distribution?.['Recebido'] || 0)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">Meta atingida</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution */}
      {stats.status_distribution && (
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(stats.status_distribution).map(([status, count]) => (
                <Badge
                  key={status}
                  variant="secondary"
                  className={`${getStatusColor(status)} flex items-center space-x-2 px-3 py-2`}
                >
                  {getStatusIcon(status)}
                  <span>{status}: {count}</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default StatsCards

