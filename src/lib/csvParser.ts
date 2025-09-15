import Papa from 'papaparse';
import { TrafficData } from '@/pages/Index';
import { validateData, ValidationResult } from './dataValidator';

interface CSVRow {
  [key: string]: string | number;
}

// Mapear possíveis nomes de colunas para nomes padronizados
const columnMapping: Record<string, string> = {
  // Date variations
  'data': 'date',
  'day': 'date',
  'fecha': 'date',
  'datum': 'date',
  'dia': 'date',
  'datestart': 'date',
  'date': 'date',
  
  // Impressions variations
  'impressoes': 'impressions',
  'impresiones': 'impressions',
  'impressionen': 'impressions',
  'impr': 'impressions',
  'impressions': 'impressions',
  
  // Clicks variations - incluindo campos específicos do Facebook
  'cliques': 'clicks',
  'clics': 'clicks',
  'klicks': 'clicks',
  'linkclicks': 'clicks',
  'link_clicks': 'clicks',
  'clicksalllinked': 'clicks',
  'websiteclicks': 'clicks',
  'clicks': 'clicks',
  
  // Cost variations - incluindo campos específicos do Facebook
  'custo': 'cost',
  'costo': 'cost',
  'kosten': 'cost',
  'spend': 'cost',
  'amountspent': 'cost',
  'amount_spent': 'cost',
  'investment': 'cost',
  'investimento': 'cost',
  'adspend': 'cost',
  'totalspend': 'cost',
  'cost': 'cost',
  
  // Conversions/Results/Leads variations
  'conversoes': 'conversions',
  'conversiones': 'conversions',
  'konversionen': 'conversions',
  'conv': 'conversions',
  'results': 'conversions',
  'result': 'conversions',
  'resultados': 'conversions',
  'purchases': 'conversions',
  'compras': 'conversions',
  'leads': 'leads',
  'lead': 'leads',
  'conversas': 'leads',
  'conversaciones': 'leads',
  'messages': 'leads',
  'mensagens': 'leads',
  'messaging_conversations_started': 'leads',
  'messagingconversationsstarted': 'leads',
  'conversations': 'leads',
  
  // Revenue variations
  'receita': 'revenue',
  'ingresos': 'revenue',
  'einnahmen': 'revenue',
  'revenue': 'revenue',
  'purchasevalue': 'revenue',
  'conversionvalue': 'revenue',
  'sales': 'revenue',
  'vendas': 'revenue',
  
  // Reach variations
  'alcance': 'reach',
  'reichweite': 'reach',
  'uniquereach': 'reach',
  'people_reached': 'reach',
  'reach': 'reach',
  
  // Campaign name variations
  'campaignname': 'campaignname',
  'campaign_name': 'campaignname',
  'campanha': 'campaignname',
  'campana': 'campaignname',
  'kampagne': 'campaignname',
  'campaign': 'campaignname',
  'nome_campanha': 'campaignname',
  
  // Facebook Ads specific fields - campos extras do Facebook
  'frequency': 'frequency',
  'frequencia': 'frequency',
  'costperresult': 'cpl',
  'cost_per_result': 'cpl',
  'cpm': 'cpm',
  'cpmcostper1000impressions': 'cpm',
  'cpc': 'cpc',
  'cpccostperlinkclick': 'cpc',
  'ctr': 'ctr',
  'ctrlinkclickthroughrate': 'ctr',
  'costpermessagingconversationsstarted': 'cpl'
};

function normalizeColumnName(columnName: string): string {
  const normalized = columnName.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  return columnMapping[normalized] || normalized;
}

