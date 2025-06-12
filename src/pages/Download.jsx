import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Download as DownloadIcon, 
  FileSpreadsheet, 
  FileText,
  Settings,
  Shuffle,
  ExternalLink,
  Globe
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || "https://orbit-backend-new.onrender.com"

const Download = () => {
  const [numRecords, setNumRecords] = useState(50)
  const [dataType, setDataType] = useState('requisicoes')
  const [fileFormat, setFileFormat] = useState('csv')
  const [generating, setGenerating] = useState(false)
  const [googleSheetUrl, setGoogleSheetUrl] = useState('')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)

  const generateAndDownload = async () => {
    setGenerating(true)
    
    try {
      const endpoint = fileFormat === 'csv' ? 'download-csv' : 'download-excel'
      
      const response = await fetch(`${API_URL}/api/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numRecords: parseInt(numRecords),
          dataType: dataType
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${dataType}_sample_${numRecords}.${fileFormat === 'csv' ? 'csv' : 'xlsx'}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        throw new Error('Erro no download')
      }
    } catch (error) {
      console.error('Erro ao gerar arquivo:', error)
      alert('Erro ao gerar arquivo. Verifique a conexão com o servidor.')
    } finally {
      setGenerating(false)
    }
  }

  const simulateGoogleSheetsImport = async () => {
    if (!googleSheetUrl.trim()) {
      alert('Por favor, insira uma URL do Google Sheets')
      return
    }

    setImporting(true)
    setImportResult(null)

    try {
      const response = await fetch(`${API_URL}/api/google-sheets-simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sheetUrl: googleSheetUrl
        })
      })

      const result = await response.json()
      setImportResult(result)
    } catch (error) {
      console.error('Erro na simulação:', error)
      // Simula resultado para demonstração
      setImportResult({
        success: true,
        message: 'Dados importados com sucesso do Google Sheets (simulado)',
        imported_count: 5,
        data: [
          {
            ID_RC: 'RC-GS001',
            Unidade: 'Maracanaú',
            Tipo_Requisicao: 'Padrão',
            Criado_Por: 'GOOGLE SHEETS',
            Valor_Estimado: 1500.00,
            Status: 'Importado'
          }
        ]
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Download e Importação</h1>
        <p className="text-gray-600 mt-1">
          Gere planilhas de exemplo ou importe dados do Google Sheets
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Download Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DownloadIcon className="h-5 w-5" />
              <span>Gerar Planilha de Exemplo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Configuration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataType">Tipo de Dados</Label>
                <Select value={dataType} onValueChange={setDataType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="requisicoes">Requisições de Compra</SelectItem>
                    <SelectItem value="notas_fiscais">Notas Fiscais</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fileFormat">Formato do Arquivo</Label>
                <Select value={fileFormat} onValueChange={setFileFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="numRecords">Número de Registros</Label>
              <Input
                id="numRecords"
                type="number"
                min="1"
                max="1000"
                value={numRecords}
                onChange={(e) => setNumRecords(e.target.value)}
                placeholder="Ex: 50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Entre 1 e 1000 registros
              </p>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Prévia da Geração</h4>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {fileFormat === 'csv' ? (
                  <FileText className="h-4 w-4" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4" />
                )}
                <span>
                  {dataType === 'requisicoes' ? 'Requisições' : 'Notas Fiscais'} - 
                  {numRecords} registros - 
                  Formato {fileFormat.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateAndDownload}
              disabled={generating}
              className="w-full flex items-center justify-center space-x-2"
            >
              {generating ? (
                <>
                  <Shuffle className="h-4 w-4 animate-spin" />
                  <span>Gerando...</span>
                </>
              ) : (
                <>
                  <DownloadIcon className="h-4 w-4" />
                  <span>Gerar e Baixar</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Google Sheets Import */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Importar do Google Sheets</span>
              <Badge variant="secondary" className="text-xs">
                Simulação
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="googleSheetUrl">URL do Google Sheets</Label>
              <Input
                id="googleSheetUrl"
                type="url"
                value={googleSheetUrl}
                onChange={(e) => setGoogleSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Cole a URL compartilhável da sua planilha do Google Sheets
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Como funciona</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Cole a URL da planilha do Google Sheets</li>
                <li>• O sistema irá simular a importação dos dados</li>
                <li>• Os dados serão processados e integrados ao Orbit</li>
                <li>• Você verá o resultado da importação abaixo</li>
              </ul>
            </div>

            <Button
              onClick={simulateGoogleSheetsImport}
              disabled={importing || !googleSheetUrl.trim()}
              className="w-full flex items-center justify-center space-x-2"
            >
              {importing ? (
                <>
                  <Shuffle className="h-4 w-4 animate-spin" />
                  <span>Importando...</span>
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" />
                  <span>Simular Importação</span>
                </>
              )}
            </Button>

            {/* Import Result */}
            {importResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Resultado da Importação</h4>
                
                {importResult.success ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-green-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm font-medium">{importResult.message}</span>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p>Registros importados: <strong>{importResult.imported_count}</strong></p>
                    </div>

                    {importResult.data && importResult.data.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">Exemplo de dados importados:</p>
                        <div className="bg-white p-2 rounded border text-xs">
                          <pre className="text-gray-700">
                            {JSON.stringify(importResult.data[0], null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-red-600 text-sm">
                    Erro: {importResult.error}
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
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Instruções e Configurações</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Geração de Planilhas</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Os dados gerados são fictícios e baseados nos padrões reais da M. Dias Branco</li>
                <li>• Use essas planilhas para testar o sistema de upload</li>
                <li>• Os valores e datas são gerados aleatoriamente</li>
                <li>• Formatos CSV e Excel são compatíveis com sistemas existentes</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Integração Google Sheets</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Esta é uma simulação da integração real</li>
                <li>• Na versão final, seria necessário configurar APIs do Google</li>
                <li>• A importação seria automática e em tempo real</li>
                <li>• Suporte a múltiplas planilhas e abas</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Download

