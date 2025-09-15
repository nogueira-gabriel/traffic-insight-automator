import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign, Target, Calculator, AlertTriangle } from 'lucide-react';
import { TrafficData } from '@/pages/Index';

interface ROIAttributionProps {
  data: TrafficData[];
}

export const ROIAttribution: React.FC<ROIAttributionProps> = ({ data }) => {
  // Calculate basic metrics from CSV data
  const totalCost = data.reduce((sum, row) => sum + row.cost, 0);
  const totalConversions = data.reduce((sum, row) => sum + row.conversions, 0);
  const totalRevenue = data.reduce((sum, row) => sum + (row.revenue || 0), 0);
  const averageCPA = totalConversions > 0 ? totalCost / totalConversions : 0;
  const roas = totalCost > 0 ? totalRevenue / totalCost : 0;
  const hasRevenueData = data.some(row => row.revenue && row.revenue > 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <Calculator className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">Análise de Performance</h2>
        </div>
      </div>

      {/* Conditional ROI Alert */}
      {!hasRevenueData ? (
        <Alert className="border-orange-200 bg-orange-50 rounded-xl">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Limitação de ROI:</strong> Para calcular ROI/ROAS é necessário o valor de receita gerada, 
            que não está disponível nos dados CSV. Esta análise foca em métricas de custo e conversões.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-green-200 bg-green-50 rounded-xl">
          <Target className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Dados de receita detectados:</strong> Calculando ROAS real baseado nos dados de receita disponíveis.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-gray-600">Investimento Total</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {totalConversions.toLocaleString('pt-BR')}
              </div>
              <div className="text-sm text-gray-600">Total de Conversões</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                R$ {averageCPA.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">CPA Médio</div>
            </div>
          </div>
        </div>

        {/* ROAS Card - Only show if revenue data is available */}
        {hasRevenueData && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {roas.toFixed(2)}x
                </div>
                <div className="text-sm text-gray-600">ROAS</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recomendações</h3>
        <div className="space-y-4">
          {hasRevenueData ? (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Com Dados de ROAS</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  ROAS atual: {roas.toFixed(2)}x
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  {roas >= 4 ? 'Excelente performance! Considere expandir investimento.' : roas >= 2 ? 'Performance satisfatória. Identifique oportunidades de otimização.' : 'ROAS abaixo do ideal. Revise estratégia e segmentação.'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  Monitore tendências de ROAS por período para identificar padrões
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  Analise campanhas com melhor ROAS para replicar estratégias
                </li>
              </ul>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Para Melhorar o ROI</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  Adicione dados de receita aos relatórios para calcular ROAS real
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  Foque em reduzir o CPA mantendo a qualidade das conversões
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  Identifique os períodos de maior eficiência para otimizar budget
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
