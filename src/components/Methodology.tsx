import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Calendar, 
  Database, 
  Calculator,
  TrendingUp,
  Clock
} from 'lucide-react';
import { TrafficData } from '@/pages/Index';

interface MethodologyProps {
  data: TrafficData[];
  dateRange?: {
    start: string;
    end: string;
  };
}

const Methodology: React.FC<MethodologyProps> = ({ data, dateRange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-6">
      <Button
        variant="outline"
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-gray-200"
      >
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4" />
          <span className="text-sm font-medium">Metodologia e Observações Técnicas</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>

      {isExpanded && (
        <Card className="mt-3 border-gray-200 bg-gray-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-gray-800 flex items-center space-x-2">
              <Database className="w-5 h-5 text-gray-600" />
              <span>Informações Técnicas do Relatório</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dados da Fonte */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Database className="w-4 h-4" />
                  <span>Fonte dos Dados</span>
                </div>
                <div className="text-sm text-gray-600 pl-6 space-y-1">
                  <p>• Arquivo CSV/XLSX processado automaticamente</p>
                  <p>• Validação de integridade aplicada</p>
                  <p>• Normalização de formatos de data</p>
                  <p>• Tratamento de valores ausentes</p>
                </div>
              </div>

              {/* Período de Análise */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Calendar className="w-4 h-4" />
                  <span>Período de Análise</span>
                </div>
                <div className="text-sm text-gray-600 pl-6 space-y-1">
                  <p>• <strong>Início:</strong> {dateRange?.start || 'N/A'}</p>
                  <p>• <strong>Fim:</strong> {dateRange?.end || 'N/A'}</p>
                  <p>• <strong>Registros:</strong> {data.length} linhas</p>
                  <p>• <strong>Campanhas únicas:</strong> {new Set(data.map(d => d.campaignname).filter(Boolean)).size}</p>
                </div>
              </div>

              {/* Cálculos e Métricas */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Calculator className="w-4 h-4" />
                  <span>Métricas Calculadas</span>
                </div>
                <div className="text-sm text-gray-600 pl-6 space-y-1">
                  <p>• <strong>CTR:</strong> (Cliques ÷ Impressões) × 100</p>
                  <p>• <strong>CPC:</strong> Custo ÷ Cliques</p>
                  <p>• <strong>CPM:</strong> (Custo ÷ Impressões) × 1000</p>
                  <p>• <strong>CPL:</strong> Custo ÷ Leads</p>
                  <p>• <strong>ROAS:</strong> Receita ÷ Custo</p>
                </div>
              </div>

              {/* Análise de Tendências */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <TrendingUp className="w-4 h-4" />
                  <span>Análise de Tendências</span>
                </div>
                <div className="text-sm text-gray-600 pl-6 space-y-1">
                  <p>• Comparação entre primeira e segunda metade</p>
                  <p>• Score de qualidade baseado em benchmarks</p>
                  <p>• Identificação de padrões sazonais</p>
                  <p>• Detecção de anomalias nos dados</p>
                </div>
              </div>
            </div>

            {/* Observações Importantes */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                <Info className="w-4 h-4" />
                <span>Observações Importantes</span>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• <strong>Precisão:</strong> Resultados baseados exclusivamente nos dados fornecidos</p>
                <p>• <strong>Limitações:</strong> Dados ausentes são tratados como zero quando aplicável</p>
                <p>• <strong>Benchmarks:</strong> Baseados em médias da indústria de marketing digital</p>
                <p>• <strong>Recomendações:</strong> Sugestões geradas automaticamente com base em padrões identificados</p>
              </div>
            </div>

            {/* Timestamp */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>Relatório gerado em: {new Date().toLocaleString('pt-BR')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Methodology;