function parseDate(dateStr: string): string {
  if (!dateStr || dateStr.trim() === '') {
    throw new Error('Data não pode estar vazia');
  }

  const trimmed = dateStr.trim();
  
  // Tenta vários formatos de data
  const formats = [
    /^\d{4}-\d{1,2}-\d{1,2}$/, // YYYY-MM-DD ou YYYY-M-D
    /^\d{1,2}\/\d{1,2}\/\d{4}$/, // DD/MM/YYYY ou D/M/YYYY
    /^\d{1,2}-\d{1,2}-\d{4}$/, // DD-MM-YYYY ou D-M-YYYY
    /^\d{1,2}\.\d{1,2}\.\d{4}$/, // DD.MM.YYYY ou D.M.YYYY
  ];
  
  // Formato YYYY-MM-DD (já correto)
  if (formats[0].test(trimmed)) {
    const [year, month, day] = trimmed.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // Formato DD/MM/YYYY
  if (formats[1].test(trimmed)) {
    const [day, month, year] = trimmed.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // Formato DD-MM-YYYY
  if (formats[2].test(trimmed)) {
    const [day, month, year] = trimmed.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // Formato DD.MM.YYYY
  if (formats[3].test(trimmed)) {
    const [day, month, year] = trimmed.split('.');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // Tentar parsing com Date para outros formatos
  const parsedDate = new Date(trimmed);
  if (!isNaN(parsedDate.getTime())) {
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = parsedDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  throw new Error(`Formato de data inválido: ${dateStr}`);
}

function parseNumber(value: string | number): number {
  if (typeof value === 'number') return value;
  
  // Remove símbolos de moeda e espaços
  const cleaned = value.toString().replace(/[R$,\s]/g, '').replace(/\./g, '');
  const parsed = parseFloat(cleaned);
  
  if (isNaN(parsed)) return 0;
  return parsed;
}

export interface CSVPreview {
  columns: string[];
  needsMapping: boolean;
  data?: TrafficData[];
}

export function analyzeCSVStructure(file: File): Promise<{ columns: string[]; needsMapping: boolean }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy', // Pular todas as linhas vazias
      preview: 10, // Apenas primeiras 10 linhas para análise
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            console.warn('CSV analysis warnings:', results.errors);
          }
          
          let data = results.data as CSVRow[];
          
          // Filtrar linhas que provavelmente são totais ou linhas de resumo
          data = data.filter((row, index) => {
            const values = Object.values(row);
            const nonEmptyValues = values.filter(v => v !== null && v !== undefined && v !== '').length;
            
            if (nonEmptyValues < 3) return false;
            
            const hasCampaign = row['Campaign Name'] || row['campaignname'] || row['campaign'] || row['Campaign'];
            const hasDate = row['Day'] || row['date'] || row['Date'] || row['DATA'];
            
            if (!hasCampaign && !hasDate) return false;
            
            return true;
          });
          
          if (data.length === 0) {
            throw new Error('Não foi possível analisar a estrutura do arquivo CSV.');
          }
          
          const originalColumns = Object.keys(data[0]);
          const normalizedColumns = originalColumns.map(normalizeColumnName);
          
          // Verificar se tem as colunas essenciais mapeadas
          const requiredColumns = ['date', 'impressions', 'clicks', 'cost'];
          
          const hasAllRequired = requiredColumns.every(col => normalizedColumns.includes(col));
          
          resolve({
            columns: originalColumns,
            needsMapping: !hasAllRequired
          });
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new Error(`Erro ao analisar arquivo CSV: ${error.message}`));
      }
    });
  });
}

export function parseCSVWithMapping(file: File, columnMapping?: Record<string, string>): Promise<TrafficData[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy', // Pular todas as linhas vazias
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }
          
          let data = results.data as CSVRow[];
          
          // Filtrar linhas que provavelmente são totais ou linhas de resumo
          data = data.filter((row, index) => {
            // Verificar se a linha tem dados mínimos necessários
            const values = Object.values(row);
            const nonEmptyValues = values.filter(v => v !== null && v !== undefined && v !== '').length;
            
            // Se tem menos de 3 campos preenchidos, provavelmente é uma linha de total
            if (nonEmptyValues < 3) {
              console.log(`Filtrando linha ${index + 1}: poucos dados (${nonEmptyValues} campos)`);
              return false;
            }
            
            // Verificar se tem pelo menos uma identificação de campanha ou data
            const hasCampaign = row['Campaign Name'] || row['campaignname'] || row['campaign'] || row['Campaign'];
            const hasDate = row['Day'] || row['date'] || row['Date'] || row['DATA'];
            
            if (!hasCampaign && !hasDate) {
              console.log(`Filtrando linha ${index + 1}: sem campanha nem data`);
              return false;
            }
            
            return true;
          });
          
          if (data.length === 0) {
            throw new Error('Arquivo CSV está vazio ou não possui dados válidos após filtragem.');
          }
          
          // Aplicar mapeamento de colunas (manual ou automático)
          const normalizedData = data.map((row) => {
            const normalizedRow: Record<string, unknown> = {};
            Object.entries(row).forEach(([key, value]) => {
              let mappedKey: string;
              
              if (columnMapping && Object.keys(columnMapping).includes(key)) {
                // Usar mapeamento manual
                mappedKey = columnMapping[key];
                if (mappedKey === 'none') return; // Ignorar esta coluna
              } else {
                // Usar mapeamento automático
                mappedKey = normalizeColumnName(key);
              }
              
              normalizedRow[mappedKey] = value;
            });
            return normalizedRow;
          });

          // Usar o novo validador
          const validationResult = validateData(normalizedData, 'traffic');
          
          if (!validationResult.isValid) {
            throw new Error(
              `Erro de validação:\n${validationResult.errors.join('\n')}\n\n` +
              `Sugestões:\n${validationResult.suggestions?.join('\n') || 'Nenhuma'}`
            );
          }

          if (validationResult.warnings && validationResult.warnings.length > 0) {
            console.warn('Avisos de validação:', validationResult.warnings);
          }

          const validData = validationResult.data || [];
          
          if (validData.length === 0) {
            throw new Error('Nenhum dado válido encontrado no arquivo.');
          }

          // Ordenar por data
          validData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          resolve(validData);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new Error(`Erro ao processar arquivo CSV: ${error.message}`));
      }
    });
  });
}

// Função retrocompatível - mantém a interface original
export function parseCSV(file: File): Promise<TrafficData[]> {
  return parseCSVWithMapping(file);
}