import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Upload as UploadIcon, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Database
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || "https://orbit-backend-new.onrender.com"

const Upload = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile)
    setUploadResult(null)
    setUploadProgress(0)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const uploadFile = async () => {
    if (!file) return

    setUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('file', file)

    try {
      // Simula progresso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadResult(result)
      
    } catch (error) {
      console.error('Erro no upload:', error)
      setUploadResult({
        success: false,
        error: 'Erro na conexão com o servidor. Simulando resultado...',
        simulated: true,
        file_type: 'requisicoes',
        processed_count: 50,
        total_records: 50
      })
      setUploadProgress(100)
    } finally {
      setUploading(false)
    }
  }

  const getFileIcon = (fileName) => {
    if (fileName?.endsWith('.csv')) return <FileText className="h-8 w-8 text-green-600" />
    if (fileName?.endsWith('.xlsx') || fileName?.endsWith('.xls')) return <FileSpreadsheet className="h-8 w-8 text-blue-600" />
    return <FileText className="h-8 w-8 text-gray-600" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload de Planilhas</h1>
        <p className="text-gray-600 mt-1">
          Importe dados de requisições de compra e notas fiscais
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UploadIcon className="h-5 w-5" />
              <span>Selecionar Arquivo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <UploadIcon className="h-8 w-8 text-gray-400" />
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Arraste e solte seu arquivo aqui
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    ou clique para selecionar
                  </p>
                </div>
                
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer">
                    Selecionar Arquivo
                  </Button>
                </Label>
                
                <p className="text-xs text-gray-400">
                  Formatos suportados: CSV, Excel (.xlsx, .xls)
                </p>
              </div>
            </div>

            {/* Selected File */}
            {file && (
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.name)}
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      onClick={uploadFile}
                      disabled={uploading}
                      className="flex items-center space-x-2"
                    >
                      <UploadIcon className="h-4 w-4" />
                      <span>{uploading ? 'Enviando...' : 'Enviar'}</span>
                    </Button>
                  </div>
                  
                  {uploading && (
                    <div className="mt-4">
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-sm text-gray-500 mt-1">
                        {uploadProgress}% concluído
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Upload Result */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Resultado do Processamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!uploadResult ? (
              <div className="text-center py-8 text-gray-500">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum arquivo processado ainda</p>
                <p className="text-sm mt-1">
                  Selecione e envie um arquivo para ver os resultados
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center space-x-2">
                  {uploadResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    uploadResult.success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {uploadResult.success ? 'Processado com sucesso!' : 'Erro no processamento'}
                  </span>
                  {uploadResult.simulated && (
                    <Badge variant="outline" className="text-xs">
                      Simulado
                    </Badge>
                  )}
                </div>

                {/* Details */}
                {uploadResult.success && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">Tipo de Arquivo</p>
                      <p className="text-lg font-bold text-blue-600">
                        {uploadResult.file_type === 'requisicoes' ? 'Requisições' : 'Notas Fiscais'}
                      </p>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-green-900">Registros Processados</p>
                      <p className="text-lg font-bold text-green-600">
                        {uploadResult.processed_count || uploadResult.total_records}
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {!uploadResult.success && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm text-red-800">{uploadResult.error}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instruções de Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Requisições de Compra</h4>
              <p className="text-sm text-gray-600 mb-3">
                Arquivo deve conter as seguintes colunas:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• ID_RC</li>
                <li>• Unidade</li>
                <li>• Tipo_Requisicao</li>
                <li>• Criado_Por</li>
                <li>• Valor_Estimado</li>
                <li>• Fornecedor_Sugerido</li>
                <li>• Status</li>
                <li>• Data_Criacao</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Notas Fiscais</h4>
              <p className="text-sm text-gray-600 mb-3">
                Arquivo deve conter as seguintes colunas:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• ID_NF</li>
                <li>• Valor</li>
                <li>• Status</li>
                <li>• Criado_Por</li>
                <li>• Data_Recebimento</li>
                <li>• ID_RC</li>
                <li>• ID_MIRO</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Upload

