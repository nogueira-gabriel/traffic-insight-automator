import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrafficData } from "@/pages/Index";

interface ChartSectionProps {
  data: TrafficData[];
}

export const ChartSection = ({ data }: ChartSectionProps) => {
  // Preparar dados para gráfico temporal
  const timeSeriesData = data.map(row => ({
    date: new Date(row.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    impressions: row.impressions,
    clicks: row.clicks,
    cost: row.cost,
    ctr: row.impressions > 0 ? (row.clicks / row.impressions) * 100 : 0,
  }));

  // Preparar dados para gráfico de custo vs performance
  const performanceData = data.map((row, index) => ({
    day: `Dia ${index + 1}`,
    cost: row.cost,
    clicks: row.clicks,
    conversions: row.conversions || 0,
    cpc: row.clicks > 0 ? row.cost / row.clicks : 0,
  }));

  // Dados agregados por período (simulação de campanhas)
  const campaignData = [
    { name: 'Primeira Semana', impressions: data.slice(0, 7).reduce((sum, row) => sum + row.impressions, 0), clicks: data.slice(0, 7).reduce((sum, row) => sum + row.clicks, 0) },
    { name: 'Segunda Semana', impressions: data.slice(7, 14).reduce((sum, row) => sum + row.impressions, 0), clicks: data.slice(7, 14).reduce((sum, row) => sum + row.clicks, 0) },
    { name: 'Terceira Semana', impressions: data.slice(14, 21).reduce((sum, row) => sum + row.impressions, 0), clicks: data.slice(14, 21).reduce((sum, row) => sum + row.clicks, 0) },
    { name: 'Última Semana', impressions: data.slice(21).reduce((sum, row) => sum + row.impressions, 0), clicks: data.slice(21).reduce((sum, row) => sum + row.clicks, 0) },
  ].filter(item => item.impressions > 0);

  // Cores do gráfico de pizza
  const COLORS = ['#DC2626', '#6B7280', '#9CA3AF', '#D1D5DB']; // red-600, gray-500, gray-400, gray-300

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Análise Visual</h2>
        <p className="text-gray-600 mt-2">Tendências e Distribuições</p>
      </div>

      {/* Gráfico de Tendência Temporal */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Evolução Temporal - Impressões e Cliques</h3>
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
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="impressions" 
                stroke="#DC2626" 
                strokeWidth={2}
                name="Impressões"
                dot={{ fill: '#DC2626', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#6B7280" 
                strokeWidth={2}
                name="Cliques"
                dot={{ fill: '#6B7280', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Gráfico de Performance por Custo */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Custo vs Performance Diária</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData.slice(0, 10)}>
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
                    name === 'cost' ? `R$ ${value.toFixed(2)}` : value,
                    name === 'cost' ? 'Custo' : 'Cliques'
                  ]}
                />
                <Bar dataKey="cost" fill="#DC2626" name="cost" />
                <Bar dataKey="clicks" fill="#6B7280" name="clicks" />
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
                    value.toLocaleString('pt-BR'),
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
                formatter={(value: number) => [`${value.toFixed(2)}%`, 'CTR']}
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