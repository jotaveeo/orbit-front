import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  FileText, 
  User, 
  Calendar, 
  DollarSign, 
  Building, 
  Package,
  MessageSquare,
  History,
  Send,
  Receipt,
  TrendingUp,
  Clock
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || "https://orbit-backend-new.onrender.com"

const CardDetailsModal = ({ card, isOpen, onClose, onUpdate }) => {
  const [cardDetails, setCardDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (isOpen && card) {
      fetchCardDetails()
    }
  }, [isOpen, card])

  const fetchCardDetails = async () => {
    if (!card) return
    
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/card-details/${card.ID_RC}`)
      const result = await response.json()
      
      if (result.success) {
        setCardDetails(result.data)
      } else {
        toast.error('Erro ao carregar detalhes do card')
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error)
      toast.error('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !card) return
    
    setAddingComment(true)
    try {
      const response = await fetch(`${API_URL}/api/card/${card.ID_RC}/add-comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: newComment,
          author: user?.username || 'Usuário'
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setNewComment('')
        fetchCardDetails() // Recarrega os detalhes
        onUpdate() // Atualiza o Kanban
        toast.success('Comentário adicionado!')
      } else {
        toast.error('Erro ao adicionar comentário')
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error)
      toast.error('Erro de conexão')
    } finally {
      setAddingComment(false)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/users`)
      const result = await response.json()
      if (result.success) {
        setUsers(result.users)
      } else {
        toast.error('Erro ao buscar usuários')
      }
    } catch (e) {
      toast.error('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
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

  const getProgressPercentage = (status) => {
    const statusOrder = ['Solicitado', 'Em Análise', 'Aprovado', 'Recebido']
    const index = statusOrder.indexOf(status)
    return index >= 0 ? ((index + 1) / statusOrder.length) * 100 : 0
  }

  if (!card) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Detalhes da Requisição {card.ID_RC}</span>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : cardDetails ? (
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6 pr-4">
              {/* Informações Principais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Informações da Requisição</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">ID da Requisição</label>
                      <p className="font-semibold">{cardDetails.ID_RC}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <Badge className={getStatusColor(cardDetails.Status)}>
                        {cardDetails.Status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Tipo de Requisição</label>
                      <p>{cardDetails.Tipo_Requisicao}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Unidade</label>
                      <p>{cardDetails.Unidade}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Criado Por</label>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{cardDetails.Criado_Por}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Data de Criação</label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{formatDate(cardDetails.Data_Criacao)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Valor Estimado</label>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          {formatCurrency(cardDetails.Valor_Estimado)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Fornecedor Sugerido</label>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span>{cardDetails.Fornecedor_Sugerido || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Progresso</span>
                      <span>{Math.round(getProgressPercentage(cardDetails.Status))}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          cardDetails.Status === 'Recebido' ? 'bg-green-500' :
                          cardDetails.Status === 'Aprovado' ? 'bg-blue-500' :
                          cardDetails.Status === 'Em Análise' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`}
                        style={{ width: `${getProgressPercentage(cardDetails.Status)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Nota Fiscal (se houver) */}
              {cardDetails.nf_details && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Receipt className="h-5 w-5" />
                      <span>Nota Fiscal</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Número da NF</label>
                        <p className="font-semibold">{cardDetails.nf_details.numero}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Valor da NF</label>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(cardDetails.nf_details.valor)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Data de Emissão</label>
                        <p>{formatDate(cardDetails.nf_details.data_emissao)}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Status da NF</label>
                        <Badge variant="outline">{cardDetails.nf_details.status_nf}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Comentários */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Comentários</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Adicionar Comentário */}
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Adicione um comentário..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-20"
                    />
                    <Button 
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || addingComment}
                      className="w-full sm:w-auto"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {addingComment ? 'Adicionando...' : 'Adicionar Comentário'}
                    </Button>
                  </div>

                  <Separator />

                  {/* Lista de Comentários */}
                  <div className="space-y-3">
                    {cardDetails.comments && cardDetails.comments.length > 0 ? (
                      cardDetails.comments.map((comment, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{comment.author}</span>
                            <span className="text-xs text-gray-500">
                              {formatDate(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Nenhum comentário ainda. Seja o primeiro a comentar!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Histórico */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <History className="h-5 w-5" />
                    <span>Histórico de Atividades</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cardDetails.history && cardDetails.history.length > 0 ? (
                      cardDetails.history.map((event, index) => (
                        <div key={index} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Clock className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{event.details}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">
                                por {event.user}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(event.timestamp)}
                              </span>
                              {event.score_change > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  +{event.score_change} pts
                                </Badge>
                              )}
                              {event.percentage_progress && (
                                <Badge variant="outline" className="text-xs">
                                  {event.percentage_progress}%
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Nenhuma atividade registrada ainda.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Erro ao carregar detalhes do card</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CardDetailsModal

