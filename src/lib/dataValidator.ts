import { TrafficData } from '@/pages/Index';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data?: TrafficData[];
  suggestions?: string[];
}

export interface ValidationRule {
  field: keyof TrafficData;
  required: boolean;
  type: 'number' | 'string' | 'date';
  min?: number;
  max?: number;
  pattern?: RegExp;
}

// Regras de validação para dados de tráfego - mais flexíveis para Facebook Ads
const TRAFFIC_VALIDATION_RULES: ValidationRule[] = [
  { field: 'date', required: true, type: 'date' },
  { field: 'impressions', required: true, type: 'number', min: 0 },
  { field: 'clicks', required: false, type: 'number', min: 0 }, // Não obrigatório pois pode estar vazio no Facebook
  { field: 'cost', required: true, type: 'number', min: 0 },
  { field: 'leads', required: false, type: 'number', min: 0 },
  { field: 'conversions', required: false, type: 'number', min: 0 },
  { field: 'revenue', required: false, type: 'number', min: 0 },
  { field: 'reach', required: false, type: 'number', min: 0 },
  { field: 'campaignname', required: false, type: 'string' },
];

// Extensão para social media (futuro)
const SOCIAL_MEDIA_RULES: ValidationRule[] = [
  { field: 'likes', required: false, type: 'number', min: 0 },
  { field: 'comments', required: false, type: 'number', min: 0 },
  { field: 'shares', required: false, type: 'number', min: 0 },
  { field: 'followers', required: false, type: 'number', min: 0 },
  { field: 'engagement', required: false, type: 'number', min: 0 },
  { field: 'posts', required: false, type: 'number', min: 0 },
  { field: 'stories', required: false, type: 'number', min: 0 },
  { field: 'reels', required: false, type: 'number', min: 0 },
  { field: 'saves', required: false, type: 'number', min: 0 },
  { field: 'profileVisits', required: false, type: 'number', min: 0 },
];

