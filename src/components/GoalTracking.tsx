import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Target, Plus, Edit, Trash2, CheckCircle, AlertTriangle, 
  TrendingUp, DollarSign, Users, MousePointer, Calendar, Calculator
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { TrafficData } from '@/pages/Index';
import { KPIData } from '@/lib/kpiCalculations';

interface GoalTrackingProps {
  data: TrafficData[];
  kpis: KPIData;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  metric: 'ctr' | 'cpc' | 'roas' | 'cpa' | 'conversions' | 'cost';
  targetValue: number;
  currentValue: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  category: 'performance' | 'financial' | 'growth';
}

const METRIC_LABELS = {
  ctr: 'Taxa de Cliques (%)',
  cpc: 'Custo por Clique (R$)',
  roas: 'Retorno sobre Investimento',
  cpa: 'Custo por Conversão (R$)',
  conversions: 'Conversões',
  cost: 'Custo Total (R$)'
};

const METRIC_ICONS = {
  ctr: <MousePointer className="w-4 h-4" />,
  cpc: <DollarSign className="w-4 h-4" />,
  roas: <TrendingUp className="w-4 h-4" />,
  cpa: <Calculator className="w-4 h-4" />,
  conversions: <Target className="w-4 h-4" />,
  cost: <DollarSign className="w-4 h-4" />
};

