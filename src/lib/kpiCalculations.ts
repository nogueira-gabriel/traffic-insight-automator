import { TrafficData } from '@/pages/Index';

export interface KPIData {
  // Métricas básicas
  totalImpressions: number;
  totalReach: number;
  totalClicks: number;
  totalCost: number;
  totalConversions: number;
  totalLeads: number;
  totalRevenue: number;
  
  // KPIs principais
  ctr: number; // Click Through Rate
  cpm: number; // Cost Per Mille (thousand impressions)
  cpc: number; // Cost Per Click
  cpl: number; // Cost Per Lead
  cpa: number; // Cost Per Acquisition
  roas: number; // Return On Ad Spend
  roi: number; // Return On Investment
  conversionRate: number; // Taxa de conversão
  
  // Frequência e alcance
  frequency: number; // Frequência média
  reachRate: number; // Taxa de alcance
  
  // Métricas de eficiência
  averageCostPerDay: number;
  averageClicksPerDay: number;
  averageConversionsPerDay: number;
  averageRevenuePerDay: number;
  
  // Análise de qualidade
  qualityScore: number; // Score de qualidade (0-100)
  efficiencyIndex: number; // Índice de eficiência
  
  // Tendências
  trend: {
    impressions: 'up' | 'down' | 'stable';
    clicks: 'up' | 'down' | 'stable';
    cost: 'up' | 'down' | 'stable';
    ctr: 'up' | 'down' | 'stable';
    conversions: 'up' | 'down' | 'stable';
    roas: 'up' | 'down' | 'stable';
  };
  
  // Benchmarks
  benchmarks: {
    ctrStatus: 'excellent' | 'good' | 'average' | 'poor';
    cpcStatus: 'excellent' | 'good' | 'average' | 'expensive';
    roasStatus: 'excellent' | 'good' | 'average' | 'poor';
  };
}

