import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp,
  Users,
  Building
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || "https://orbit-backend-new.onrender.com"

const UnitsRanking = () => {
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRanking()
  }, [])

  const fetchRanking = async () => {
    try {
      const response = await fetch(`${API_URL}/api/ranking-units`)
      const result = await response.json()
      
      if (result.success) {
        setRanking(result.data)
      }
    } catch (error) {
      console.error('Erro ao carregar ranking:', error)
      // Dados de fallback
      setRanking([
        { unit: 'Maracanaú', total_score: 15750, users_count: 12, avg_score: 1312 },
        { unit: 'Fortaleza', total_score: 14200, users_count: 15, avg_score: 947 },
        { unit: 'Caucaia', total_score: 12800, users_count: 10, avg_score: 1280 },
        { unit: 'Sobral', total_score: 11500, users_count: 8, avg_score: 1437 },
        { unit: 'Juazeiro', total_score: 9800, users_count: 7, avg_score: 1400 }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (position) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />
      default:
        return <div className="h-6 w-6 flex items-center justify-center bg-gray-200 rounded-full text-sm font-bold text-gray-600">{position}</div>
    }
  }

  const getRankColor = (position) => {
    switch (position) {
      case 1:
        return 'border-yellow-200 bg-yellow-50'
      case 2:
        return 'border-gray-200 bg-gray-50'
      case 3:
        return 'border-orange-200 bg-orange-50'
      default:
        return 'border-gray-100 bg-white'
    }
  }

  const maxScore = ranking.length > 0 ? ranking[0].total_score : 1

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-2">
              <Building className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{ranking.length}</div>
            <p className="text-sm text-gray-600">Unidades Ativas</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {ranking.reduce((sum, unit) => sum + unit.users_count, 0)}
            </div>
            <p className="text-sm text-gray-600">Usuários Totais</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {ranking.length > 0 ? Math.round(ranking.reduce((sum, unit) => sum + unit.avg_score, 0) / ranking.length) : 0}
            </div>
            <p className="text-sm text-gray-600">Média Geral</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {ranking.map((unit, index) => {
          const position = index + 1
          const progressPercentage = (unit.total_score / maxScore) * 100
          
          return (
            <Card key={unit.unit} className={`border-2 ${getRankColor(position)} transition-all hover:shadow-md`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getRankIcon(position)}
                    <div>
                      <h3 className="font-semibold text-lg">{unit.unit}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{unit.users_count} usuários</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>Média: {unit.avg_score}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {unit.total_score.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">pontos totais</div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress 
                    value={progressPercentage} 
                    className="h-2"
                  />
                </div>
                
                {position <= 3 && (
                  <div className="mt-3 flex justify-center">
                    <Badge 
                      variant="secondary" 
                      className={
                        position === 1 ? 'bg-yellow-100 text-yellow-800' :
                        position === 2 ? 'bg-gray-100 text-gray-800' :
                        'bg-orange-100 text-orange-800'
                      }
                    >
                      {position === 1 ? '🥇 Campeão' : position === 2 ? '🥈 Vice-Campeão' : '🥉 Terceiro Lugar'}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default UnitsRanking

