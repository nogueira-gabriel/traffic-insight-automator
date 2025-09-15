import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, PieChart as PieChartIcon, TrendingUp, Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area, ComposedChart
} from 'recharts';
import { TrafficData } from '@/pages/Index';

interface AdvancedChartsProps {
  data: TrafficData[];
}

interface DailyPerformance {
  date: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  cpc: number;
}

interface MonthlyComparison {
  month: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  efficiency: number;
}

const COLORS = ['#D21B1B', '#EF4444', '#F87171', '#3B82F6', '#60A5FA', '#10B981', '#F59E0B', '#8B5CF6'];

export const AdvancedCharts: React.FC<AdvancedChartsProps> = ({ data }) => {
  const [selectedChart, setSelectedChart] = useState<'daily' | 'monthly' | 'performance' | 'distribution'>('daily');

  // Process daily performance data
  const getDailyPerformance = (): DailyPerformance[] => {
    return data.map(row => ({
      date: row.date,
      impressions: row.impressions,
      clicks: row.clicks,
      cost: row.cost,
      conversions: row.conversions,
      ctr: row.impressions > 0 ? (row.clicks / row.impressions) * 100 : 0,
      cpc: row.clicks > 0 ? row.cost / row.clicks : 0
    })).sort((a, b) => a.date.localeCompare(b.date));
  };

  // Process monthly comparison data
  const getMonthlyComparison = (): MonthlyComparison[] => {
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
        month,
        impressions: data.impressions,
        clicks: data.clicks,
        cost: data.cost,
        conversions: data.conversions,
        efficiency: data.cost > 0 ? (data.conversions / data.cost) * 100 : 0
      }));
  };

  // Get performance distribution by ranges
  const getPerformanceDistribution = () => {
    const dailyData = getDailyPerformance();
    
    const ctrRanges = {
      'Baixo (0-1%)': 0,
      'Médio (1-3%)': 0,
      'Alto (3-5%)': 0,
      'Excelente (5%+)': 0
    };

    const costRanges = {
      'Baixo (R$ 0-100)': 0,
      'Médio (R$ 100-500)': 0,
      'Alto (R$ 500-1000)': 0,
      'Premium (R$ 1000+)': 0
    };

    dailyData.forEach(day => {
      // CTR distribution
      if (day.ctr <= 1) ctrRanges['Baixo (0-1%)']++;
      else if (day.ctr <= 3) ctrRanges['Médio (1-3%)']++;
      else if (day.ctr <= 5) ctrRanges['Alto (3-5%)']++;
      else ctrRanges['Excelente (5%+)']++;

      // Cost distribution
      if (day.cost <= 100) costRanges['Baixo (R$ 0-100)']++;
      else if (day.cost <= 500) costRanges['Médio (R$ 100-500)']++;
      else if (day.cost <= 1000) costRanges['Alto (R$ 500-1000)']++;
      else costRanges['Premium (R$ 1000+)']++;
    });

    return {
      ctrDistribution: Object.entries(ctrRanges).map(([name, value]) => ({ name, value })),
      costDistribution: Object.entries(costRanges).map(([name, value]) => ({ name, value }))
    };
  };

  const dailyPerformance = getDailyPerformance();
  const monthlyComparison = getMonthlyComparison();
  const performanceDistribution = getPerformanceDistribution();

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200 shadow-lg">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="flex items-center justify-between text-gray-900">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-[#D21B1B]" />
              <span>Visualizações Avançadas</span>
            </div>
            <Select value={selectedChart} onValueChange={setSelectedChart as (value: string) => void}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de Gráfico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Performance Diária</SelectItem>
                <SelectItem value="monthly">Comparação Mensal</SelectItem>
                <SelectItem value="performance">Análise Combined</SelectItem>
                <SelectItem value="distribution">Distribuições</SelectItem>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          
          {selectedChart === 'daily' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Tendência de Impressões
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart data={dailyPerformance.slice(-30)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#6b7280" 
                          fontSize={10}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
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
                          fillOpacity={0.2}
                          name="Impressões"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900">CTR Diário</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={dailyPerformance.slice(-30)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#6b7280" 
                          fontSize={10}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis stroke="#6b7280" fontSize={11} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="ctr" 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                          name="CTR %"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {selectedChart === 'monthly' && (
            <div className="space-y-6">
              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Comparação Mensal de Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={monthlyComparison}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                      <YAxis stroke="#6b7280" fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="impressions" fill="#D21B1B" name="Impressões" />
                      <Bar dataKey="clicks" fill="#3B82F6" name="Cliques" />
                      <Bar dataKey="conversions" fill="#10B981" name="Conversões" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedChart === 'performance' && (
            <div className="space-y-6">
              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-gray-900">Análise Combinada: Custo vs Conversões</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={monthlyComparison}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                      <YAxis yAxisId="left" stroke="#6b7280" fontSize={11} />
                      <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={11} />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="cost" fill="#F59E0B" name="Custo (R$)" />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="conversions" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        name="Conversões"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedChart === 'distribution' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900 flex items-center">
                      <PieChartIcon className="w-4 h-4 mr-2" />
                      Distribuição de CTR
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={performanceDistribution.ctrDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value} dias`}
                        >
                          {performanceDistribution.ctrDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900">Distribuição de Investimento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={performanceDistribution.costDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value} dias`}
                        >
                          {performanceDistribution.costDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Distribution Summary */}
              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-gray-900">Resumo das Distribuições</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Performance de CTR</h4>
                      <div className="space-y-2">
                        {performanceDistribution.ctrDistribution.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              ></div>
                              <span className="text-sm text-gray-700">{item.name}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{item.value} dias</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Faixas de Investimento</h4>
                      <div className="space-y-2">
                        {performanceDistribution.costDistribution.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              ></div>
                              <span className="text-sm text-gray-700">{item.name}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{item.value} dias</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};