export const GoalTracking: React.FC<GoalTrackingProps> = ({ data, kpis }) => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Melhorar CTR para 3%',
      description: 'Aumentar a taxa de cliques através de otimização de criativos',
      metric: 'ctr',
      targetValue: 3,
      currentValue: kpis.ctr,
      deadline: '2025-12-31',
      priority: 'high',
      status: kpis.ctr >= 3 ? 'completed' : kpis.ctr >= 2.5 ? 'on-track' : kpis.ctr >= 2 ? 'at-risk' : 'behind',
      category: 'performance'
    },
    {
      id: '2',
      title: 'Reduzir CPC para R$ 5',
      description: 'Otimizar segmentação para reduzir custo por clique',
      metric: 'cpc',
      targetValue: 5,
      currentValue: kpis.cpc,
      deadline: '2025-11-30',
      priority: 'medium',
      status: kpis.cpc <= 5 ? 'completed' : kpis.cpc <= 6 ? 'on-track' : kpis.cpc <= 8 ? 'at-risk' : 'behind',
      category: 'financial'
    },
    {
      id: '3',
      title: 'Atingir ROAS 4x',
      description: 'Melhorar retorno sobre investimento publicitário',
      metric: 'roas',
      targetValue: 4,
      currentValue: kpis.roas,
      deadline: '2025-12-15',
      priority: 'high',
      status: kpis.roas >= 4 ? 'completed' : kpis.roas >= 3 ? 'on-track' : kpis.roas >= 2 ? 'at-risk' : 'behind',
      category: 'financial'
    },
    {
      id: '4',
      title: 'Alcançar 500 conversões',
      description: 'Aumentar volume total de conversões mensais',
      metric: 'conversions',
      targetValue: 500,
      currentValue: kpis.totalConversions,
      deadline: '2025-10-31',
      priority: 'medium',
      status: kpis.totalConversions >= 500 ? 'completed' : 
               kpis.totalConversions >= 400 ? 'on-track' : 
               kpis.totalConversions >= 300 ? 'at-risk' : 'behind',
      category: 'growth'
    }
  ]);

  const [showAddGoal, setShowAddGoal] = useState(false);

  // Calculate progress for each goal
  const getProgress = (goal: Goal): number => {
    if (goal.metric === 'cpc') {
      // For cost metrics, lower is better
      if (goal.currentValue <= goal.targetValue) return 100;
      return Math.max(0, 100 - ((goal.currentValue - goal.targetValue) / goal.targetValue) * 100);
    } else {
      // For other metrics, higher is better
      return Math.min(100, (goal.currentValue / goal.targetValue) * 100);
    }
  };

  // Get status color
  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on-track': return 'bg-blue-100 text-blue-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'behind': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'on-track': return <TrendingUp className="w-4 h-4" />;
      case 'at-risk': return <AlertTriangle className="w-4 h-4" />;
      case 'behind': return <AlertTriangle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  // Simulate progress over time
  const getGoalProgressData = () => {
    return data.slice(-7).map((row, index) => {
      const dayProgress = (index + 1) / 7;
      return {
        day: `Dia ${index + 1}`,
        ctr: 1.5 + (dayProgress * 1.2), // Progressive improvement
        cpc: 8 - (dayProgress * 2.5),
        roas: 1.8 + (dayProgress * 1.5),
        conversions: 250 + (dayProgress * 200)
      };
    });
  };

  const progressData = getGoalProgressData();

  // Calculate overall goals completion
  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const totalGoals = goals.length;
  const overallProgress = (completedGoals / totalGoals) * 100;

  return (
    <div className="space-y-6">
      <Card className="bg-white border-gray-200 shadow-lg">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="flex items-center justify-between text-gray-900">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-[#D21B1B]" />
              <span>Acompanhamento de Metas</span>
            </div>
            <Button
              size="sm"
              onClick={() => setShowAddGoal(true)}
              className="bg-[#D21B1B] text-white hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Meta
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          
          {/* Overall Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Progresso Geral</h3>
                <p className="text-gray-600">
                  {completedGoals} de {totalGoals} metas concluídas
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[#D21B1B]">
                  {overallProgress.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600">Completo</div>
              </div>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {goals.map((goal) => (
              <Card key={goal.id} className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {METRIC_ICONS[goal.metric]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusColor(goal.status)} flex items-center space-x-1`}
                    >
                      {getStatusIcon(goal.status)}
                      <span className="capitalize">
                        {goal.status === 'on-track' ? 'No prazo' :
                         goal.status === 'at-risk' ? 'Em risco' :
                         goal.status === 'behind' ? 'Atrasado' : 'Concluído'}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">{METRIC_LABELS[goal.metric]}</span>
                        <span className="font-medium">
                          {goal.currentValue.toFixed(goal.metric === 'ctr' ? 2 : 0)} / {goal.targetValue.toFixed(goal.metric === 'ctr' ? 2 : 0)}
                        </span>
                      </div>
                      <Progress value={getProgress(goal)} className="h-2" />
                      <div className="text-xs text-gray-500 mt-1">
                        {getProgress(goal).toFixed(1)}% do objetivo
                      </div>
                    </div>

                    {/* Deadline */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <Badge 
                        variant="outline"
                        className={
                          goal.priority === 'high' ? 'border-red-300 text-red-700' :
                          goal.priority === 'medium' ? 'border-yellow-300 text-yellow-700' :
                          'border-blue-300 text-blue-700'
                        }
                      >
                        {goal.priority === 'high' ? 'Alta' :
                         goal.priority === 'medium' ? 'Média' : 'Baixa'} prioridade
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress Chart */}
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-gray-900">Evolução das Métricas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number, name: string) => [
                      name === 'ctr' ? `${value.toFixed(2)}%` :
                      name === 'cpc' ? `R$ ${value.toFixed(2)}` :
                      name === 'roas' ? `${value.toFixed(1)}x` :
                      value.toFixed(0),
                      name === 'ctr' ? 'CTR' :
                      name === 'cpc' ? 'CPC' :
                      name === 'roas' ? 'ROAS' : 'Conversões'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ctr" 
                    stackId="1"
                    stroke="#D21B1B" 
                    fill="#D21B1B" 
                    fillOpacity={0.3}
                    name="ctr"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="roas" 
                    stackId="2"
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.3}
                    name="roas"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Goal Categories Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {['performance', 'financial', 'growth'].map((category) => {
              const categoryGoals = goals.filter(goal => goal.category === category);
              const completedCategoryGoals = categoryGoals.filter(goal => goal.status === 'completed').length;
              const categoryProgress = categoryGoals.length > 0 ? (completedCategoryGoals / categoryGoals.length) * 100 : 0;
              
              return (
                <Card key={category} className="bg-gradient-to-br from-gray-50 to-white border-gray-200">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900 mb-2">
                        {category === 'performance' ? 'Performance' :
                         category === 'financial' ? 'Financeiro' : 'Crescimento'}
                      </div>
                      <div className="text-2xl font-bold text-[#D21B1B] mb-2">
                        {categoryProgress.toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {completedCategoryGoals}/{categoryGoals.length} metas
                      </div>
                      <Progress value={categoryProgress} className="h-2 mt-3" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};