export function validateData(data: Record<string, unknown>[], type: 'traffic' | 'social' = 'traffic'): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  const validatedData: TrafficData[] = [];

  if (!data || data.length === 0) {
    return {
      isValid: false,
      errors: ['Arquivo vazio ou sem dados válidos'],
      warnings: [],
      suggestions: ['Verifique se o arquivo contém dados e está no formato correto (CSV ou XLSX)']
    };
  }

  const rules = type === 'traffic' ? TRAFFIC_VALIDATION_RULES : [...TRAFFIC_VALIDATION_RULES, ...SOCIAL_MEDIA_RULES];
  const requiredFields = rules.filter(rule => rule.required).map(rule => rule.field);

  // Verificar se todas as colunas obrigatórias estão presentes
  const firstRow = data[0];
  const availableFields = Object.keys(firstRow);
  const missingFields = requiredFields.filter(field => !availableFields.includes(field as string));

  if (missingFields.length > 0) {
    errors.push(`Colunas obrigatórias ausentes: ${missingFields.join(', ')}`);
    suggestions.push('Certifique-se de que seu arquivo contém as colunas: date, impressions, clicks, cost');
  }

  // Validar cada linha de dados
  data.forEach((row, index) => {
    const rowNumber = index + 1;
    const validatedRow: Partial<TrafficData> = {};

    // Verificar se a linha é uma linha de total (sem nome de campanha e sem data)
    const hasAnyCampaignData = row['Campaign Name'] || row['campaignname'] || row['campaign'];
    const hasDateData = row['Day'] || row['date'] || row['Date'];
    
    // Se não tem dados de campanha nem data, provavelmente é uma linha de total - pular
    if (!hasAnyCampaignData && !hasDateData) {
      warnings.push(`Linha ${rowNumber}: Pulando linha de total/resumo sem dados de campanha ou data`);
      return;
    }

    rules.forEach(rule => {
      const value = row[rule.field as string];
      const fieldName = rule.field;

      // Verificar campo obrigatório - mas ser mais flexível com linhas de dados incompletos
      if (rule.required && (value === undefined || value === null || value === '')) {
        // Para data especificamente, ser mais tolerante se for linha com poucos dados
        if (fieldName === 'date') {
          // Se a linha tem poucos campos preenchidos, assumir que é linha de total e pular
          const filledFields = Object.values(row).filter(v => v !== undefined && v !== null && v !== '').length;
          if (filledFields <= 3) {
            warnings.push(`Linha ${rowNumber}: Pulando linha com dados insuficientes (possível linha de total)`);
            return;
          }
        }
        errors.push(`Linha ${rowNumber}: Campo '${fieldName}' é obrigatório`);
        return;
      }

      // Se campo não está presente ou está vazio e não é obrigatório, pular validação
      if (value === undefined || value === null || value === '') {
        // Para campos numéricos não obrigatórios, definir como 0
        if (rule.type === 'number' && !rule.required) {
          (validatedRow as Record<string, unknown>)[fieldName as string] = 0;
        }
        return;
      }

      // Validação por tipo
      switch (rule.type) {
        case 'number': {
          const numValue = parseFloat(value as string);
          if (isNaN(numValue)) {
            errors.push(`Linha ${rowNumber}: '${fieldName}' deve ser um número válido (valor: ${value})`);
          } else {
            if (rule.min !== undefined && numValue < rule.min) {
              errors.push(`Linha ${rowNumber}: '${fieldName}' deve ser maior ou igual a ${rule.min}`);
            }
            if (rule.max !== undefined && numValue > rule.max) {
              warnings.push(`Linha ${rowNumber}: '${fieldName}' parece muito alto (${numValue})`);
            }
            (validatedRow as Record<string, unknown>)[fieldName as string] = numValue;
          }
          break;
        }

        case 'date': {
          const dateValue = parseDate(value);
          if (!dateValue) {
            errors.push(`Linha ${rowNumber}: '${fieldName}' deve ser uma data válida (valor: ${value})`);
            suggestions.push('Use formato: YYYY-MM-DD, DD/MM/YYYY ou DD-MM-YYYY');
          } else {
            (validatedRow as Record<string, unknown>)[fieldName as string] = dateValue.toISOString().split('T')[0];
          }
          break;
        }

        case 'string': {
          (validatedRow as Record<string, unknown>)[fieldName as string] = String(value).trim();
          break;
        }
      }
    });

    // Verificações de consistência de dados - apenas quando há dados válidos
    if (validatedRow.clicks && validatedRow.clicks > 0 && validatedRow.impressions && validatedRow.impressions > 0) {
      const ctr = (validatedRow.clicks / validatedRow.impressions) * 100;
      if (ctr > 20) {
        warnings.push(`Linha ${rowNumber}: CTR muito alto (${ctr.toFixed(2)}%) - verifique os dados`);
      }
      if (ctr < 0.1) {
        warnings.push(`Linha ${rowNumber}: CTR muito baixo (${ctr.toFixed(2)}%) - pode indicar problema`);
      }
    }

    if (validatedRow.clicks && validatedRow.clicks > 0 && validatedRow.leads && validatedRow.leads > 0) {
      if (validatedRow.leads > validatedRow.clicks) {
        errors.push(`Linha ${rowNumber}: Leads (${validatedRow.leads}) não pode ser maior que cliques (${validatedRow.clicks})`);
      }
    }

    if (validatedRow.cost && validatedRow.cost > 0 && validatedRow.clicks && validatedRow.clicks > 0) {
      const cpc = validatedRow.cost / validatedRow.clicks;
      if (cpc > 100) {
        warnings.push(`Linha ${rowNumber}: CPC muito alto (R$ ${cpc.toFixed(2)}) - verifique os valores`);
      }
    }

    if (Object.keys(validatedRow).length > 0) {
      validatedData.push(validatedRow as TrafficData);
    }
  });

  // Verificações adicionais no conjunto de dados
  if (validatedData.length > 1) {
    // Verificar ordem cronológica
    const dates = validatedData.map(row => new Date(row.date)).sort((a, b) => a.getTime() - b.getTime());
    const isChronological = validatedData.every((row, index) => {
      if (index === 0) return true;
      return new Date(row.date) >= new Date(validatedData[index - 1].date);
    });

    if (!isChronological) {
      warnings.push('Dados não estão em ordem cronológica - pode afetar análises de tendência');
      suggestions.push('Ordene os dados por data para melhor análise');
    }

    // Verificar gaps de datas
    if (dates.length > 2) {
      const daysDiff = Math.abs(dates[dates.length - 1].getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff > validatedData.length * 2) {
        warnings.push('Há gaps significativos entre as datas - considere preencher dados faltantes');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: validatedData,
    suggestions
  };
}

function parseDate(value: unknown): Date | null {
  if (!value) return null;

  // Tentar diferentes formatos de data
  const formats = [
    // ISO format
    /^\d{4}-\d{2}-\d{2}$/,
    // Brazilian format
    /^\d{2}\/\d{2}\/\d{4}$/,
    // European format
    /^\d{2}-\d{2}-\d{4}$/,
  ];

  const dateStr = String(value).trim();

  // ISO format (YYYY-MM-DD)
  if (formats[0].test(dateStr)) {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  // Brazilian format (DD/MM/YYYY)
  if (formats[1].test(dateStr)) {
    const [day, month, year] = dateStr.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return isNaN(date.getTime()) ? null : date;
  }

  // European format (DD-MM-YYYY)
  if (formats[2].test(dateStr)) {
    const [day, month, year] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return isNaN(date.getTime()) ? null : date;
  }

  // Try native Date parsing as fallback
  const date = new Date(value as string);
  return isNaN(date.getTime()) ? null : date;
}

export function getDataQualityScore(result: ValidationResult): {
  score: number;
  level: 'excellent' | 'good' | 'fair' | 'poor';
  feedback: string;
} {
  if (!result.isValid) {
    return {
      score: 0,
      level: 'poor',
      feedback: 'Dados contêm erros críticos que impedem a análise'
    };
  }

  const warnings = result.warnings?.length || 0;
  const dataSize = result.data?.length || 0;

  let score = 100;

  // Penalizar por warnings
  score -= warnings * 10;

  // Bonificar por tamanho adequado do dataset
  if (dataSize >= 30) score += 10;
  else if (dataSize >= 7) score += 5;
  else if (dataSize < 3) score -= 20;

  score = Math.max(0, Math.min(100, score));

  let level: 'excellent' | 'good' | 'fair' | 'poor';
  let feedback: string;

  if (score >= 90) {
    level = 'excellent';
    feedback = 'Dados de excelente qualidade, prontos para análise avançada';
  } else if (score >= 75) {
    level = 'good';
    feedback = 'Dados de boa qualidade com pequenos pontos de atenção';
  } else if (score >= 50) {
    level = 'fair';
    feedback = 'Dados utilizáveis, mas com várias inconsistências';
  } else {
    level = 'poor';
    feedback = 'Qualidade dos dados comprometida, recomenda-se revisão';
  }

  return { score, level, feedback };
}