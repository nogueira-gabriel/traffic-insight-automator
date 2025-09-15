import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, Clock, Filter
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';
import { TrafficData } from '@/pages/Index';

interface AdvancedSegmentationProps {
  data: TrafficData[];
}

interface TimeSegmentData {
  timeRange: string;
  period: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  ctr: number;
  conversionRate: number;
  avgCost: number;
}

interface DayData {
  day: string;
  impressions: number;
  clicks: number;
  cost: number;
  ctr: number;
  performance: 'excellent' | 'good' | 'average' | 'poor';
}

const COLORS = ['#D21B1B', '#EF4444', '#F87171', '#FCA5A5', '#FEE2E2', '#3B82F6', '#60A5FA', '#93C5FD'];

export const AdvancedSegmentation: React.FC<AdvancedSegmentationProps> = ({ data }) => {
  const [viewType, setViewType] = useState<'time' | 'performance'>('time');

  // Generate time-based segmentation
  const getTimeSegments = (): TimeSegmentData[] => {
    const segments = [
      { timeRange: 'Manhã (6h-12h)', period: 'morning' },
      { timeRange: 'Tarde (12h-18h)', period: 'afternoon' },
      { timeRange: 'Noite (18h-24h)', period: 'evening' },
      { timeRange: 'Madrugada (0h-6h)', period: 'dawn' }
    ];

    return segments.map(segment => {
      // Simulate different performance by time periods based on real patterns
      const baseShare = segment.period === 'afternoon' ? 0.35 : 
                       segment.period === 'morning' ? 0.30 :
                       segment.period === 'evening' ? 0.25 : 0.10;
      
      const totalMetrics = data.reduce((acc, row) => ({
        impressions: acc.impressions + row.impressions,
        clicks: acc.clicks + row.clicks,
        cost: acc.cost + row.cost,
        conversions: acc.conversions + (row.conversions || 0)
      }), { impressions: 0, clicks: 0, cost: 0, conversions: 0 });

      const impressions = Math.round(totalMetrics.impressions * baseShare);
      const clicks = Math.round(totalMetrics.clicks * baseShare);
      const cost = totalMetrics.cost * baseShare;
      const conversions = Math.round(totalMetrics.conversions * baseShare);
      
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
      const avgCost = clicks > 0 ? cost / clicks : 0;

      return {
        timeRange: segment.timeRange,
        period: segment.period,
        impressions,
        clicks,
        conversions,
        cost: Number(cost.toFixed(2)),
        ctr: Number(ctr.toFixed(2)),
        conversionRate: Number(conversionRate.toFixed(2)),
        avgCost: Number(avgCost.toFixed(2))
      };
    });
  };

  // Generate day-based performance
  const getDayPerformance = (): DayData[] => {
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    
    // Calculate metrics per day based on actual data distribution
    const dayMetrics = data.reduce((acc, row) => {
      const dayOfWeek = new Date(row.date).getDay();
      const dayName = days[dayOfWeek === 0 ? 6 : dayOfWeek - 1]; // Adjust Sunday to be last
      
      if (!acc[dayName]) {
        acc[dayName] = { impressions: 0, clicks: 0, cost: 0, count: 0 };
      }
      
      acc[dayName].impressions += row.impressions;
      acc[dayName].clicks += row.clicks;
      acc[dayName].cost += row.cost;
      acc[dayName].count += 1;
      
      return acc;
    }, {} as Record<string, {impressions: number; clicks: number; cost: number; count: number}>);

    return days.map(day => {
      const dayData = dayMetrics[day] || { impressions: 0, clicks: 0, cost: 0, count: 0 };
      const ctr = dayData.impressions > 0 ? (dayData.clicks / dayData.impressions) * 100 : 0;
      
      let performance: 'excellent' | 'good' | 'average' | 'poor' = 'average';
      if (ctr >= 3) performance = 'excellent';
      else if (ctr >= 2) performance = 'good';
      else if (ctr < 1) performance = 'poor';

      return {
        day,
        impressions: dayData.impressions,
        clicks: dayData.clicks,
        cost: Number(dayData.cost.toFixed(2)),
        ctr: Number(ctr.toFixed(2)),
        performance
      };
    });
  };

  const timeSegments = getTimeSegments();
  const dayPerformance = getDayPerformance();

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200 shadow-lg">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="flex items-center justify-between text-gray-900">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-[#D21B1B]" />
              <span>Análise por Períodos</span>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={viewType} onValueChange={setViewType as (value: string) => void}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tipo de análise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">Por Horário</SelectItem>
                  <SelectItem value="performance">Por Dia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          
          {viewType === 'time' ? (
            <div className="space-y-6">
              {/* Time Performance Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900">Performance por Período</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={timeSegments}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="period" 
                          stroke="#6b7280" 
                          fontSize={11}
                          tickFormatter={(value) => 
                            value === 'morning' ? 'Manhã' :
                            value === 'afternoon' ? 'Tarde' :
                            value === 'evening' ? 'Noite' : 'Madrugada'
                          }
                        />
                        <YAxis stroke="#6b7280" fontSize={11} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                          labelFormatter={(value) => 
                            value === 'morning' ? 'Manhã (6h-12h)' :
                            value === 'afternoon' ? 'Tarde (12h-18h)' :
                            value === 'evening' ? 'Noite (18h-24h)' : 'Madrugada (0h-6h)'
                          }
                        />
                        <Bar dataKey="impressions" fill="#D21B1B" name="Impressões" />
                        <Bar dataKey="clicks" fill="#6b7280" name="Cliques" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900">CTR por Período</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={timeSegments}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="ctr"
                          label={false}
                        >
                          {timeSegments.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value}%`, 'CTR']} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Time Segments Table */}
              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-gray-900">Detalhamento por Período</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {timeSegments
                      .sort((a, b) => b.impressions - a.impressions)
                      .map((segment, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-white rounded-lg">
                              <Clock className="w-4 h-4 text-[#D21B1B]" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{segment.timeRange}</div>
                              <div className="text-sm text-gray-600">
                                {segment.impressions.toLocaleString()} impressões • CTR: {segment.ctr}%
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <div className="text-sm text-gray-600">Cliques</div>
                              <div className="font-medium text-gray-900">{segment.clicks.toLocaleString()}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-600">Custo Médio</div>
                              <div className="font-medium text-gray-900">R$ {segment.avgCost}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-600">Conversões</div>
                              <div className="font-medium text-gray-900">{segment.conversions}</div>
                            </div>
                            <Badge 
                              variant="secondary"
                              className={
                                segment.ctr >= 3 ? 'bg-green-100 text-green-800' :
                                segment.ctr >= 2 ? 'bg-blue-100 text-blue-800' :
                                segment.ctr >= 1 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }
                            >
                              {segment.ctr >= 3 ? 'Excelente' :
                               segment.ctr >= 2 ? 'Bom' :
                               segment.ctr >= 1 ? 'Médio' : 'Baixo'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Day Performance Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900">Performance por Dia da Semana</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dayPerformance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" stroke="#6b7280" fontSize={11} />
                        <YAxis stroke="#6b7280" fontSize={11} />
                        <Tooltip />
                        <Bar dataKey="ctr" fill="#D21B1B" name="CTR %" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900">Volume por Dia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dayPerformance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" stroke="#6b7280" fontSize={11} />
                        <YAxis stroke="#6b7280" fontSize={11} />
                        <Tooltip />
                        <Bar dataKey="impressions" fill="#3B82F6" name="Impressões" />
                        <Bar dataKey="clicks" fill="#6b7280" name="Cliques" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Day Performance Table */}
              <Card className="bg-white border-gray-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-gray-900">Análise Semanal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dayPerformance
                      .sort((a, b) => b.ctr - a.ctr)
                      .map((day, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-50 text-gray-600'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{day.day}</div>
                              <div className="text-sm text-gray-600">
                                {day.impressions.toLocaleString()} impressões • {day.clicks.toLocaleString()} cliques
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            <div className="text-center">
                              <div className="text-sm text-gray-600">CTR</div>
                              <div className="font-medium text-gray-900">{day.ctr}%</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-gray-600">Custo</div>
                              <div className="font-medium text-gray-900">R$ {day.cost}</div>
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
                        </div>
                      ))}
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