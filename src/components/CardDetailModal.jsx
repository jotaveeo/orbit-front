import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  FileText, 
  User, 
  Calendar, 
  DollarSign, 
  Building, 
  Package, 
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Edit,
  MessageSquare,
  Paperclip,
  History,
  Eye,
  ExternalLink
} from 'lucide-react'

const CardDetailModal = ({ card, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('details')

  if (!card) return null

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'solicitado':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'em análise':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'aprovado':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'recebido':
        return <Package className="h-4 w-4 text-purple-500" />
      case 'rejeitado':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'solicitado':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'em análise':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'aprovado':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'recebido':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'rejeitado':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Dados simulados para demonstração
  const cardDetails = {
    ...card,
    descricao: 'Aquisição de equipamentos de informática para modernização do parque tecnológico da unidade.',
    justificativa: 'Necessidade de substituição de equipamentos obsoletos que estão impactando a produtividade da equipe.',
    centro_custo: '1001.001.001',
    conta_contabil: '6.1.2.1.01.001',
    aprovador: 'MARIA SILVA',
    data_aprovacao: card.Status === 'Aprovado' ? '2025-06-10' : null,
    data_entrega_prevista: '2025-06-25',
    observacoes: 'Equipamentos devem ser entregues na unidade Maracanaú.',
    anexos: [
      { nome: 'Cotacao_Fornecedor_A.pdf', tamanho: '245 KB', tipo: 'PDF' },
      { nome: 'Especificacoes_Tecnicas.docx', tamanho: '128 KB', tipo: 'Word' },
      { nome: 'Orcamento_Detalhado.xlsx', tamanho: '89 KB', tipo: 'Excel' }
    ],
    historico: [
      {
        data: '2025-06-11 14:30',
        acao: 'Criação da RC',
        usuario: card.Criado_Por,
        detalhes: 'Requisição criada no sistema'
      },
      {
        data: '2025-06-11 15:15',
        acao: 'Envio para análise',
        usuario: 'SISTEMA',
        detalhes: 'RC enviada automaticamente para análise'
      },
      {
        data: '2025-06-11 16:00',
        acao: 'Em análise',
        usuario: 'JOÃO SANTOS',
        detalhes: 'Análise técnica iniciada'
      }
    ],
    comentarios: [
      {
        id: 1,
        usuario: 'JOÃO SANTOS',
        data: '2025-06-11 16:30',
        comentario: 'Verificar se as especificações técnicas estão de acordo com o padrão da empresa.',
        tipo: 'observacao'
      },
      {
        id: 2,
        usuario: card.Criado_Por,
        data: '2025-06-11 17:00',
        comentario: 'Especificações revisadas e atualizadas conforme padrão.',
        tipo: 'resposta'
      }
    ]
  }

  const handleEdit = () => {
    // Implementar edição
    console.log('Editar card:', card.ID_RC)
  }

  const handleAddComment = () => {
    // Implementar adição de comentário
    console.log('Adicionar comentário para:', card.ID_RC)
  }

  const handleViewAttachment = (anexo) => {
    // Implementar visualização de anexo
    console.log('Visualizar anexo:', anexo.nome)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Detalhes da Requisição {card.ID_RC}</span>
          </DialogTitle>
          <DialogDescription>
            Informações completas da requisição de compra
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status e Ações */}
          <div className="flex items-center justify-between">
            <Badge className={`flex items-center space-x-1 ${getStatusColor(card.Status)}`}>
              {getStatusIcon(card.Status)}
              <span>{card.Status}</span>
            </Badge>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <Button variant="outline" size="sm" onClick={handleAddComment}>
                <MessageSquare className="h-4 w-4 mr-1" />
                Comentar
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="attachments">Anexos</TabsTrigger>
              <TabsTrigger value="comments">Comentários</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Informações Básicas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações Básicas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Criado por:</span>
                      <span className="text-sm">{cardDetails.Criado_Por}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Data de criação:</span>
                      <span className="text-sm">{new Date().toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Valor estimado:</span>
                      <span className="text-sm font-bold text-green-600">
                        R$ {cardDetails.Valor_Estimado?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Centro de custo:</span>
                      <span className="text-sm">{cardDetails.centro_custo}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Informações Financeiras */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações Financeiras</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Conta contábil:</span>
                      <span className="text-sm">{cardDetails.conta_contabil}</span>
                    </div>
                    
                    {cardDetails.aprovador && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Aprovador:</span>
                        <span className="text-sm">{cardDetails.aprovador}</span>
                      </div>
                    )}
                    
                    {cardDetails.data_aprovacao && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Data aprovação:</span>
                        <span className="text-sm">{cardDetails.data_aprovacao}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Entrega prevista:</span>
                      <span className="text-sm">{cardDetails.data_entrega_prevista}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Descrição e Justificativa */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Descrição e Justificativa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Descrição:</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {cardDetails.descricao}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Justificativa:</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {cardDetails.justificativa}
                    </p>
                  </div>
                  
                  {cardDetails.observacoes && (
                    <div>
                      <h4 className="font-medium mb-2">Observações:</h4>
                      <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded border border-yellow-200">
                        {cardDetails.observacoes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Paperclip className="h-5 w-5" />
                    <span>Anexos ({cardDetails.anexos.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cardDetails.anexos.map((anexo, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium text-sm">{anexo.nome}</p>
                            <p className="text-xs text-gray-500">{anexo.tipo} • {anexo.tamanho}</p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewAttachment(anexo)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Visualizar
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Comentários ({cardDetails.comentarios.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cardDetails.comentarios.map((comentario) => (
                      <div key={comentario.id} className="border-l-4 border-blue-200 pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{comentario.usuario}</span>
                          <span className="text-xs text-gray-500">{comentario.data}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comentario.comentario}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {comentario.tipo}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <History className="h-5 w-5" />
                    <span>Histórico de Ações</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cardDetails.historico.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{item.acao}</span>
                            <span className="text-xs text-gray-500">{item.data}</span>
                          </div>
                          <p className="text-sm text-gray-600">{item.detalhes}</p>
                          <p className="text-xs text-gray-500">por {item.usuario}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CardDetailModal

