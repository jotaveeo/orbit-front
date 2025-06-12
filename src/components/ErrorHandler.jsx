import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  AlertTriangle, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Server, 
  Clock,
  ExternalLink,
  CheckCircle,
  XCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const ErrorHandler = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [apiStatus, setApiStatus] = useState('checking')
  const [lastCheck, setLastCheck] = useState(new Date())
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast.success('Conexão com a internet restaurada!')
      checkApiStatus()
    }

    const handleOffline = () => {
      setIsOnline(false)
      setApiStatus('offline')
      toast.error('Conexão com a internet perdida!')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Verifica status da API periodicamente
    const interval = setInterval(checkApiStatus, 30000) // A cada 30 segundos

    // Verifica status inicial
    checkApiStatus()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  const checkApiStatus = async () => {
    if (!isOnline) {
      setApiStatus('offline')
      return
    }

    try {
      setApiStatus('checking')
      const response = await fetch(`${API_URL}/api/health`, {
        method: 'GET'
        // timeout não é suportado nativamente pelo fetch, pode remover ou usar AbortController se necessário
      })

      if (response.ok) {
        setApiStatus('online')
        setRetryCount(0)
        if (lastCheck && Date.now() - lastCheck.getTime() > 60000) {
          toast.success('API está funcionando normalmente!')
        }
      } else {
        setApiStatus('error')
      }
    } catch (error) {
      console.error('Erro ao verificar status da API:', error)
      setApiStatus('error')
    } finally {
      setLastCheck(new Date())
    }
  }

  const handleWakeUpAPI = async () => {
    try {
      setRetryCount(prev => prev + 1)
      toast.loading('Ativando API...', { id: 'wake-up' })
      
      // Usa a URL da sua API configurada no .env
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'OPTIONS'
      })

      setTimeout(() => {
        checkApiStatus()
        toast.dismiss('wake-up')
      }, 3000)

    } catch (error) {
      toast.dismiss('wake-up')
      toast.error('Erro ao tentar ativar a API')
    }
  }

  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'checking':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'offline':
        return <WifiOff className="h-4 w-4 text-gray-500" />
      default:
        return <Server className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = () => {
    switch (apiStatus) {
      case 'online':
        return 'API Online'
      case 'checking':
        return 'Verificando...'
      case 'error':
        return 'API Indisponível'
      case 'offline':
        return 'Sem Internet'
      default:
        return 'Status Desconhecido'
    }
  }

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'checking':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'offline':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Mostra alerta se API estiver indisponível
  if (apiStatus === 'error' || !isOnline) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              {!isOnline ? (
                <WifiOff className="h-8 w-8 text-red-500" />
              ) : (
                <Server className="h-8 w-8 text-red-500" />
              )}
            </div>
            <CardTitle className="text-xl text-red-800">
              {!isOnline ? 'Sem Conexão com a Internet' : 'API Temporariamente Indisponível'}
            </CardTitle>
            <CardDescription>
              {!isOnline 
                ? 'Verifique sua conexão com a internet e tente novamente.'
                : 'A API do Manus está temporariamente indisponível. Isso é normal e pode ser resolvido ativando-a novamente.'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Status da Conexão */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm font-medium">Internet</span>
              </div>
              <Badge variant={isOnline ? 'default' : 'destructive'}>
                {isOnline ? 'Conectado' : 'Desconectado'}
              </Badge>
            </div>

            {/* Status da API */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="text-sm font-medium">API Status</span>
              </div>
              <Badge className={getStatusColor()}>
                {getStatusText()}
              </Badge>
            </div>

            {/* Última Verificação */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Última verificação</span>
              </div>
              <span className="text-sm text-gray-600">
                {lastCheck.toLocaleTimeString()}
              </span>
            </div>

            {/* Ações */}
            <div className="space-y-2">
              {isOnline && apiStatus === 'error' && (
                <Button 
                  onClick={handleWakeUpAPI} 
                  className="w-full"
                  disabled={apiStatus === 'checking'}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${apiStatus === 'checking' ? 'animate-spin' : ''}`} />
                  Ativar API {retryCount > 0 && `(Tentativa ${retryCount})`}
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={checkApiStatus} 
                className="w-full"
                disabled={apiStatus === 'checking'}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${apiStatus === 'checking' ? 'animate-spin' : ''}`} />
                Verificar Novamente
              </Button>

              <Button 
                variant="outline" 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Recarregar Página
              </Button>
            </div>

            {/* Informações Adicionais */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Sobre a API do Manus:</strong><br />
                A API pode entrar em modo de suspensão para economizar recursos. 
                Clique em "Ativar API" para reativá-la. Isso pode levar alguns segundos.
              </AlertDescription>
            </Alert>

            {/* Link para Documentação */}
            <div className="text-center">
              <Button variant="link" size="sm" asChild>
                <a 
                  href="https://docs.manus.space" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Documentação do Manus</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Status da API no canto da tela quando funcionando
  return (
    <div className="relative">
      {children}
      
      {/* Indicador de Status Flutuante */}
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="shadow-lg border-2">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="text-xs font-medium">{getStatusText()}</span>
              {apiStatus === 'checking' && (
                <Badge variant="outline" className="text-xs">
                  Verificando...
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ErrorHandler

