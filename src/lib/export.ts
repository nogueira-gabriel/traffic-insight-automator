import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import pptxgen from 'pptxgenjs';
import { KPIData } from './kpiCalculations';
import { TrafficData } from '@/pages/Index';

export interface ExportOptions {
  format: 'pdf' | 'png' | 'pptx';
  includeHeader?: boolean;
  includeCharts?: boolean;
  includeKPIs?: boolean;
  quality?: 'low' | 'medium' | 'high';
  filename?: string;
}

export interface ExportResult {
  success: boolean;
  message: string;
  filename?: string;
  error?: Error;
}

// Cores da paleta do projeto
const BRAND_COLORS = {
  primary: '#D21B1B',
  secondary: '#2563eb',
  background: '#ffffff',
  text: '#1f2937',
  gray: '#6b7280',
  lightGray: '#f9fafb',
  border: '#e5e7eb',
};

// Função principal para exportar o dashboard
export const exportDashboard = async (
  dashboardElement: HTMLElement,
  kpiData: KPIData,
  tableData: TrafficData[],
  options: ExportOptions = { format: 'pdf' }
): Promise<ExportResult> => {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = options.filename || `relatorio-trafego-${timestamp}`;

    switch (options.format) {
      case 'pdf':
        return await exportToPdfAdvanced(dashboardElement, kpiData, tableData, filename, options);
      case 'png':
        return await exportToPng(dashboardElement, filename, options);
      case 'pptx':
        return exportToPptxAdvanced(kpiData, tableData, filename);
      default:
        throw new Error(`Formato não suportado: ${options.format}`);
    }
  } catch (error) {
    console.error('Erro durante exportação:', error);
    return {
      success: false,
      message: `Erro ao exportar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      error: error instanceof Error ? error : new Error('Erro desconhecido'),
    };
  }
};

// Exportação para PDF com alta qualidade
const exportToPdfAdvanced = async (
  dashboardElement: HTMLElement,
  kpiData: KPIData,
  tableData: TrafficData[],
  filename: string,
  options: ExportOptions
): Promise<ExportResult> => {
  if (!dashboardElement) {
    throw new Error('Elemento do dashboard não encontrado');
  }

  // Configurações para máxima qualidade
  const quality = options.quality || 'high';
  const scale = quality === 'high' ? 3 : quality === 'medium' ? 2 : 1;

  // Preparar elemento para captura (melhorar qualidade visual)
  const originalStyle = dashboardElement.style.cssText;
  dashboardElement.style.transform = 'scale(1)';
  dashboardElement.style.transformOrigin = 'top left';

  const canvas = await html2canvas(dashboardElement, {
    scale: scale,
    useCORS: true,
    allowTaint: false,
    backgroundColor: BRAND_COLORS.background,
    logging: false,
    width: dashboardElement.scrollWidth,
    height: dashboardElement.scrollHeight,
    onclone: (clonedDoc) => {
      // Aplicar estilos específicos para melhorar a qualidade da captura
      const clonedElement = clonedDoc.querySelector('[data-dashboard]') || clonedDoc.body;
      if (clonedElement instanceof HTMLElement) {
        clonedElement.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        // Note: fontSmoothing properties are vendor-specific and may not be available in all browsers
        (clonedElement.style as any).fontSmoothing = 'antialiased';
        (clonedElement.style as any).webkitFontSmoothing = 'antialiased';
      }
    },
  });

  // Restaurar estilo original
  dashboardElement.style.cssText = originalStyle;

  // Criar PDF com dimensões otimizadas
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 295; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;

  const pdf = new jsPDF('p', 'mm', 'a4');

  // Adicionar capa profissional
  if (options.includeHeader !== false) {
    addCoverPage(pdf, kpiData, tableData);
  }

  // Adicionar dashboard
  let position = 0;
  const imgData = canvas.toDataURL('image/png', 0.95);

  pdf.addPage();
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Adicionar páginas extras se necessário
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // Adicionar página de insights se houver dados suficientes
  if (tableData.length > 7) {
    addInsightsPage(pdf, kpiData, tableData);
  }

  // Salvar arquivo
  pdf.save(`${filename}.pdf`);

  return {
    success: true,
    message: 'Relatório PDF exportado com sucesso!',
    filename: `${filename}.pdf`,
  };
};

// Função para adicionar capa profissional ao PDF
const addCoverPage = (pdf: jsPDF, kpiData: KPIData, tableData: TrafficData[]) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Background
  pdf.setFillColor(BRAND_COLORS.background);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header com cor da marca
  pdf.setFillColor(BRAND_COLORS.primary);
  pdf.rect(0, 0, pageWidth, 40, 'F');

  // Título principal
  pdf.setTextColor('#ffffff');
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RELATÓRIO DE TRÁFEGO DIGITAL', pageWidth / 2, 25, { align: 'center' });

  // Subtítulo
  pdf.setTextColor(BRAND_COLORS.text);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  const dateRange = tableData.length > 0 ? 
    `${new Date(tableData[0].date).toLocaleDateString('pt-BR')} - ${new Date(tableData[tableData.length - 1].date).toLocaleDateString('pt-BR')}` :
    new Date().toLocaleDateString('pt-BR');
  
  pdf.text(`Período: ${dateRange}`, pageWidth / 2, 60, { align: 'center' });
  pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, 75, { align: 'center' });

  // Resumo executivo
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RESUMO EXECUTIVO', 20, 110);

  // KPIs principais na capa
  const mainKPIs = [
    { label: 'Total de Impressões', value: kpiData.totalImpressions.toLocaleString('pt-BR') },
    { label: 'Total de Cliques', value: kpiData.totalClicks.toLocaleString('pt-BR') },
    { label: 'Taxa de Clique (CTR)', value: `${kpiData.ctr.toFixed(2)}%` },
    { label: 'Custo Total', value: `R$ ${kpiData.totalCost.toFixed(2)}` },
    { label: 'Custo por Clique (CPC)', value: `R$ ${kpiData.cpc.toFixed(2)}` },
    { label: 'ROAS', value: kpiData.roas.toFixed(2) },
  ];

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  let yPos = 130;

  mainKPIs.forEach((kpi, index) => {
    const x = 20 + (index % 2) * 85;
    if (index % 2 === 0 && index > 0) yPos += 25;

    pdf.setFont('helvetica', 'bold');
    pdf.text(kpi.label + ':', x, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(kpi.value, x, yPos + 10);
  });

  // Rodapé
  pdf.setFontSize(10);
  pdf.setTextColor(BRAND_COLORS.gray);
  pdf.text('Relatório gerado automaticamente pelo Traffic Insight Automator', pageWidth / 2, pageHeight - 20, { align: 'center' });
};

// Função para adicionar página de insights
const addInsightsPage = (pdf: jsPDF, kpiData: KPIData, tableData: TrafficData[]) => {
  pdf.addPage();
  const pageWidth = pdf.internal.pageSize.getWidth();

  // Título da página
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(BRAND_COLORS.text);
  pdf.text('INSIGHTS E ANÁLISES', 20, 25);

  // Análise de performance
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Performance Geral:', 20, 45);

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  let yPos = 55;

  const insights = generateInsights(kpiData, tableData);
  insights.forEach((insight) => {
    const lines = pdf.splitTextToSize(insight, pageWidth - 40);
    pdf.text(lines, 20, yPos);
    yPos += lines.length * 6 + 8;
  });

  // Benchmarks
  yPos += 10;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Benchmarks da Indústria:', 20, yPos);

  yPos += 15;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');

  const benchmarkTexts = [
    `CTR: ${getStatusText(kpiData.benchmarks.ctrStatus)} (${kpiData.ctr.toFixed(2)}%)`,
    `CPC: ${getStatusText(kpiData.benchmarks.cpcStatus)} (R$ ${kpiData.cpc.toFixed(2)})`,
    `ROAS: ${getStatusText(kpiData.benchmarks.roasStatus)} (${kpiData.roas.toFixed(2)})`,
  ];

  benchmarkTexts.forEach((text) => {
    pdf.text(text, 20, yPos);
    yPos += 12;
  });
};

// Função para exportar como PNG
const exportToPng = async (dashboardElement: HTMLElement, filename: string, options: ExportOptions): Promise<ExportResult> => {
  const quality = options.quality || 'high';
  const scale = quality === 'high' ? 3 : quality === 'medium' ? 2 : 1;

  const canvas = await html2canvas(dashboardElement, {
    scale: scale,
    useCORS: true,
    backgroundColor: BRAND_COLORS.background,
    logging: false,
  });

  // Criar link para download
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png', 0.95);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return {
    success: true,
    message: 'Imagem PNG exportada com sucesso!',
    filename: `${filename}.png`,
  };
};

// Função para exportar para PPTX
const exportToPptxAdvanced = (kpiData: KPIData, tableData: TrafficData[], filename: string): ExportResult => {
  const pres = new pptxgen();

  // Slide 1: Capa
  const coverSlide = pres.addSlide();
  coverSlide.background = { color: 'FFFFFF' };
  
  coverSlide.addText('RELATÓRIO DE TRÁFEGO DIGITAL', {
    x: 0.5, y: 2, w: '90%', h: 1,
    align: 'center', fontSize: 32, color: BRAND_COLORS.primary.replace('#', ''), bold: true,
  });

  const dateRange = tableData.length > 0 ? 
    `${new Date(tableData[0].date).toLocaleDateString('pt-BR')} - ${new Date(tableData[tableData.length - 1].date).toLocaleDateString('pt-BR')}` :
    new Date().toLocaleDateString('pt-BR');

  coverSlide.addText(`Período: ${dateRange}`, {
    x: 0.5, y: 3, w: '90%', h: 0.5,
    align: 'center', fontSize: 18, color: BRAND_COLORS.text.replace('#', ''),
  });

  // Slide 2: KPIs Principais
  const kpiSlide = pres.addSlide();
  kpiSlide.background = { color: 'FFFFFF' };
  kpiSlide.addText('PRINCIPAIS INDICADORES (KPIs)', { 
    x: 0.5, y: 0.2, w: '90%', h: 0.5, 
    fontSize: 24, bold: true, color: BRAND_COLORS.text.replace('#', '') 
  });

  const mainKPIs = [
    { title: 'Impressões', value: kpiData.totalImpressions.toLocaleString('pt-BR') },
    { title: 'Cliques', value: kpiData.totalClicks.toLocaleString('pt-BR') },
    { title: 'CTR', value: `${kpiData.ctr.toFixed(2)}%` },
    { title: 'CPC', value: `R$ ${kpiData.cpc.toFixed(2)}` },
    { title: 'Custo Total', value: `R$ ${kpiData.totalCost.toFixed(2)}` },
    { title: 'ROAS', value: kpiData.roas.toFixed(2) },
  ];

  mainKPIs.forEach((kpi, index) => {
    const x = 0.5 + (index % 3) * 3;
    const y = 1.2 + Math.floor(index / 3) * 2;
    
    kpiSlide.addText(kpi.title, {
      x, y, w: 2.5, h: 0.5,
      align: 'center', fontSize: 16, bold: true, color: BRAND_COLORS.primary.replace('#', ''),
    });
    
    kpiSlide.addText(kpi.value, {
      x, y: y + 0.5, w: 2.5, h: 0.8,
      align: 'center', fontSize: 20, bold: true, color: BRAND_COLORS.text.replace('#', ''),
    });
  });

  // Salvar arquivo
  pres.writeFile({ fileName: `${filename}.pptx` });

  return {
    success: true,
    message: 'Apresentação PPTX exportada com sucesso!',
    filename: `${filename}.pptx`,
  };
};

// Funções auxiliares
const generateInsights = (kpiData: KPIData, tableData: TrafficData[]): string[] => {
  const insights: string[] = [];

  // Insight sobre CTR
  if (kpiData.ctr >= 3) {
    insights.push('✅ Excelente performance de CTR (>3%), indicando alta relevância dos anúncios para o público-alvo.');
  } else if (kpiData.ctr < 1) {
    insights.push('⚠️ CTR abaixo da média (<1%), considere otimizar criativos, segmentação e palavras-chave.');
  }

  // Insight sobre CPC
  if (kpiData.cpc <= 2) {
    insights.push('💰 CPC muito competitivo (≤R$2), demonstrando eficiência na estratégia de lances.');
  } else if (kpiData.cpc > 10) {
    insights.push('💸 CPC elevado (>R$10), revise a segmentação e considere otimizar os lances.');
  }

  // Insight sobre ROAS
  if (kpiData.roas >= 4) {
    insights.push('🚀 ROAS excelente (≥4), campanha muito rentável e sustentável.');
  } else if (kpiData.roas < 2) {
    insights.push('📉 ROAS baixo (<2), necessário revisar estratégia para melhorar retorno sobre investimento.');
  }

  // Insight sobre tendências
  if (kpiData.trend.ctr === 'up' && kpiData.trend.cost === 'down') {
    insights.push('📈 Tendência positiva: CTR crescendo enquanto custos diminuem, indicando otimização eficiente.');
  }

  // Insight sobre qualidade dos dados
  if (kpiData.qualityScore >= 80) {
    insights.push('⭐ Qualidade dos dados excelente, permitindo análises confiáveis e tomada de decisão assertiva.');
  }

  return insights;
};

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    excellent: 'Excelente',
    good: 'Bom',
    average: 'Médio',
    poor: 'Baixo',
    expensive: 'Alto',
  };
  return statusMap[status] || status;
};

// Função legacy para compatibilidade
export const exportToPdf = async (dashboardElement: HTMLElement) => {
  const result = await exportDashboard(dashboardElement, {} as KPIData, [], { format: 'pdf' });
  if (!result.success) {
    console.error(result.message);
  }
};

export const exportToPptx = (kpiData: KPIData, tableData: TrafficData[]) => {
  const result = exportToPptxAdvanced(kpiData, tableData, `relatorio-trafego-${new Date().toISOString().split('T')[0]}`);
  if (!result.success) {
    console.error(result.message);
  }
};
