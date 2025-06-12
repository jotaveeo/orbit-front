import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [apiUrl, setApiUrl] = useState('')
  const [isDevMode, setIsDevMode] = useState(false)

  useEffect(() => {
    // Verifica se há um token salvo
    const token = localStorage.getItem('orbit_token')
    const savedUser = localStorage.getItem('orbit_user')
    const savedApiUrl = localStorage.getItem('orbit_api_url')
    const devMode = localStorage.getItem('orbit_dev_mode') === 'true'
    
    // Define a URL da API (com fallback)
    const defaultApiUrl = import.meta.env.VITE_API_URL || "https://orbit-backend-new.onrender.com"
    setApiUrl(savedApiUrl || defaultApiUrl)
    setIsDevMode(devMode)
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
        logout()
      }
    }
    
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('orbit_token', token)
    localStorage.setItem('orbit_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('orbit_token')
    localStorage.removeItem('orbit_user')
    localStorage.removeItem('orbit_dev_mode')
    setUser(null)
    setIsDevMode(false)
  }

  const getToken = () => {
    return localStorage.getItem('orbit_token')
  }

  const hasPermission = (requiredRole) => {
    if (!user) return false
    
    const roleHierarchy = {
      'Analista Backoffice': 1,
      'Gerente de Setor': 2,
      'Administrador': 3
    }
    
    const userLevel = roleHierarchy[user.role] || 0
    const requiredLevel = roleHierarchy[requiredRole] || 0
    
    return userLevel >= requiredLevel
  }

  // Função para obter a URL da API com fallback
  const getApiUrl = () => {
    // Fallback em ordem de prioridade
    return apiUrl || import.meta.env.VITE_API_URL || "https://orbit-backend-new.onrender.com"
  }

  // Função para fazer fetch com fallback e tratamento de erro
  const fetchWithFallback = async (endpoint, options = {}) => {
    if (isDevMode) {
      console.log('Modo de desenvolvimento ativo, retornando mock data para:', endpoint)
      return getMockData(endpoint)
    }

    const mainApiUrl = getApiUrl()
    const fallbackUrl = "https://orbit-backend-new.onrender.com"
    
    try {
      // Adiciona timeout para não bloquear a interface se a API estiver em standby
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)
      
      const response = await fetch(`${mainApiUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
          ...options.headers
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.warn(`Erro na API principal (${mainApiUrl}), tentando fallback:`, error)
      
      try {
        // Tenta o fallback
        const fallbackResponse = await fetch(`${fallbackUrl}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
            ...options.headers
          }
        })
        
        if (!fallbackResponse.ok) {
          throw new Error(`Fallback API error: ${fallbackResponse.status}`)
        }
        
        // Atualiza a URL da API para usar o fallback nas próximas requisições
        localStorage.setItem('orbit_api_url', fallbackUrl)
        setApiUrl(fallbackUrl)
        
        return await fallbackResponse.json()
      } catch (fallbackError) {
        console.error('Erro também no fallback, retornando mock data:', fallbackError)
        return getMockData(endpoint)
      }
    }
  }

  // Função para gerar dados mock com base no endpoint
  const getMockData = (endpoint) => {
    // Dados mock para diferentes endpoints
    const mockData = {
      '/api/cards': {
        success: true,
        cards: [
          {
            id: 1,
            title: 'RC-2025-001 (Mock)',
            description: 'Requisição de compra para equipamentos de TI',
            status: 'pending',
            priority: 'high',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            title: 'RC-2025-002 (Mock)',
            description: 'Compra de material de escritório',
            status: 'approved',
            priority: 'medium',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 3,
            title: 'RC-2025-003 (Mock)',
            description: 'Contratação de serviços de limpeza',
            status: 'in_progress',
            priority: 'low',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      },
      '/api/sla': {
        success: true,
        metrics: {
          sla_targets: {
            requisicao_compra: {target: 2, unit: 'dias'},
            aprovacao_requisicao: {target: 4, unit: 'dias'},
            lancamento_nf: {target: 2, unit: 'dias'}
          },
          current_performance: {
            requisicao_compra: {average: 1.8, compliance: 95},
            aprovacao_requisicao: {average: 3.2, compliance: 88},
            lancamento_nf: {average: 1.5, compliance: 98}
          },
          deadlines: {
            nf_mercadoria: 'Último dia útil do mês',
            nf_servico: 'Dia 24 de cada mês'
          }
        }
      }
    }
    
    // Retorna dados mock para o endpoint específico ou um objeto vazio
    return mockData[endpoint] || { success: true, message: 'Mock data', data: [] }
  }

  const value = {
    user,
    login,
    logout,
    getToken,
    hasPermission,
    loading,
    isAuthenticated: !!user,
    isDevMode,
    getApiUrl,
    fetchWithFallback
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
