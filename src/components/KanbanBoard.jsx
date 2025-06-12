import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  User, 
  Calendar, 
  DollarSign, 
  Building,
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  History,
  AlertTriangle
} from 'lucide-react'
import { useState } from 'react'
import CardDetailModal from './CardDetailModal'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const KanbanCard = ({ card, index, onClick, isMock }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('pt-BR')
    } catch {
      return dateString
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'Solicitado': 'bg-blue-100 text-blue-800 border-blue-200',
      'Em Análise': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Aprovado': 'bg-green-100 text-green-800 border-green-200',
      'Recebido': 'bg-purple-100 text-purple-800 border-purple-200',
      'Rejeitado': 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getTypeColor = (type) => {
    const colors = {
      'Padrão': 'bg-blue-50 text-blue-700',
      'Contrato': 'bg-green-50 text-green-700',
      'Interna': 'bg-purple-50 text-purple-700',
      'Delegada': 'bg-orange-50 text-orange-700'
    }
    return colors[type] || 'bg-gray-50 text-gray-700'
  }

  const getProgressPercentage = (status) => {
    const statusOrder = ['Solicitado', 'Em Análise', 'Aprovado', 'Recebido']
    const index = statusOrder.indexOf(status)
    return index >= 0 ? ((index + 1) / statusOrder.length) * 100 : 0
  }

  return (
    <Draggable draggableId={card.ID_RC} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`cursor-pointer transition-all duration-200 hover:shadow-md mb-3 ${
            snapshot.isDragging ? 'opacity-75 rotate-2 scale-105 shadow-lg' : ''
          } ${isMock ? 'border-dashed border-amber-300' : ''}`}
          onClick={() => onClick(card)}
        >
          <CardContent className="p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="font-semibold text-gray-900">{card.ID_RC}</span>
                {isMock && (
                  <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Mock
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-1">
                {card.comments && card.comments.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {card.comments.length}
                  </Badge>
                )}
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Type and Status */}
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className={getTypeColor(card.Tipo_Requisicao)}>
                {card.Tipo_Requisicao || 'Padrão'}
              </Badge>
              <Badge variant="outline" className={getStatusColor(card.Status)}>
                {card.Status}
              </Badge>
            </div>

            {/* Value */}
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-600">
                {formatCurrency(card.Valor_Estimado)}
              </span>
            </div>

            {/* Creator and Date */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <User className="h-3 w-3" />
                <span className="truncate">{card.Criado_Por}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(card.Data_Criacao || new Date().toISOString())}</span>
              </div>
              {card.Fornecedor_Sugerido && card.Fornecedor_Sugerido !== 'N/A' && (
                <div className="flex items-center space-x-2">
                  <Building className="h-3 w-3" />
                  <span className="truncate">{card.Fornecedor_Sugerido}</span>
                </div>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Progresso</span>
                <span>{Math.round(getProgressPercentage(card.Status))}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    card.Status === 'Recebido' ? 'bg-green-500' :
                    card.Status === 'Aprovado' ? 'bg-blue-500' :
                    card.Status === 'Em Análise' ? 'bg-yellow-500' :
                    card.Status === 'Solicitado' ? 'bg-gray-400' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${getProgressPercentage(card.Status)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  )
}

const KanbanColumn = ({ title, cards, status, droppableId, isMock }) => {
  const getColumnIcon = (status) => {
    const icons = {
      'Solicitado': <FileText className="h-5 w-5" />,
      'Em Análise': <Clock className="h-5 w-5" />,
      'Aprovado': <CheckCircle className="h-5 w-5" />,
      'Recebido': <CheckCircle className="h-5 w-5" />,
      'Rejeitado': <XCircle className="h-5 w-5" />
    }
    return icons[status] || <AlertCircle className="h-5 w-5" />
  }

  const getColumnColor = (status) => {
    const colors = {
      'Solicitado': 'border-blue-200 bg-blue-50',
      'Em Análise': 'border-yellow-200 bg-yellow-50',
      'Aprovado': 'border-green-200 bg-green-50',
      'Recebido': 'border-purple-200 bg-purple-50',
      'Rejeitado': 'border-red-200 bg-red-50'
    }
    return colors[status] || 'border-gray-200 bg-gray-50'
  }

  return (
    <div className="flex-1 min-w-80 max-w-sm">
      <div className={`rounded-lg border-2 ${getColumnColor(status)} p-4 h-full min-h-96 ${isMock ? 'border-dashed' : ''}`}>
        {/* Column Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {getColumnIcon(status)}
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          <Badge variant="secondary" className="bg-white">
            {cards.length}
          </Badge>
        </div>

        {/* Droppable Area */}
        <Droppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-80 transition-all duration-200 ${
                snapshot.isDraggingOver ? 'bg-white bg-opacity-50 rounded-lg' : ''
              }`}
            >
              {cards.map((card, index) => (
                <KanbanCard
                  key={card.ID_RC}
                  card={card}
                  index={index}
                  onClick={(c) => card.onClick(c)}
                  isMock={isMock}
                />
              ))}
              
              {provided.placeholder}
              
              {cards.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    {getColumnIcon(status)}
                  </div>
                  <p className="text-sm">Nenhuma requisição</p>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  )
}

const KanbanBoard = ({ data, loading, onUpdate, isMock = false }) => {
  const [selectedCard, setSelectedCard] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { fetchWithFallback, isDevMode } = useAuth()

  const handleCardClick = (card) => {
    setSelectedCard(card)
    setIsModalOpen(true)
  }

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result

    // Se não há destino ou o item foi solto na mesma posição
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return
    }

    const newStatus = destination.droppableId

    // Se estamos em modo de demonstração ou com dados mock, apenas simula a atualização
    if (isDevMode || isMock) {
      toast.success(`Status atualizado para ${newStatus} (modo demonstração)`)
      onUpdate()
      return
    }

    try {
      // Usa fetchWithFallback para garantir resiliência
      const result = await fetchWithFallback('/api/update-card-status', {
        method: 'POST',
        body: JSON.stringify({
          cardId: draggableId,
          newStatus: newStatus
        })
      })
      
      if (result.success) {
        toast.success(`Status atualizado para ${newStatus}`)
        // Atualiza os dados localmente
        onUpdate()
      } else {
        console.error('Erro ao atualizar status:', result.error || 'Erro desconhecido')
        toast.error('Erro ao atualizar status')
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
      toast.error('Erro na requisição. Tente novamente.')
    }
  }

  if (loading) {
    return (
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex-1 min-w-80 max-w-sm">
            <div className="bg-gray-100 rounded-lg p-4 h-96 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const columns = [
    { key: 'Solicitado', title: 'Solicitado' },
    { key: 'Em Análise', title: 'Em Análise' },
    { key: 'Aprovado', title: 'Aprovado' },
    { key: 'Recebido', title: 'Recebido' },
    { key: 'Rejeitado', title: 'Rejeitado' }
  ]

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.key}
              title={column.title}
              status={column.key}
              droppableId={column.key}
              isMock={isMock}
              cards={(data[column.key] || []).map(card => ({
                ...card,
                onClick: handleCardClick
              }))}
            />
          ))}
        </div>
      </DragDropContext>

      {/* Modal de Detalhes do Card */}
      <CardDetailModal
        card={selectedCard}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCard(null)
        }}
        onUpdate={onUpdate}
        isMock={isMock}
      />
    </>
  )
}

export default KanbanBoard
