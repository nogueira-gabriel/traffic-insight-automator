import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Função para formatar valores monetários em Real Brasileiro
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

// Função para formatar números com separadores brasileiros
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

// Função para formatar percentuais
export function formatPercentage(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
}

// Função para calcular preço por lead
export function calculateCostPerLead(totalCost: number, totalLeads: number): number {
  return totalLeads > 0 ? totalCost / totalLeads : 0;
}

// Função para calcular taxa de conversão de leads
export function calculateLeadConversionRate(leads: number, messagesSent: number): number {
  return messagesSent > 0 ? (leads / messagesSent) * 100 : 0;
}

// Função para obter o período completo dos dados
export function getDateRange(data: Array<{ date: string }>): { start: string, end: string } {
  if (data.length === 0) return { start: '', end: '' };
  
  const dates = data.map(item => new Date(item.date)).sort((a, b) => a.getTime() - b.getTime());
  return {
    start: dates[0].toISOString().split('T')[0],
    end: dates[dates.length - 1].toISOString().split('T')[0]
  };
}

// Função para formatar período de datas em português
export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate).toLocaleDateString('pt-BR');
  const end = new Date(endDate).toLocaleDateString('pt-BR');
  return `${start} - ${end}`;
}
