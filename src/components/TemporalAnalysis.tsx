import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Clock, Calendar, TrendingUp, Activity, Sun, Moon } from 'lucide-react';
import { TrafficData } from '@/pages/Index';
import { format, getHours, getDay, getMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TemporalAnalysisProps {
  data: TrafficData[];
}

interface HourlyData {
  hour: number;
  hourLabel: string;
  impressions: number;
  clicks: number;
  cost: number;
  ctr: number;
  conversions: number;
}

interface DayOfWeekData {
  day: number;
  dayLabel: string;
  impressions: number;
  clicks: number;
  cost: number;
  ctr: number;
  performance: 'excellent' | 'good' | 'average' | 'poor';
}

interface SeasonalData {
  month: number;
  monthLabel: string;
  impressions: number;
  clicks: number;
  cost: number;
  trend: 'up' | 'down' | 'stable';
}

const COLORS = ['#D21B1B', '#EF4444', '#F87171', '#FCA5A5', '#FEE2E2'];
const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const TemporalAnalysis: React.FC<TemporalAnalysisProps> = ({ data }) => {
  
  // Process hourly data
  const getHourlyAnalysis = (): HourlyData[] => {
    const hourlyMap = new Map<number, { impressions: number; clicks: number; cost: number; conversions: number; count: number }>();
    
    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourlyMap.set(i, { impressions: 0, clicks: 0, cost: 0, conversions: 0, count: 0 });
    }
    
    data.forEach(row => {
      // Simulate hourly data distribution (in real scenario, this would come from actual hourly data)
      // For now, we'll create realistic patterns based on typical digital marketing behavior
      const simulatedHours = [
        { hour: 8, weight: 0.8 }, { hour: 9, weight: 1.2 }, { hour: 10, weight: 1.5 },
        { hour: 11, weight: 1.3 }, { hour: 12, weight: 1.0 }, { hour: 13, weight: 0.9 },
        { hour: 14, weight: 1.4 }, { hour: 15, weight: 1.6 }, { hour: 16, weight: 1.3 },
        { hour: 17, weight: 1.1 }, { hour: 18, weight: 1.0 }, { hour: 19, weight: 1.2 },
        { hour: 20, weight: 1.5 }, { hour: 21, weight: 1.3 }, { hour: 22, weight: 0.8 }
      ];
      
      simulatedHours.forEach(({ hour, weight }) => {
        const hourData = hourlyMap.get(hour)!;
        hourData.impressions += Math.round(row.impressions * weight * 0.1);
        hourData.clicks += Math.round(row.clicks * weight * 0.1);
        hourData.cost += row.cost * weight * 0.1;
        hourData.conversions += Math.round((row.conversions || 0) * weight * 0.1);
        hourData.count += 1;
      });
    });
    
    return Array.from(hourlyMap.entries()).map(([hour, data]) => ({
      hour,
      hourLabel: `${hour.toString().padStart(2, '0')}:00`,
      impressions: Math.round(data.impressions),
      clicks: Math.round(data.clicks),
      cost: Number(data.cost.toFixed(2)),
      ctr: data.impressions > 0 ? Number(((data.clicks / data.impressions) * 100).toFixed(2)) : 0,
      conversions: Math.round(data.conversions)
    }));
  };

  // Process day of week data
  const getDayOfWeekAnalysis = (): DayOfWeekData[] => {
    const dayMap = new Map<number, { impressions: number; clicks: number; cost: number; conversions: number; count: number }>();
    
    // Initialize all days
    for (let i = 0; i < 7; i++) {
      dayMap.set(i, { impressions: 0, clicks: 0, cost: 0, conversions: 0, count: 0 });
    }
    
    data.forEach(row => {
      const date = parseISO(row.date);
      const dayOfWeek = getDay(date);
      const dayData = dayMap.get(dayOfWeek)!;
      
      dayData.impressions += row.impressions;
      dayData.clicks += row.clicks;
      dayData.cost += row.cost;
      dayData.conversions += row.conversions || 0;
      dayData.count += 1;
    });
    
    return Array.from(dayMap.entries()).map(([day, data]) => {
      const avgCtr = data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0;
      let performance: 'excellent' | 'good' | 'average' | 'poor' = 'average';
      
      if (avgCtr >= 3) performance = 'excellent';
      else if (avgCtr >= 2) performance = 'good';
      else if (avgCtr < 1) performance = 'poor';
      
      return {
        day,
        dayLabel: DAYS_OF_WEEK[day],
        impressions: Math.round(data.impressions / Math.max(data.count, 1)),
        clicks: Math.round(data.clicks / Math.max(data.count, 1)),
        cost: Number((data.cost / Math.max(data.count, 1)).toFixed(2)),
        ctr: Number(avgCtr.toFixed(2)),
        performance
      };
    });
  };

  // Process seasonal data
  const getSeasonalAnalysis = (): SeasonalData[] => {
    const monthMap = new Map<number, { impressions: number; clicks: number; cost: number; count: number }>();
    
    data.forEach(row => {
      const date = parseISO(row.date);
      const month = getMonth(date);
      
      if (!monthMap.has(month)) {
        monthMap.set(month, { impressions: 0, clicks: 0, cost: 0, count: 0 });
      }
      
      const monthData = monthMap.get(month)!;
      monthData.impressions += row.impressions;
      monthData.clicks += row.clicks;
      monthData.cost += row.cost;
      monthData.count += 1;
    });
    
    return Array.from(monthMap.entries()).map(([month, data]) => {
      // Calculate trend (simplified)
      const avgImpressions = data.impressions / data.count;
      const globalAvg = data.impressions / Math.max(data.count, 1);
      let trend: 'up' | 'down' | 'stable' = 'stable';
      
      if (avgImpressions > globalAvg * 1.1) trend = 'up';
      else if (avgImpressions < globalAvg * 0.9) trend = 'down';
      
      return {
        month,
        monthLabel: MONTHS[month],
        impressions: Math.round(avgImpressions),
        clicks: Math.round(data.clicks / data.count),
        cost: Number((data.cost / data.count).toFixed(2)),
        trend
      };
    }).sort((a, b) => a.month - b.month);
  };

  const hourlyData = getHourlyAnalysis();
  const dayOfWeekData = getDayOfWeekAnalysis();
  const seasonalData = getSeasonalAnalysis();

  // Get peak performance insights
  const getPeakHours = () => {
    const sorted = [...hourlyData].sort((a, b) => b.ctr - a.ctr);
    return sorted.slice(0, 3);
  };

  const getBestDays = () => {
    const sorted = [...dayOfWeekData].sort((a, b) => b.ctr - a.ctr);
    return sorted.slice(0, 3);
  };

  const peakHours = getPeakHours();
  const bestDays = getBestDays();

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200 shadow-lg">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <Clock className="w-5 h-5 text-[#D21B1B]" />
            <span>Análise Temporal Avançada</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Insights Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Sun className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Melhores Horários</span>
              </div>
              <div className="space-y-1">
                {peakHours.slice(0, 2).map((hour, index) => (
                  <div key={index} className="text-xs text-blue-700">
                    {hour.hourLabel} - CTR: {hour.ctr}%
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Melhores Dias</span>
              </div>
              <div className="space-y-1">
                {bestDays.slice(0, 2).map((day, index) => (
                  <div key={index} className="text-xs text-green-700">
                    {day.dayLabel} - CTR: {day.ctr}%
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Tendência</span>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-purple-700">
                  Melhor mês: {seasonalData.find(m => m.trend === 'up')?.monthLabel || 'N/A'}
                </div>
                <div className="text-xs text-purple-700">
                  Período ativo: {peakHours[0]?.hourLabel} - {peakHours[2]?.hourLabel}
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="hourly" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              <TabsTrigger value="hourly" className="data-[state=active]:bg-[#D21B1B] data-[state=active]:text-white">
                Análise por Hora
              </TabsTrigger>
              <TabsTrigger value="weekly" className="data-[state=active]:bg-[#D21B1B] data-[state=active]:text-white">
                Dias da Semana
              </TabsTrigger>
              <TabsTrigger value="seasonal" className="data-[state=active]:bg-[#D21B1B] data-[state=active]:text-white">
                Análise Sazonal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hourly" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900">Performance por Hora</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="hourLabel" 
                          stroke="#6b7280"
                          fontSize={11}
                          interval={1}
                        />
                        <YAxis stroke="#6b7280" fontSize={11} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                          formatter={(value: number | string, name: string) => [
                            name === 'ctr' ? `${value}%` : value,
                            name === 'ctr' ? 'CTR' : 'Cliques'
                          ]}
                        />
                        <Bar dataKey="clicks" fill="#D21B1B" name="clicks" />
                        <Bar dataKey="ctr" fill="#6b7280" name="ctr" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900">Heatmap de CTR por Hora</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-8 gap-1">
                      {hourlyData.map((hour) => (
                        <div
                          key={hour.hour}
                          className="aspect-square flex items-center justify-center text-xs font-medium rounded"
                          style={{
                            backgroundColor: `rgba(210, 27, 27, ${Math.min(hour.ctr / 5, 1)})`,
                            color: hour.ctr > 2.5 ? 'white' : '#1f2937'
                          }}
                          title={`${hour.hourLabel}: CTR ${hour.ctr}%`}
                        >
                          {hour.hour}h
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
                      <span>Baixo CTR</span>
                      <div className="flex space-x-1">
                        {[0.2, 0.4, 0.6, 0.8, 1].map((opacity) => (
                          <div
                            key={opacity}
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: `rgba(210, 27, 27, ${opacity})` }}
                          />
                        ))}
                      </div>
                      <span>Alto CTR</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900">Performance por Dia da Semana</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dayOfWeekData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="dayLabel" stroke="#6b7280" fontSize={11} />
                        <YAxis stroke="#6b7280" fontSize={11} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                        <Bar dataKey="impressions" fill="#D21B1B" name="Impressões" />
                        <Bar dataKey="clicks" fill="#6b7280" name="Cliques" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900">Ranking de Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dayOfWeekData
                        .sort((a, b) => b.ctr - a.ctr)
                        .map((day, index) => (
                          <div key={day.day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                index === 1 ? 'bg-gray-100 text-gray-800' :
                                index === 2 ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-50 text-gray-600'
                              }`}>
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{day.dayLabel}</div>
                                <div className="text-sm text-gray-600">CTR: {day.ctr}%</div>
                              </div>
                            </div>
                            <Badge 
                              variant="secondary"
                              className={
                                day.performance === 'excellent' ? 'bg-green-100 text-green-800' :
                                day.performance === 'good' ? 'bg-blue-100 text-blue-800' :
                                day.performance === 'average' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }
                            >
                              {day.performance === 'excellent' ? 'Excelente' :
                               day.performance === 'good' ? 'Bom' :
                               day.performance === 'average' ? 'Médio' : 'Baixo'}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="seasonal" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900">Tendências Sazonais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={seasonalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="monthLabel" stroke="#6b7280" fontSize={11} />
                        <YAxis stroke="#6b7280" fontSize={11} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="impressions" 
                          stroke="#D21B1B" 
                          strokeWidth={2}
                          dot={{ fill: '#D21B1B', strokeWidth: 2, r: 4 }}
                          name="Impressões"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="clicks" 
                          stroke="#6b7280" 
                          strokeWidth={2}
                          dot={{ fill: '#6b7280', strokeWidth: 2, r: 4 }}
                          name="Cliques"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900">Análise de Sazonalidade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {seasonalData.map((month) => (
                        <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-[#D21B1B] rounded-lg flex items-center justify-center text-white font-bold">
                              {month.monthLabel}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{month.monthLabel}</div>
                              <div className="text-sm text-gray-600">
                                {month.impressions.toLocaleString()} impressões
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="secondary"
                              className={
                                month.trend === 'up' ? 'bg-green-100 text-green-800' :
                                month.trend === 'down' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {month.trend === 'up' ? '↗ Crescimento' :
                               month.trend === 'down' ? '↘ Declínio' : '→ Estável'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};