import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, AlertTriangle } from 'lucide-react';
import { TrafficData } from '@/pages/Index';

interface GeographicAnalysisProps {
  data: TrafficData[];
}

export const GeographicAnalysis: React.FC<GeographicAnalysisProps> = ({ data }) => {
  // Calculate basic metrics from CSV data
  const totalMetrics = data.reduce((acc, row) => ({
    impressions: acc.impressions + row.impressions,
    clicks: acc.clicks + row.clicks,
    cost: acc.cost + row.cost,
    conversions: acc.conversions + row.conversions
  }), { impressions: 0, clicks: 0, cost: 0, conversions: 0 });

  const ctr = totalMetrics.impressions > 0 ? (totalMetrics.clicks / totalMetrics.impressions) * 100 : 0;
  const cpc = totalMetrics.clicks > 0 ? totalMetrics.cost / totalMetrics.clicks : 0;
  const cpa = totalMetrics.conversions > 0 ? totalMetrics.cost / totalMetrics.conversions : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Análise Geográfica</h2>
      </div>

      {/* Data Limitation Alert */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Limitação de Dados:</strong> Os dados CSV não contêm informações geográficas específicas. 
          Esta análise requer dados de localização geográfica (cidade, estado, país) que não estão disponíveis 
          nos arquivos de entrada.
        </AlertDescription>
      </Alert>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Resumo dos Dados Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">
                {totalMetrics.impressions.toLocaleString('pt-BR')}
              </div>
              <div className="text-sm text-blue-600 font-medium">Total de Impressões</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-700">
                {totalMetrics.clicks.toLocaleString('pt-BR')}
              </div>
              <div className="text-sm text-green-600 font-medium">Total de Cliques</div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-700">
                R$ {totalMetrics.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-orange-600 font-medium">Custo Total</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">
                {totalMetrics.conversions.toLocaleString('pt-BR')}
              </div>
              <div className="text-sm text-purple-600 font-medium">Total de Conversões</div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-700">
                {ctr.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600">CTR Médio</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-700">
                R$ {cpc.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">CPC Médio</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-700">
                {cpa > 0 ? `R$ ${cpa.toFixed(2)}` : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">CPA</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requirements Card */}
      <Card>
        <CardHeader>
          <CardTitle>Para Análise Geográfica Completa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-gray-700">
              Para realizar uma análise geográfica adequada, são necessários os seguintes dados adicionais:
            </p>
            
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Localização geográfica dos usuários (cidade, estado, país)</li>
              <li>Dados de segmentação por região</li>
              <li>Informações de targeting geográfico das campanhas</li>
              <li>Métricas de performance por localização</li>
            </ul>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Sugestão:</strong> Exporte dados do Google Ads ou Facebook Ads incluindo 
                a dimensão geográfica para obter insights mais detalhados sobre performance por região.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};