import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Award,
  TrendingUp,
  CheckCircle,
  Clock
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || "https://orbit-backend-new.onrender.com"

const GamificationPanel = () => {
  const [userScore, setUserScore] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUserScore = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user-score`)
      const result = await response.json()
      
      if (result.success) {
        setUserScore(result.data)
      }
    } catch (error) {
      console.error('Erro ao carregar pontuação:', error)
      // Dados de fallback
      setUserScore({
        score: 1250,
        level: 3,
        completed_tasks: 1,
        approved_tasks: 1,
        achievements: ['Primeira Aprovação', 'Primeira Conclusão']
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserScore()
    
    // Atualiza a cada 30 segundos
    const interval = setInterval(fetchUserScore, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </CardContent>
      </Card>
    )
  }

  const getLevelInfo = (level) => {
    const levels = {
      1: { name: 'Iniciante', color: 'bg-gray-500', nextXP: 500 },
      2: { name: 'Aprendiz', color: 'bg-blue-500', nextXP: 1000 },
      3: { name: 'Competente', color: 'bg-green-500', nextXP: 1500 },
      4: { name: 'Experiente', color: 'bg-yellow-500', nextXP: 2000 },
      5: { name: 'Especialista', color: 'bg-orange-500', nextXP: 2500 },
      6: { name: 'Mestre', color: 'bg-red-500', nextXP: 3000 },
      7: { name: 'Lenda', color: 'bg-purple-500', nextXP: 3500 },
      8: { name: 'Épico', color: 'bg-pink-500', nextXP: 4000 },
      9: { name: 'Mítico', color: 'bg-indigo-500', nextXP: 4500 },
      10: { name: 'Divino', color: 'bg-gradient-to-r from-yellow-400 to-orange-500', nextXP: 5000 }
    }
    return levels[level] || levels[1]
  }

  const levelInfo = getLevelInfo(userScore.level)
  const currentLevelXP = (userScore.level - 1) * 500
  const progressToNext = ((userScore.score - currentLevelXP) / 500) * 100

  const achievementIcons = {
    'Primeira Aprovação': <CheckCircle className="h-4 w-4" />,
    'Primeira Conclusão': <Trophy className="h-4 w-4" />,
    'Produtivo': <TrendingUp className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Score e Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pontuação Total</p>
                  <p className="text-2xl font-bold text-gray-900">{userScore.score.toLocaleString()}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                +50 hoje
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progresso para o próximo nível</span>
                <span className="font-medium">{Math.round(progressToNext)}%</span>
              </div>
              <Progress value={progressToNext} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`${levelInfo.color} p-2 rounded-lg`}>
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Nível Atual</p>
                  <p className="text-2xl font-bold text-gray-900">{userScore.level}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {levelInfo.name}
              </Badge>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Próximo nível: {levelInfo.nextXP - userScore.score} pontos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas de Atividade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Estatísticas de Atividade</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{userScore.completed_tasks}</p>
              <p className="text-sm text-gray-600">Tarefas Concluídas</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{userScore.approved_tasks}</p>
              <p className="text-sm text-gray-600">Aprovações</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">2.5h</p>
              <p className="text-sm text-gray-600">Tempo Médio</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conquistas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Conquistas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {userScore.achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
              >
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-full">
                  {achievementIcons[achievement] || <Award className="h-4 w-4 text-white" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{achievement}</p>
                  <p className="text-xs text-gray-600">Desbloqueado</p>
                </div>
              </div>
            ))}
            
            {/* Conquistas bloqueadas */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-60">
              <div className="bg-gray-300 p-2 rounded-full">
                <TrendingUp className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="font-medium text-gray-500">Super Produtivo</p>
                <p className="text-xs text-gray-400">Complete 10 tarefas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-60">
              <div className="bg-gray-300 p-2 rounded-full">
                <Zap className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <p className="font-medium text-gray-500">Velocista</p>
                <p className="text-xs text-gray-400">Complete 5 tarefas em 1 dia</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ranking Semanal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Ranking Semanal</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center">
                  1
                </div>
                <div>
                  <p className="font-medium">Você</p>
                  <p className="text-sm text-gray-600">Unidade Maracanaú</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{userScore.score}</p>
                <p className="text-sm text-gray-600">pontos</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-400 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center">
                  2
                </div>
                <div>
                  <p className="font-medium">Ana Costa</p>
                  <p className="text-sm text-gray-600">Unidade Fortaleza</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">1,180</p>
                <p className="text-sm text-gray-600">pontos</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-400 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center">
                  3
                </div>
                <div>
                  <p className="font-medium">Carlos Ramos</p>
                  <p className="text-sm text-gray-600">Unidade Maracanaú</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">950</p>
                <p className="text-sm text-gray-600">pontos</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GamificationPanel

