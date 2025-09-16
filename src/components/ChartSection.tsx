import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings, TrendingUp } from 'lucide-react';
import { TrafficData } from "@/pages/Index";
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';

interface ChartSectionProps {
  data: TrafficData[];
}

export const ChartSection = ({ data }: ChartSectionProps) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['impressions', 'clicks', 'cost']);
  const [showMetricSelector, setShowMetricSelector] = useState(false);

  const availableMetrics = [
    { key: 'impressions', label: 'Impressões', color: '#DC2626' },
    { key: 'clicks', label: 'Cliques', color: '#6B7280' },
    { key: 'cost', label: 'Custo', color: '#F59E0B' },
    { key: 'conversions', label: 'Conversões', color: '#10B981' },
    { key: 'leads', label: 'Leads', color: '#8B5CF6' },
    { key: 'ctr', label: 'CTR (%)', color: '#EF4444' },
  ];

  const handleMetricToggle = (metricKey: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricKey) 
        ? prev.filter(m => m !== metricKey)
        : [...prev, metricKey]
    );
  };
  // Preparar dados para gráfico temporal - garantindo que são dados reais do CSV
  const timeSeriesData = data.map(row => ({
    date: new Date(row.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    impressions: Number(row.impressions) || 0,
    clicks: Number(row.clicks) || 0,
    cost: Number(row.cost) || 0,
    conversions: Number(row.conversions) || 0,
    leads: Number(row.leads) || 0,
    ctr: row.impressions > 0 ? (Number(row.clicks) / Number(row.impressions)) * 100 : 0,
  }));

  // Preparar dados para gráfico de custo vs performance - dados reais
  const performanceData = data.map((row, index) => ({
    day: `Dia ${index + 1}`,
    cost: Number(row.cost) || 0,
    clicks: Number(row.clicks) || 0,
    conversions: Number(row.conversions) || 0,
    leads: Number(row.leads) || 0,
    cpc: Number(row.clicks) > 0 ? Number(row.cost) / Number(row.clicks) : 0,
    cpl: Number(row.leads) > 0 ? Number(row.cost) / Number(row.leads) : 0,
  }));

  // Dados agregados por período - baseados nos dados reais do CSV
  const campaignData = [
    { 
      name: 'Primeira Semana', 
      impressions: data.slice(0, 7).reduce((sum, row) => sum + (Number(row.impressions) || 0), 0), 
      clicks: data.slice(0, 7).reduce((sum, row) => sum + (Number(row.clicks) || 0), 0) 
    },
    { 
      name: 'Segunda Semana', 
      impressions: data.slice(7, 14).reduce((sum, row) => sum + (Number(row.impressions) || 0), 0), 
      clicks: data.slice(7, 14).reduce((sum, row) => sum + (Number(row.clicks) || 0), 0) 
    },
    { 
      name: 'Terceira Semana', 
      impressions: data.slice(14, 21).reduce((sum, row) => sum + (Number(row.impressions) || 0), 0), 
      clicks: data.slice(14, 21).reduce((sum, row) => sum + (Number(row.clicks) || 0), 0) 
    },
    { 
      name: 'Última Semana', 
      impressions: data.slice(21).reduce((sum, row) => sum + (Number(row.impressions) || 0), 0), 
      clicks: data.slice(21).reduce((sum, row) => sum + (Number(row.clicks) || 0), 0) 
    },
  ].filter(item => item.impressions > 0);

  // Cores do gráfico de pizza
  const COLORS = ['#DC2626', '#6B7280', '#9CA3AF', '#D1D5DB']; // red-600, gray-500, gray-400, gray-300

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Análise Visual</h2>
            <p className="text-gray-600 mt-2">Tendências e Distribuições</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMetricSelector(!showMetricSelector)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Personalizar Métricas
            </Button>
          </div>
        </div>

        {/* Seletor de Métricas */}
        {showMetricSelector && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Selecione as métricas para exibir nos gráficos:</h4>
            <div className="flex flex-wrap gap-2">
              {availableMetrics.map(metric => (
                <Button
                  key={metric.key}
                  variant={selectedMetrics.includes(metric.key) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleMetricToggle(metric.key)}
                  className={`${selectedMetrics.includes(metric.key) 
                    ? 'bg-red-600 text-white' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: metric.color }}
                  />
                  {metric.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gráfico de Tendência Temporal */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Evolução Temporal - Métricas Selecionadas</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'cost') return [formatCurrency(value), 'Custo'];
                  if (name === 'ctr') return [`${formatNumber(value, 2)}%`, 'CTR'];
                  return [formatNumber(value), name];
                }}
              />
              <Legend />
              {selectedMetrics.map(metricKey => {
                const metric = availableMetrics.find(m => m.key === metricKey);
                if (!metric) return null;
                
                return (
                  <Line 
                    key={metricKey}
                    type="monotone" 
                    dataKey={metricKey} 
                    stroke={metric.color} 
                    strokeWidth={2}
                    name={metric.label}
                    dot={{ fill: metric.color, strokeWidth: 2, r: 3 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Gráfico de Performance por Custo */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Leads vs Preço por Lead Diário</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="day" 
                  stroke="#6B7280"
                  fontSize={11}
                />
                <YAxis stroke="#6B7280" fontSize={11} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'cpl' ? formatCurrency(value) : formatNumber(value),
                    name === 'cpl' ? 'Preço por Lead' : 'Leads'
                  ]}
                />
                <Bar dataKey="leads" fill="#10B981" name="leads" />
                <Bar dataKey="cpl" fill="#DC2626" name="cpl" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Distribuição por Período */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Distribuição de Impressões por Período</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={campaignData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="impressions"
                >
                  {campaignData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: number, name: string) => [
                    formatNumber(value),
                    name === 'impressions' ? 'Impressões' : 'Cliques'
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gráfico de CTR ao longo do tempo */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Taxa de Cliques (CTR) - Tendência</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280" 
                fontSize={12}
                domain={[0, 'dataMax + 1']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: number) => [`${formatNumber(value, 2)}%`, 'CTR']}
              />
              <Line 
                type="monotone" 
                dataKey="ctr" 
                stroke="#DC2626" 
                strokeWidth={3}
                name="CTR (%)"
                dot={{ fill: '#DC2626', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};