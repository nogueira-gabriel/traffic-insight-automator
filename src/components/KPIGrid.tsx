import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  MousePointer, 
  Eye, 
  Users, 
  Target,
  ShoppingCart,
  Calculator,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import type { KPIData } from '@/lib/kpiCalculations';

interface KPIGridProps {
  kpis: KPIData;
}

interface KPICardProps {
  title: string;
  value: string | number;
  benchmark?: {
    status: string;
    color: string;
    description: string;
  };
  trend?: {
    direction: 'up' | 'down';
    value: number;
  };
  icon: React.ReactNode;
  category: 'performance' | 'cost' | 'engagement' | 'conversion';
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  benchmark, 
  trend, 
  icon, 
  category 
}) => {
  const getBenchmarkColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excelente': return 'bg-red-50 text-red-700 border-red-200';
      case 'bom': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'médio': return 'bg-gray-50 text-gray-600 border-gray-200';
      case 'baixo': return 'bg-gray-100 text-gray-500 border-gray-300';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getIconBackground = (cat: string) => {
    switch (cat) {
      case 'cost': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <Card className="group bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getIconBackground(category)}`}>
              {icon}
            </div>
            <h3 className="text-sm font-medium text-gray-700 leading-tight">
              {title}
            </h3>
          </div>
          
          {trend && (
            <div className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-full ${
              trend.direction === 'up' 
                ? 'bg-red-50 text-red-600' 
                : 'bg-gray-50 text-gray-600'
            }`}>
              {trend.direction === 'up' ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
          </div>
          
          {benchmark && (
            <div className="space-y-2">
              <Badge 
                variant="outline" 
                className={`text-xs font-medium ${getBenchmarkColor(benchmark.status)}`}
              >
                {benchmark.status}
              </Badge>
              <p className="text-xs text-gray-500 leading-relaxed">
                {benchmark.description}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const KPIGrid: React.FC<KPIGridProps> = ({ kpis }) => {
  // Função para determinar benchmark baseado em valor
  const getBenchmark = (value: number, thresholds: { excellent: number; good: number; average: number }) => {
    if (!thresholds) return null;
    
    if (value >= thresholds.excellent) {
      return {
        status: 'Excelente',
        color: 'red',
        description: 'Performance acima da média do mercado'
      };
    } else if (value >= thresholds.good) {
      return {
        status: 'Bom',
        color: 'gray',
        description: 'Performance dentro do esperado'
      };
    } else if (value >= thresholds.average) {
      return {
        status: 'Médio',
        color: 'gray',
        description: 'Performance pode ser melhorada'
      };
    } else {
      return {
        status: 'Baixo',
        color: 'gray',
        description: 'Performance abaixo do esperado'
      };
    }
  };

  // Definir thresholds para benchmarks
  const thresholds = {
    ctr: { excellent: 3, good: 1.5, average: 0.5 },
    cpc: { excellent: 2, good: 5, average: 15 },
    roas: { excellent: 6, good: 4, average: 2 },
    conversionRate: { excellent: 5, good: 2, average: 1 }
  };

  const kpiCards = [
    // Performance Metrics
    {
      title: 'Taxa de Cliques (CTR)',
      value: `${kpis.ctr.toFixed(2)}%`,
      benchmark: getBenchmark(kpis.ctr, thresholds.ctr),
      icon: <MousePointer className="w-4 h-4 text-gray-600" />,
      category: 'performance' as const
    },
    {
      title: 'Impressões Totais',
      value: kpis.totalImpressions.toLocaleString('pt-BR'),
      icon: <Eye className="w-4 h-4 text-gray-600" />,
      category: 'performance' as const
    },
    {
      title: 'Cliques Totais',
      value: kpis.totalClicks.toLocaleString('pt-BR'),
      icon: <Target className="w-4 h-4 text-gray-600" />,
      category: 'performance' as const
    },
    {
      title: 'Alcance',
      value: kpis.totalReach > 0 ? kpis.totalReach.toLocaleString('pt-BR') : 'N/A',
      icon: <Users className="w-4 h-4 text-gray-600" />,
      category: 'performance' as const
    },

    // Cost Metrics
    {
      title: 'Custo Total',
      value: `R$ ${kpis.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: <DollarSign className="w-4 h-4 text-red-600" />,
      category: 'cost' as const
    },
    {
      title: 'CPC Médio',
      value: `R$ ${kpis.cpc.toFixed(2)}`,
      benchmark: getBenchmark(kpis.cpc <= 2 ? 5 : kpis.cpc <= 5 ? 3 : 1, thresholds.ctr),
      icon: <Calculator className="w-4 h-4 text-red-600" />,
      category: 'cost' as const
    },
    {
      title: 'CPM',
      value: `R$ ${kpis.cpm.toFixed(2)}`,
      icon: <TrendingUp className="w-4 h-4 text-red-600" />,
      category: 'cost' as const
    },
    {
      title: 'CPL',
      value: kpis.cpl > 0 ? `R$ ${kpis.cpl.toFixed(2)}` : 'N/A',
      icon: <Target className="w-4 h-4 text-red-600" />,
      category: 'cost' as const
    },

    // Conversion Metrics
    {
      title: 'Leads Totais',
      value: kpis.totalLeads > 0 ? kpis.totalLeads.toLocaleString('pt-BR') : 'N/A',
      icon: <Users className="w-4 h-4 text-gray-600" />,
      category: 'conversion' as const
    },
    {
      title: 'Conversões',
      value: kpis.totalConversions > 0 ? kpis.totalConversions.toLocaleString('pt-BR') : 'N/A',
      icon: <ShoppingCart className="w-4 h-4 text-gray-600" />,
      category: 'conversion' as const
    },
    {
      title: 'Taxa de Conversão',
      value: kpis.conversionRate > 0 ? `${kpis.conversionRate.toFixed(2)}%` : 'N/A',
      benchmark: kpis.conversionRate > 0 ? getBenchmark(kpis.conversionRate, thresholds.conversionRate) : null,
      icon: <Target className="w-4 h-4 text-gray-600" />,
      category: 'conversion' as const
    },
    {
      title: 'ROAS',
      value: kpis.roas > 0 ? `${kpis.roas.toFixed(2)}x` : 'N/A',
      benchmark: kpis.roas > 0 ? getBenchmark(kpis.roas, thresholds.roas) : null,
      icon: <TrendingUp className="w-4 h-4 text-gray-600" />,
      category: 'conversion' as const
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">KPIs Principais</h2>
        <div className="inline-flex items-center space-x-4 bg-white border border-gray-200 rounded-lg px-6 py-4 shadow-sm">
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600">{kpis.qualityScore}</div>
            <div className="text-sm text-gray-600 font-medium">Score de Qualidade</div>
          </div>
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-600 transition-all duration-1000 ease-out"
              style={{ width: `${kpis.qualityScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            benchmark={kpi.benchmark}
            icon={kpi.icon}
            category={kpi.category}
          />
        ))}
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <Eye className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Performance Geral</div>
                <div className="text-2xl font-bold text-gray-900">
                  {kpis.ctr >= 2 ? 'Excelente' : kpis.ctr >= 1 ? 'Boa' : 'Média'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  CTR: {kpis.ctr.toFixed(2)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Eficiência de Custo</div>
                <div className="text-2xl font-bold text-gray-900">
                  {kpis.cpc <= 3 ? 'Excelente' : kpis.cpc <= 8 ? 'Boa' : 'Média'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  CPC: R$ {kpis.cpc.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">ROI</div>
                <div className="text-2xl font-bold text-gray-900">
                  {kpis.roas >= 4 ? 'Excelente' : kpis.roas >= 2 ? 'Bom' : kpis.roas > 0 ? 'Médio' : 'N/A'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {kpis.roas > 0 ? `ROAS: ${kpis.roas.toFixed(2)}x` : 'Dados insuficientes'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KPIGrid;