export function calculateKPIs(data: TrafficData[]): KPIData {
  if (!data || data.length === 0) {
    return {
      totalImpressions: 0,
      totalReach: 0,
      totalClicks: 0,
      totalCost: 0,
      totalConversions: 0,
      totalLeads: 0,
      totalRevenue: 0,
      ctr: 0,
      cpm: 0,
      cpc: 0,
      cpl: 0,
      cpa: 0,
      roas: 0,
      roi: 0,
      conversionRate: 0,
      frequency: 0,
      reachRate: 0,
      averageCostPerDay: 0,
      averageClicksPerDay: 0,
      averageConversionsPerDay: 0,
      averageRevenuePerDay: 0,
      qualityScore: 0,
      efficiencyIndex: 0,
      trend: {
        impressions: 'stable',
        clicks: 'stable',
        cost: 'stable',
        ctr: 'stable',
        conversions: 'stable',
        roas: 'stable',
      },
      benchmarks: {
        ctrStatus: 'average',
        cpcStatus: 'average',
        roasStatus: 'average',
      },
    };
  }

  // Cálculos básicos - incluindo dados opcionais do CSV quando disponíveis
  const totalImpressions = data.reduce((sum, row) => sum + (row.impressions || 0), 0);
  const totalReach = data.reduce((sum, row) => sum + (row.reach || 0), 0);
  const totalClicks = data.reduce((sum, row) => sum + (row.clicks || 0), 0);
  const totalCost = data.reduce((sum, row) => sum + (row.cost || 0), 0);
  const totalConversions = data.reduce((sum, row) => sum + (row.conversions || 0), 0);
  const totalLeads = data.reduce((sum, row) => sum + (row.leads || 0), 0);
  const totalRevenue = data.reduce((sum, row) => sum + (row.revenue || 0), 0);

  // KPIs calculados com dados reais do CSV
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const cpm = totalImpressions > 0 ? (totalCost / totalImpressions) * 1000 : 0;
  const cpc = totalClicks > 0 ? totalCost / totalClicks : 0;
  const cpl = totalLeads > 0 ? totalCost / totalLeads : 0;
  const cpa = totalConversions > 0 ? totalCost / totalConversions : 0;
  const roas = totalCost > 0 ? totalRevenue / totalCost : 0;
  const roi = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0;
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

  // Frequência e alcance (quando dados de reach estão disponíveis)
  const frequency = totalReach > 0 ? totalImpressions / totalReach : 0;
  const reachRate = totalImpressions > 0 ? (totalReach / totalImpressions) * 100 : 0;

  // Médias
  const days = data.length;
  const averageCostPerDay = totalCost / days;
  const averageClicksPerDay = totalClicks / days;
  const averageConversionsPerDay = totalConversions / days;
  const averageRevenuePerDay = totalRevenue / days;

  // Score de qualidade (baseado em benchmarks da indústria)
  let qualityScore = 50; // Base score
  
  // CTR (1-3% é bom, >3% é excelente)
  if (ctr >= 3) qualityScore += 20;
  else if (ctr >= 1) qualityScore += 10;
  else if (ctr < 0.5) qualityScore -= 15;

  // CPC (menor é melhor)
  if (cpc > 0 && cpc <= 2) qualityScore += 15;
  else if (cpc <= 5) qualityScore += 5;
  else if (cpc > 20) qualityScore -= 15;

  // Taxa de conversão (>2% é bom, >5% é excelente)
  if (conversionRate >= 5) qualityScore += 15;
  else if (conversionRate >= 2) qualityScore += 10;
  else if (conversionRate < 0.5) qualityScore -= 10;

  // ROAS (>4 é bom, >6 é excelente) - apenas se dados de receita estão disponíveis
  if (totalRevenue > 0) {
    if (roas >= 6) qualityScore += 20;
    else if (roas >= 4) qualityScore += 10;
    else if (roas < 2) qualityScore -= 15;
  }

  qualityScore = Math.max(0, Math.min(100, qualityScore));

  // Índice de eficiência (combinação de CTR, CPC e taxa de conversão)
  const ctrNormalized = Math.min(ctr / 5, 1); // Normalizar CTR (máximo 5%)
  const cpcNormalized = cpc > 0 ? Math.max(0, 1 - (cpc / 10)) : 0; // Melhor quando menor
  const conversionNormalized = Math.min(conversionRate / 10, 1); // Normalizar conversão (máximo 10%)
  const efficiencyIndex = ((ctrNormalized + cpcNormalized + conversionNormalized) / 3) * 100;

  // Análise de tendência (comparar primeira e segunda metade do período)
  const midPoint = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, midPoint);
  const secondHalf = data.slice(midPoint);

  const calculateAverage = (arr: TrafficData[], field: keyof TrafficData) => 
    arr.reduce((sum, item) => sum + (Number(item[field]) || 0), 0) / arr.length;

  const getTrend = (firstValue: number, secondValue: number): 'up' | 'down' | 'stable' => {
    if (firstValue === 0 && secondValue === 0) return 'stable';
    if (firstValue === 0) return 'up';
    const change = ((secondValue - firstValue) / firstValue) * 100;
    if (change > 10) return 'up';
    if (change < -10) return 'down';
    return 'stable';
  };

  const trend = {
    impressions: getTrend(
      calculateAverage(firstHalf, 'impressions'),
      calculateAverage(secondHalf, 'impressions')
    ),
    clicks: getTrend(
      calculateAverage(firstHalf, 'clicks'),
      calculateAverage(secondHalf, 'clicks')
    ),
    cost: getTrend(
      calculateAverage(firstHalf, 'cost'),
      calculateAverage(secondHalf, 'cost')
    ),
    ctr: getTrend(
      (firstHalf.reduce((sum, row) => sum + row.clicks, 0) / firstHalf.reduce((sum, row) => sum + row.impressions, 0)) * 100 || 0,
      (secondHalf.reduce((sum, row) => sum + row.clicks, 0) / secondHalf.reduce((sum, row) => sum + row.impressions, 0)) * 100 || 0
    ),
    conversions: getTrend(
      calculateAverage(firstHalf, 'conversions'),
      calculateAverage(secondHalf, 'conversions')
    ),
    roas: getTrend(
      (firstHalf.reduce((sum, row) => sum + (row.revenue || 0), 0) / firstHalf.reduce((sum, row) => sum + row.cost, 0)) || 0,
      (secondHalf.reduce((sum, row) => sum + (row.revenue || 0), 0) / secondHalf.reduce((sum, row) => sum + row.cost, 0)) || 0
    ),
  };

  // Benchmarks baseados em padrões da indústria
  const getCTRStatus = (ctr: number): 'excellent' | 'good' | 'average' | 'poor' => {
    if (ctr >= 3) return 'excellent';
    if (ctr >= 1.5) return 'good';
    if (ctr >= 0.5) return 'average';
    return 'poor';
  };

  const getCPCStatus = (cpc: number): 'excellent' | 'good' | 'average' | 'expensive' => {
    if (cpc === 0) return 'average';
    if (cpc <= 2) return 'excellent';
    if (cpc <= 5) return 'good';
    if (cpc <= 15) return 'average';
    return 'expensive';
  };

  const getROASStatus = (roas: number): 'excellent' | 'good' | 'average' | 'poor' => {
    if (roas >= 6) return 'excellent';
    if (roas >= 4) return 'good';
    if (roas >= 2) return 'average';
    return 'poor';
  };

  const benchmarks = {
    ctrStatus: getCTRStatus(ctr),
    cpcStatus: getCPCStatus(cpc),
    roasStatus: totalRevenue > 0 ? getROASStatus(roas) : 'average' as const,
  };

  return {
    totalImpressions,
    totalReach,
    totalClicks,
    totalCost,
    totalConversions,
    totalLeads,
    totalRevenue,
    ctr,
    cpm,
    cpc,
    cpl,
    cpa,
    roas,
    roi,
    conversionRate,
    frequency,
    reachRate,
    averageCostPerDay,
    averageClicksPerDay,
    averageConversionsPerDay,
    averageRevenuePerDay,
    qualityScore,
    efficiencyIndex,
    trend,
    benchmarks,
  };
}