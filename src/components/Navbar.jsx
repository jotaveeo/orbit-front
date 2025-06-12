import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  LayoutDashboard, 
  Upload, 
  Download, 
  Trophy,
  Zap,
  Star,
  Settings,
  LogOut,
  TrendingUp,
  Menu,
  X,
  Bell,
  HelpCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, hasPermission } = useAuth()
  const [userScore, setUserScore] = useState(null)
  const [dynamicMode, setDynamicMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([])

  const fetchUserScore = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user-score`)
      const result = await response.json()
      
      if (result.success) {
        setUserScore(result.data)
      }
    } catch (error) {
      console.error('Erro ao carregar pontuação:', error)
      // Fallback
      setUserScore({
        score: 1250,
        level: 3
      })
    }
  }

  const toggleDynamicMode = async () => {
    try {
      const response = await fetch(`${API_URL}/api/toggle-dynamic-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: !dynamicMode })
      })

      const result = await response.json()
      
      if (result.success) {
        setDynamicMode(result.enabled)
        toast.success(result.message)
        
        // Se ativou o modo dinâmico, inicia as notificações
        if (result.enabled) {
          startNotifications()
        } else {
          setNotifications([])
        }
      } else {
        toast.error('Erro ao alterar modo dinâmico')
      }
    } catch (error) {
      console.error('Erro ao alterar modo dinâmico:', error)
      toast.error('Erro de conexão')
    }
  }

  const startNotifications = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/api/notification-message`)
        const result = await response.json()
        
        if (result.success) {
          const notification = {
            id: Date.now(),
            message: result.data.message,
            timestamp: new Date()
          }
          
          setNotifications(prev => [notification, ...prev.slice(0, 4)]) // Mantém apenas 5 notificações
          toast.success(result.data.message, {
            icon: '🔔',
            duration: 3000
          })
        }
      } catch (error) {
        console.error('Erro ao buscar notificação:', error)
      }
    }, 10000) // A cada 10 segundos

    return interval
  }

  useEffect(() => {
    fetchUserScore()
    
    // Atualiza a cada 30 segundos
    const scoreInterval = setInterval(fetchUserScore, 30000)
    
    let notificationInterval
    if (dynamicMode) {
      notificationInterval = startNotifications()
    }
    
    return () => {
      clearInterval(scoreInterval)
      if (notificationInterval) {
        clearInterval(notificationInterval)
      }
    }
  }, [dynamicMode])

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logout realizado com sucesso!')
  }

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/upload', label: 'Upload', icon: Upload },
    { path: '/download', label: 'Download', icon: Download },
    { path: '/sla', label: 'SLA/SLO', icon: TrendingUp },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
  ]

  // Adiciona Settings apenas para administradores
  if (hasPermission('Administrador')) {
    navItems.push({ path: '/settings', label: 'Configurações', icon: Settings })
  }

  const getLevelColor = (level) => {
    if (level >= 7) return 'from-purple-500 to-pink-500'
    if (level >= 5) return 'from-orange-500 to-red-500'
    if (level >= 3) return 'from-green-500 to-blue-500'
    return 'from-blue-500 to-purple-500'
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">Orbit</h1>
              <p className="text-xs text-gray-500">Mesa de Pedidos Digital</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center space-x-2 ${
                      isActive 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden xl:inline">{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Toggle Dados Dinâmicos */}
            <div className="hidden md:flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
              <TrendingUp className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 hidden lg:inline">
                Dados Crescentes
              </span>
              <Switch
                checked={dynamicMode}
                onCheckedChange={toggleDynamicMode}
                className="data-[state=checked]:bg-green-600"
              />
            </div>

            {/* Notificações */}
            {notifications.length > 0 && (
              <div className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                    {notifications.length}
                  </Badge>
                </Button>
              </div>
            )}
            
            {/* Gamification Score */}
            {userScore && (
              <div className="hidden md:flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-2 rounded-lg border border-yellow-200">
                  <div className={`bg-gradient-to-r ${getLevelColor(userScore.level)} p-1.5 rounded-full`}>
                    <Star className="h-3 w-3 text-white" />
                  </div>
                  <div className="text-xs">
                    <p className="font-medium text-gray-900">Nível {userScore.level}</p>
                    <p className="text-xs text-gray-600">{userScore.score.toLocaleString()} pts</p>
                  </div>
                </div>
              </div>
            )}

            {/* User Info & Logout */}
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Sair</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActive 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
            
            {/* Mobile Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Habilitar Dados Crescentes
                </span>
              </div>
              <Switch
                checked={dynamicMode}
                onCheckedChange={toggleDynamicMode}
                className="data-[state=checked]:bg-green-600"
              />
            </div>

            {/* Mobile Score */}
            {userScore && (
              <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`bg-gradient-to-r ${getLevelColor(userScore.level)} p-2 rounded-full`}>
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Nível {userScore.level}</p>
                      <p className="text-sm text-gray-600">{userScore.score.toLocaleString()} pontos</p>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold"
                  >
                    <Trophy className="h-3 w-3 mr-1" />
                    {userScore.score.toLocaleString()}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

