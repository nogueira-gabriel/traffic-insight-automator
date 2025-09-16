import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, TrendingDown, DollarSign, Target, Users, 
  BarChart3, Eye, MousePointer
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { TrafficData } from '@/pages/Index';
import { KPIData } from '@/lib/kpiCalculations';

interface ExecutiveDashboardProps {
  data: TrafficData[];
  kpis: KPIData;
}

interface ExecutiveMetric {
  title: string;
  value: string | number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'warning' | 'critical';
  icon: React.ReactNode;
  description: string;
}

const COLORS = {
  excellent: '#10B981',
  good: '#3B82F6', 
  warning: '#F59E0B',
  critical: '#EF4444',
  primary: '#D21B1B'
};

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ data, kpis }) => {
  
  // Calculate executive metrics based only on available CSV data
  const getExecutiveMetrics = (): ExecutiveMetric[] => {
    const currentMonth = data.slice(-30);
    const previousMonth = data.slice(-60, -30);
    
    const currentImpressions = currentMonth.reduce((sum, row) => sum + row.impressions, 0);
    const previousImpressions = previousMonth.reduce((sum, row) => sum + row.impressions, 0);
    const impressionsTrend = previousImpressions > 0 ? ((currentImpressions - previousImpressions) / previousImpressions) * 100 : 0;
    
    const currentClicks = currentMonth.reduce((sum, row) => sum + row.clicks, 0);
    const previousClicks = previousMonth.reduce((sum, row) => sum + row.clicks, 0);
    const clicksTrend = previousClicks > 0 ? ((currentClicks - previousClicks) / previousClicks) * 100 : 0;
    
    const currentCost = currentMonth.reduce((sum, row) => sum + row.cost, 0);
    const currentConversions = currentMonth.reduce((sum, row) => sum + row.conversions, 0);
    
    return [
      {
        title: 'Total de Impressões',
        value: kpis.totalImpressions.toLocaleString('pt-BR'),
        trend: impressionsTrend > 0 ? 'up' : impressionsTrend < 0 ? 'down' : 'stable',
        status: impressionsTrend > 10 ? 'excellent' : impressionsTrend > 0 ? 'good' : impressionsTrend > -10 ? 'warning' : 'critical',
        icon: <Eye className="w-5 h-5 text-red-600" />,
        description: `${impressionsTrend > 0 ? '+' : ''}${impressionsTrend.toFixed(1)}% vs mês anterior`
      },
      {
        title: 'Total de Cliques',
        value: kpis.totalClicks.toLocaleString('pt-BR'),
        trend: clicksTrend > 0 ? 'up' : clicksTrend < 0 ? 'down' : 'stable',
        status: clicksTrend > 10 ? 'excellent' : clicksTrend > 0 ? 'good' : clicksTrend > -10 ? 'warning' : 'critical',
        icon: <MousePointer className="w-5 h-5 text-red-600" />,
        description: `${clicksTrend > 0 ? '+' : ''}${clicksTrend.toFixed(1)}% vs mês anterior`
      },
      {
        title: 'Custo Total',
        value: `R$ ${kpis.totalCost.toLocaleString('pt-BR')}`,
        trend: 'stable',
        status: 'good',
        icon: <DollarSign className="w-5 h-5 text-red-600" />,
        description: 'Investimento em publicidade'
      },
      {
        title: 'Taxa de Cliques (CTR)',
        value: `${kpis.ctr.toFixed(2)}%`,
        trend: kpis.ctr > 2 ? 'up' : 'stable',
        status: kpis.ctr >= 3 ? 'excellent' : kpis.ctr >= 2 ? 'good' : kpis.ctr >= 1 ? 'warning' : 'critical',
        icon: <Target className="w-5 h-5 text-red-600" />,
        description: 'Percentual de cliques por impressão'
      },
      {
        title: 'Custo por Clique (CPC)',
        value: `R$ ${kpis.cpc.toFixed(2)}`,
        trend: kpis.cpc < 1 ? 'up' : 'stable',
        status: kpis.cpc <= 0.5 ? 'excellent' : kpis.cpc <= 1 ? 'good' : kpis.cpc <= 2 ? 'warning' : 'critical',
        icon: <BarChart3 className="w-5 h-5 text-red-600" />,
        description: 'Custo médio por clique'
      },
      {
        title: 'Total de Conversões',
        value: kpis.totalConversions.toLocaleString('pt-BR'),
        trend: currentConversions > 0 ? 'up' : 'stable',
        status: kpis.conversionRate >= 5 ? 'excellent' : kpis.conversionRate >= 2 ? 'good' : kpis.conversionRate >= 1 ? 'warning' : 'critical',
        icon: <Users className="w-5 h-5 text-red-600" />,
        description: `Taxa de conversão: ${kpis.conversionRate.toFixed(2)}%`
      }
    ];
  };

  // Prepare trend data from actual CSV data
  const getTrendData = () => {
    const monthlyData: { [key: string]: { impressions: number; clicks: number; cost: number; conversions: number } } = {};
    
    data.forEach(row => {
      const month = row.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { impressions: 0, clicks: 0, cost: 0, conversions: 0 };
      }
      monthlyData[month].impressions += row.impressions;
      monthlyData[month].clicks += row.clicks;
      monthlyData[month].cost += row.cost;
      monthlyData[month].conversions += row.conversions;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: month,
        impressions: data.impressions,
        clicks: data.clicks,
        cost: data.cost,
        conversions: data.conversions,
        ctr: data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0
      }));
  };

  const executiveMetrics = getExecutiveMetrics();
  const trendData = getTrendData();

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200 shadow-lg">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-gray-900">Visão Executiva</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {executiveMetrics.map((metric, index) => (
              <Card key={index} className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${
                      metric.status === 'excellent' ? 'bg-red-50 text-red-600' :
                      metric.status === 'good' ? 'bg-gray-100 text-gray-700' :
                      metric.status === 'warning' ? 'bg-gray-100 text-gray-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {metric.icon}
                    </div>
                    <div className="flex items-center space-x-1">
                      {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-600" />}
                      {metric.trend === 'down' && <TrendingDown className="w-4 h-4 text-gray-500" />}
                      <Badge 
                        variant="secondary"
                        className={
                          metric.status === 'excellent' ? 'bg-red-50 text-red-700 border-red-200' :
                          metric.status === 'good' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                          metric.status === 'warning' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                          'bg-gray-100 text-gray-500 border-gray-200'
                        }
                      >
                        {metric.status === 'excellent' ? 'Excelente' :
                         metric.status === 'good' ? 'Bom' :
                         metric.status === 'warning' ? 'Atenção' : 'Crítico'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                    <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                    <div className="text-sm text-gray-500">{metric.description}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900">Tendência de Impressões</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="impressions" 
                      stroke="#D21B1B" 
                      fill="#D21B1B" 
                      fillOpacity={0.1}
                      name="Impressões"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900">Tendência de CTR</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ctr" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.1}
                      name="CTR %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900">Evolução de Cliques</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="clicks" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.1}
                      name="Cliques"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900">Investimento Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="#F59E0B" 
                      fill="#F59E0B" 
                      fillOpacity={0.1}
                      name="Custo"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Summary Insights */}
          <Card className="bg-white border-gray-200 mt-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-gray-900">Resumo Executivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="font-medium text-red-900 mb-2">📊 Performance</div>
                  <div className="text-sm text-gray-700">
                    • CTR atual: {kpis.ctr.toFixed(2)}%<br/>
                    • {kpis.totalImpressions.toLocaleString()} impressões totais<br/>
                    • {kpis.totalClicks.toLocaleString()} cliques gerados
                  </div>
                </div>
                
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-900 mb-2">💰 Investimento</div>
                  <div className="text-sm text-gray-700">
                    • Custo total: R$ {kpis.totalCost.toLocaleString()}<br/>
                    • CPC médio: R$ {kpis.cpc.toFixed(2)}<br/>
                    • {kpis.totalConversions} conversões realizadas
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-900 mb-2">🎯 Eficiência</div>
                  <div className="text-sm text-gray-700">
                    • Taxa de conversão: {kpis.conversionRate.toFixed(2)}%<br/>
                    • CPA: R$ {kpis.cpa.toFixed(2)}<br/>
                    • Campanhas ativas em análise
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};