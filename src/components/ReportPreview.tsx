import { Download, FileText, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TrafficData } from "@/pages/Index";
import { KPIData } from "@/lib/kpiCalculations";
import { exportDashboard, ExportOptions } from "@/lib/export";
import Methodology from "@/components/Methodology";
import { useState } from "react";
import { toast } from "sonner";

interface ReportPreviewProps {
  data: TrafficData[];
  kpis: KPIData;
}

export const ReportPreview = ({ data, kpis }: ReportPreviewProps) => {
  const [isExporting, setIsExporting] = useState(false);
  
  const dateRange = data.length > 0 ? {
    start: new Date(data[0].date).toLocaleDateString('pt-BR'),
    end: new Date(data[data.length - 1].date).toLocaleDateString('pt-BR')
  } : null;

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatNumber = (value: number) => 
    new Intl.NumberFormat('pt-BR').format(Math.round(value));

  const formatPercentage = (value: number) => 
    `${value.toFixed(2)}%`;

  const getInsights = () => {
    const insights = [];
    
    if (kpis.ctr > 2) {
      insights.push("📈 Excelente CTR acima de 2%, indicando alta relevância dos anúncios");
    } else if (kpis.ctr < 1) {
      insights.push("🔍 CTR abaixo de 1%, considere otimizar criativos e segmentação");
    }
    
    if (kpis.cpl > 0 && kpis.cpl < 50) {
      insights.push("✅ Custo por lead muito competitivo, estratégia eficiente");
    } else if (kpis.cpl > 100) {
      insights.push("⚠️ Custo por lead elevado, revisar segmentação e ofertas");
    }
    
    if (kpis.trend.impressions === 'up' && kpis.trend.ctr === 'up') {
      insights.push("🚀 Crescimento simultâneo em impressões e CTR, campanha em ascensão");
    }
    
    return insights;
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Encontrar o elemento do dashboard
      const dashboardElement = document.querySelector('[data-dashboard]') as HTMLElement;
      if (!dashboardElement) {
        toast.error("Elemento do dashboard não encontrado");
        return;
      }

      const options: ExportOptions = {
        format: 'pdf',
        quality: 'high',
        includeHeader: true,
        includeCharts: true,
        includeKPIs: true,
      };

      const result = await exportDashboard(dashboardElement, kpis, data, options);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Erro ao exportar PDF");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPNG = async () => {
    setIsExporting(true);
    try {
      const dashboardElement = document.querySelector('[data-dashboard]') as HTMLElement;
      if (!dashboardElement) {
        toast.error("Elemento do dashboard não encontrado");
        return;
      }

      const options: ExportOptions = {
        format: 'png',
        quality: 'high',
      };

      const result = await exportDashboard(dashboardElement, kpis, data, options);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Erro ao exportar PNG");
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPPTX = () => {
    try {
      const options: ExportOptions = {
        format: 'pptx',
      };

      const result = exportDashboard(document.body, kpis, data, options);
      
      toast.success("Apresentação PPTX exportada com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar PPTX");
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header do Relatório */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D21B1B] rounded-xl shadow-lg">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Relatório de Tráfego
          </h1>
          <p className="text-gray-600">
            Análise completa de performance publicitária
          </p>
          {dateRange && (
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mt-2">
              <Calendar className="w-4 h-4" />
              <span>Período: {dateRange.start} - {dateRange.end}</span>
            </div>
          )}
        </div>
      </div>

      {/* Botões de Exportação */}
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={handleExportPDF} 
          disabled={isExporting}
          className="bg-[#D21B1B] hover:bg-[#B91B1B] text-white shadow-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exportando...' : 'Exportar PDF'}
        </Button>
        <Button 
          variant="outline" 
          onClick={handleExportPNG}
          disabled={isExporting}
          className="border-[#D21B1B] text-[#D21B1B] hover:bg-[#D21B1B] hover:text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exportando...' : 'Exportar PNG'}
        </Button>
        <Button 
          variant="outline" 
          onClick={handleExportPPTX}
          disabled={isExporting}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar PPTX
        </Button>
      </div>

      {/* Resumo Executivo */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <TrendingUp className="w-5 h-5 text-[#D21B1B]" />
            <span>Resumo Executivo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-3xl font-bold text-[#D21B1B]">
                {formatNumber(kpis.totalImpressions)}
              </div>
              <div className="text-sm text-gray-600">Total de Impressões</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-3xl font-bold text-[#D21B1B]">
                {formatPercentage(kpis.ctr)}
              </div>
              <div className="text-sm text-gray-600">Taxa de Cliques (CTR)</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-3xl font-bold text-[#D21B1B]">
                {formatCurrency(kpis.totalCost)}
              </div>
              <div className="text-sm text-gray-600">Investimento Total</div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Destaques de Performance:</h4>
              <ul className="space-y-1 text-sm">
                <li>• CPL: {formatCurrency(kpis.cpl)}</li>
                <li>• CPC: {formatCurrency(kpis.cpc)}</li>
                <li>• CPM: {formatCurrency(kpis.cpm)}</li>
                <li>• Conversões: {formatNumber(kpis.totalLeads > 0 ? kpis.totalLeads : kpis.totalConversions)}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Análise de Tendência:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Impressões: 
                  <span className={`ml-1 ${
                    kpis.trend.impressions === 'up' ? 'text-success' : 
                    kpis.trend.impressions === 'down' ? 'text-destructive' : 'text-muted-foreground'
                  }`}>
                    {kpis.trend.impressions === 'up' ? '↗️ Crescendo' : 
                     kpis.trend.impressions === 'down' ? '↘️ Declinando' : '→ Estável'}
                  </span>
                </li>
                <li>• CTR: 
                  <span className={`ml-1 ${
                    kpis.trend.ctr === 'up' ? 'text-success' : 
                    kpis.trend.ctr === 'down' ? 'text-destructive' : 'text-muted-foreground'
                  }`}>
                    {kpis.trend.ctr === 'up' ? '↗️ Melhorando' : 
                     kpis.trend.ctr === 'down' ? '↘️ Piorando' : '→ Estável'}
                  </span>
                </li>
                <li>• Custo: 
                  <span className={`ml-1 ${
                    kpis.trend.cost === 'up' ? 'text-warning' : 
                    kpis.trend.cost === 'down' ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {kpis.trend.cost === 'up' ? '↗️ Aumentando' : 
                     kpis.trend.cost === 'down' ? '↘️ Diminuindo' : '→ Estável'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights e Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle>Insights e Recomendações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getInsights().map((insight, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{insight}</p>
              </div>
            ))}
            
            <div className="mt-6 p-4 bg-gradient-subtle rounded-lg border-l-4 border-l-brand-red">
              <h4 className="font-semibold text-brand-red mb-2">Próximos Passos Sugeridos:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Analisar criativos com melhor CTR para replicar estratégia</li>
                <li>• Testar novas segmentações baseadas nos dados de alcance</li>
                <li>• Otimizar horários de veiculação com base nos picos de performance</li>
                <li>• Implementar testes A/B para melhorar taxa de conversão</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Componente de Metodologia */}
      <Methodology data={data} dateRange={dateRange} />
    </div>
  );
};