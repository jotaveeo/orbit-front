import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Zap, User, Lock, AlertTriangle } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [devMode, setDevMode] = useState(false)
  const [apiStatus, setApiStatus] = useState('unknown') // 'online', 'offline', 'standby', 'unknown'
  const navigate = useNavigate()

  // API URL com fallback
  const API_URL = import.meta.env.VITE_API_URL || "https://orbit-backend-new.onrender.com"
  const FALLBACK_URL = "https://orbit-backend-new.onrender.com"

  useEffect(() => {
    // Verifica se já está logado
    const token = localStorage.getItem('orbit_token')
    if (token) {
      navigate('/')
    }

    // Verifica status da API
    checkApiStatus()
  }, [navigate])

  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Timeout curto para não bloquear a interface
        signal: AbortSignal.timeout(5000)
      })
      
      if (response.ok) {
        setApiStatus('online')
      } else {
        setApiStatus('offline')
      }
    } catch (error) {
      // Se for erro de timeout, pode ser que a API esteja em standby no Render
      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        setApiStatus('standby')
      } else {
        setApiStatus('offline')
      }
      console.warn('API pode estar offline ou em standby:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Se estiver em modo dev, faz login direto sem chamar API
    if (devMode) {
      handleDevLogin()
      return
    }

    try {
      // Tenta primeiro a API principal com fallback
      const apiUrl = `${API_URL}/api/login`
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        // Timeout para não bloquear a interface se a API estiver em standby
        signal: AbortSignal.timeout(8000)
      }).catch(async (error) => {
        console.warn('Erro na API principal, tentando fallback:', error)
        
        // Se falhar, tenta o fallback
        const fallbackResponse = await fetch(`${FALLBACK_URL}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        })
        return fallbackResponse
      })

      const result = await response.json()

      if (result.success) {
        localStorage.setItem('orbit_token', result.token)
        localStorage.setItem('orbit_user', JSON.stringify(result.user))
        // Salva a URL da API que funcionou
        localStorage.setItem('orbit_api_url', response.url.includes(FALLBACK_URL) ? FALLBACK_URL : API_URL)
        
        toast.success(`Bem-vindo, ${result.user.username}!`)
        
        // Força o redirecionamento e recarregamento do contexto
        window.location.href = '/'
      } else {
        setError(result.message || 'Erro ao fazer login')
        toast.error(result.message || 'Credenciais inválidas')
      }
    } catch (error) {
      console.error('Erro no login:', error)
      setError('Erro de conexão. API pode estar em standby ou offline. Tente novamente ou use o modo de desenvolvimento.')
      toast.error('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const handleDevLogin = () => {
    // Simula login em modo de desenvolvimento
    const mockUser = {
      id: 999,
      username: credentials.username || 'dev',
      role: credentials.username === 'admin' ? 'Administrador' : 
            credentials.username === 'manager' ? 'Gerente de Setor' : 'Analista Backoffice'
    }
    
    const mockToken = 'dev-mode-token-' + Date.now()
    
    localStorage.setItem('orbit_token', mockToken)
    localStorage.setItem('orbit_user', JSON.stringify(mockUser))
    localStorage.setItem('orbit_dev_mode', 'true')
    
    toast.success(`Modo de desenvolvimento ativado! Bem-vindo, ${mockUser.username}!`)
    
    // Redireciona após um breve delay para mostrar o toast
    setTimeout(() => {
      window.location.href = '/'
    }, 1000)
    
    setLoading(false)
  }

  const handleDemoLogin = (username, password) => {
    setCredentials({ username, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Orbit</h1>
          <p className="text-gray-600 mt-2">Mesa de Pedidos Digital</p>
        </div>

        {/* API Status Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className={`h-3 w-3 rounded-full ${
            apiStatus === 'online' ? 'bg-green-500' : 
            apiStatus === 'standby' ? 'bg-yellow-500' : 
            apiStatus === 'offline' ? 'bg-red-500' : 'bg-gray-400'
          }`}></div>
          <span className="text-sm text-gray-600">
            API: {
              apiStatus === 'online' ? 'Online' : 
              apiStatus === 'standby' ? 'Em standby' : 
              apiStatus === 'offline' ? 'Offline' : 'Verificando...'
            }
          </span>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Entrar</CardTitle>
            <CardDescription className="text-center">
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Digite seu usuário"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Dev Mode Toggle */}
              <div className="flex items-center space-x-2">
                <Switch 
                  id="dev-mode" 
                  checked={devMode} 
                  onCheckedChange={setDevMode} 
                />
                <Label htmlFor="dev-mode" className="cursor-pointer">Modo Desenvolvimento</Label>
                {devMode && (
                  <div className="ml-auto text-xs text-amber-600 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Bypass da API
                  </div>
                )}
              </div>

              {(apiStatus === 'offline' || apiStatus === 'standby') && !devMode && (
                <Alert variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {apiStatus === 'standby' 
                      ? 'API em standby. Primeira requisição pode demorar até 30 segundos.' 
                      : 'API offline. Considere ativar o modo de desenvolvimento.'}
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? 'Entrando...' : devMode ? 'Entrar (Modo Dev)' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-gray-50 to-gray-100">
          <CardHeader>
            <CardTitle className="text-lg text-center">Credenciais de Demonstração</CardTitle>
            <CardDescription className="text-center">
              Clique em uma das opções abaixo para testar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDemoLogin('user', 'password')}
            >
              <User className="mr-2 h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Analista Backoffice</div>
                <div className="text-sm text-gray-500">user / password</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDemoLogin('manager', 'password')}
            >
              <User className="mr-2 h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Gerente de Setor</div>
                <div className="text-sm text-gray-500">manager / password</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleDemoLogin('admin', 'password')}
            >
              <User className="mr-2 h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Administrador</div>
                <div className="text-sm text-gray-500">admin / password</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
