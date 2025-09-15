import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { parseCSVWithMapping, analyzeCSVStructure, CSVPreview } from "@/lib/csvParser";
import { ColumnMapping } from "@/components/ColumnMapping";
import { TrafficData } from "@/pages/Index";

interface FileUploadAreaProps {
  onDataLoaded: (data: TrafficData[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const FileUploadArea = ({ onDataLoaded, isLoading, setIsLoading }: FileUploadAreaProps) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [csvPreview, setCsvPreview] = useState<CSVPreview | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setCsvPreview(null);
    setCurrentFile(file);

    try {
      // Primeiro, analisar o arquivo para ver se precisa de mapeamento
      const preview = await analyzeCSVStructure(file);
      
      if (preview.needsMapping) {
        // Precisa de mapeamento manual
        setCsvPreview(preview);
        setIsLoading(false);
      } else {
        // Pode processar diretamente
        const data = await parseCSVWithMapping(file);
        onDataLoaded(data);
        setSuccess(`✅ Arquivo processado com sucesso! ${data.length} registros carregados.`);
        setIsLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar o arquivo");
      setIsLoading(false);
    }
  }, [onDataLoaded, setIsLoading]);

  const handleMappingComplete = useCallback(async (mapping: Record<string, string>) => {
    if (!currentFile) return;

    setIsLoading(true);
    setError(null);
    setCsvPreview(null);

    try {
      const data = await parseCSVWithMapping(currentFile, mapping);
      onDataLoaded(data);
      setSuccess(`✅ Arquivo processado com sucesso! ${data.length} registros carregados.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar o arquivo");
    } finally {
      setIsLoading(false);
      setCurrentFile(null);
    }
  }, [currentFile, onDataLoaded, setIsLoading]);

  const handleMappingCancel = useCallback(() => {
    setCsvPreview(null);
    setCurrentFile(null);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    disabled: isLoading
  });

  // Se precisa de mapeamento, mostrar interface de mapeamento
  if (csvPreview?.needsMapping) {
    return (
      <ColumnMapping
        availableColumns={csvPreview.columns}
        onMappingComplete={handleMappingComplete}
        onCancel={handleMappingCancel}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-2xl p-12 lg:p-16 text-center transition-all duration-300 cursor-pointer
          ${isDragActive 
            ? "border-red-400 bg-red-50" 
            : "border-gray-300 hover:border-red-400 hover:bg-red-50"
          }
          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-6">
          <div className="flex justify-center">
            {isLoading ? (
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-red-50 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                <Upload className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {isLoading ? "Processando arquivo..." : isDragActive ? "Solte o arquivo aqui!" : "Arraste seus dados aqui"}
            </h3>
            <p className="text-lg text-gray-600 max-w-lg mx-auto">
              {isLoading 
                ? "Analisando e validando os dados do seu arquivo..." 
                : "Ou clique para selecionar um arquivo CSV/XLSX do seu computador"
              }
            </p>
          </div>
          
          {!isLoading && (
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>CSV</span>
              </div>
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span>XLSX</span>
              </div>
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                <span>XLS</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          <p className="text-green-700 font-medium">{success}</p>
        </div>
      )}

      {/* Information Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 lg:p-10 shadow-sm">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h4 className="text-2xl font-bold text-gray-900">📊 Estrutura de Dados Suportada</h4>
            <p className="text-gray-600">Sistema inteligente que reconhece automaticamente seus dados</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Required Fields */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-600 rounded-full" />
                <h5 className="text-lg font-semibold text-gray-900">Campos Obrigatórios</h5>
                <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                  NECESSÁRIOS
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { field: 'date / day / data', desc: 'Data da campanha' },
                  { field: 'impressions', desc: 'Número de impressões' },
                  { field: 'clicks / linkclicks', desc: 'Cliques recebidos' },
                  { field: 'cost / amountspent', desc: 'Valor investido' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                    <code className="text-sm font-mono text-red-700 bg-white px-2 py-1 rounded border">
                      {item.field}
                    </code>
                    <span className="text-sm text-red-600">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Optional Fields */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
                <h5 className="text-lg font-semibold text-gray-900">Campos Opcionais</h5>
                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                  RECOMENDADOS
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { field: 'results / conversions', desc: 'Conversões obtidas' },
                  { field: 'reach / alcance', desc: 'Alcance da campanha' },
                  { field: 'leads / conversas', desc: 'Leads gerados' },
                  { field: 'revenue / receita', desc: 'Receita gerada' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <code className="text-sm font-mono text-gray-700 bg-white px-2 py-1 rounded border">
                      {item.field}
                    </code>
                    <span className="text-sm text-gray-600">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Smart System Info */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🧠</span>
              </div>
              <div className="space-y-2">
                <h5 className="text-lg font-semibold text-gray-900">Sistema Inteligente de Reconhecimento</h5>
                <p className="text-gray-700 leading-relaxed">
                  Nosso algoritmo reconhece automaticamente diferentes nomes de colunas e formatos de dados. 
                  Se algo não for detectado automaticamente, você poderá fazer o mapeamento manual na próxima etapa.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Facebook Ads', 'Google Ads', 'Instagram', 'LinkedIn', 'TikTok'].map((platform) => (
                    <span key={platform} className="text-xs bg-white text-gray-700 px-3 py-1 rounded-full border border-gray-200">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};