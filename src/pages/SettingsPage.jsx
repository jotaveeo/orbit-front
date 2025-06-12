import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Settings, 
  Users, 
  Shield, 
  UserCheck, 
  UserX,
  Crown,
  Save
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'
import { parseApiResponse } from "@/lib/utils"

const SettingsPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()

  useEffect(() => {
    fetchUsers()
  }, [])

  // Exemplo para /api/users
  const fetchUsers = async () => {
    const response = await fetch(`${API_URL}/api/users`)
    const result = await parseApiResponse(response, "users")
    if (result.success) {
      setUsers(result.users)
    }
  }

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ role: newRole })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ))
        toast.success('Permissão atualizada com sucesso!')
      } else {
        toast.error('Erro ao atualizar permissão')
      }
    } catch (error) {
      console.error('Erro ao atualizar permissão:', error)
      toast.error('Erro de conexão')
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Administrador':
        return <Crown className="h-4 w-4 text-yellow-600" />
      case 'Gerente de Setor':
        return <Shield className="h-4 w-4 text-blue-600" />
      case 'Analista Backoffice':
        return <UserCheck className="h-4 w-4 text-green-600" />
      default:
        return <UserX className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'Administrador':
        return 'bg-yellow-100 text-yellow-800'
      case 'Gerente de Setor':
        return 'bg-blue-100 text-blue-800'
      case 'Analista Backoffice':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const roles = ['Analista Backoffice', 'Gerente de Setor', 'Administrador']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Settings className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Gerencie usuários e permissões do sistema</p>
        </div>
      </div>

      {/* Gerenciamento de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Gerenciamento de Usuários</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getRoleIcon(user.role)}
                      <div>
                        <h3 className="font-semibold">{user.username}</h3>
                        <p className="text-sm text-gray-500">
                          Membro desde {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Alterar Permissão</Label>
                    <div className="flex flex-wrap gap-2">
                      {roles.map((role) => (
                        <Button
                          key={role}
                          variant={user.role === role ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateUserRole(user.id, role)}
                          disabled={user.role === role}
                          className="flex items-center space-x-2"
                        >
                          {getRoleIcon(role)}
                          <span>{role}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Estatísticas do Usuário */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{user.score}</p>
                      <p className="text-sm text-gray-500">Pontos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{user.level}</p>
                      <p className="text-sm text-gray-500">Nível</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{user.unlocked_cards?.length || 0}</p>
                      <p className="text-sm text-gray-500">Cartas</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações sobre Permissões */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Níveis de Permissão</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Crown className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold">Administrador</h4>
                <p className="text-sm text-gray-600">
                  Acesso completo ao sistema, incluindo gerenciamento de usuários e configurações.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold">Gerente de Setor</h4>
                <p className="text-sm text-gray-600">
                  Pode aprovar requisições, visualizar relatórios e gerenciar sua equipe.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <UserCheck className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold">Analista Backoffice</h4>
                <p className="text-sm text-gray-600">
                  Pode criar e acompanhar requisições, adicionar comentários e visualizar dados.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsPage

