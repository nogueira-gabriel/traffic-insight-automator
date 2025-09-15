import { useState } from "react";
import { Download, RefreshCw, Calendar, TrendingUp, Globe, Clock, BarChart3, Target, Users, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KPIGrid from "@/components/KPIGrid";
import { ChartSection } from "@/components/ChartSection";
import { ReportPreview } from "@/components/ReportPreview";
import { DateRangePicker } from "@/components/DateRangePicker";
import { TemporalAnalysis } from "@/components/TemporalAnalysis";
import { ExecutiveDashboard } from "@/components/ExecutiveDashboard";
import { GeographicAnalysis } from "@/components/GeographicAnalysis";
import { GoalTracking } from "@/components/GoalTracking";
import { AdvancedSegmentation } from "@/components/AdvancedSegmentation";
import { ROIAttribution } from "@/components/ROIAttribution";
import { AdvancedCharts } from "@/components/AdvancedCharts";
import { TrafficData } from "@/pages/Index";
import { calculateKPIs } from "@/lib/kpiCalculations";
import { isWithinInterval, parseISO } from 'date-fns';

interface ReportDashboardProps {
  data: TrafficData[];
  onReset: () => void;
}

export const ReportDashboard = ({ data, onReset }: ReportDashboardProps) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'executive' | 'temporal' | 'geographic' | 'goals' | 'segmentation' | 'attribution' | 'charts' | 'preview'>('dashboard');
  const [filteredData, setFilteredData] = useState<TrafficData[]>(data);
  
  const kpis = calculateKPIs(filteredData);
  
  const dateRange = filteredData.length > 0 ? {
    start: new Date(filteredData[0].date).toLocaleDateString('pt-BR'),
    end: new Date(filteredData[filteredData.length - 1].date).toLocaleDateString('pt-BR')
  } : null;

  // Get available dates for the date picker
  const availableDates = data.map(row => parseISO(row.date));

  // Handle date range change
  const handleDateRangeChange = (range: { start: Date; end: Date; label: string }) => {
    const filtered = data.filter(row => {
      const rowDate = parseISO(row.date);
      return isWithinInterval(rowDate, { start: range.start, end: range.end });
    });
    setFilteredData(filtered);
  };

  return (
    <div className="space-y-8" data-dashboard>
      {/* Menu de Navegação no Topo */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              variant={activeView === 'dashboard' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('dashboard')}
              className={`text-sm ${activeView === 'dashboard' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeView === 'executive' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('executive')}
              className={`text-sm ${activeView === 'executive' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Target className="w-4 h-4 mr-2" />
              Executivo
            </Button>
            <Button
              variant={activeView === 'temporal' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('temporal')}
              className={`text-sm ${activeView === 'temporal' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Clock className="w-4 h-4 mr-2" />
              Temporal
            </Button>
            <Button
              variant={activeView === 'geographic' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('geographic')}
              className={`text-sm ${activeView === 'geographic' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Globe className="w-4 h-4 mr-2" />
              Geográfico
            </Button>
            <Button
              variant={activeView === 'goals' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('goals')}
              className={`text-sm ${activeView === 'goals' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Target className="w-4 h-4 mr-2" />
              Metas
            </Button>
            <Button
              variant={activeView === 'segmentation' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('segmentation')}
              className={`text-sm ${activeView === 'segmentation' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Users className="w-4 h-4 mr-2" />
              Segmentação
            </Button>
            <Button
              variant={activeView === 'attribution' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('attribution')}
              className={`text-sm ${activeView === 'attribution' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Link className="w-4 h-4 mr-2" />
              Atribuição
            </Button>
            <Button
              variant={activeView === 'charts' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('charts')}
              className={`text-sm ${activeView === 'charts' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Gráficos
            </Button>
            <Button
              variant={activeView === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('preview')}
              className={`text-sm ${activeView === 'preview' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Header do Dashboard */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 w-full lg:w-auto">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Relatório de Tráfego Digital</h1>
            {dateRange && (
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-red-600" />
                  <span className="text-lg font-medium">
                    Período: {dateRange.start} - {dateRange.end}
                  </span>
                </div>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 w-fit">
                  {filteredData.length} registros
                </span>
              </div>
            )}
            
            {/* Date Range Picker */}
            <div className="w-full sm:w-auto">
              <DateRangePicker 
                onRangeChange={handleDateRangeChange}
                availableDates={availableDates}
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <Button 
              variant="outline" 
              onClick={onReset}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm px-4 py-2"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Novo Arquivo
            </Button>
          </div>
        </div>
      </div>

      {activeView === 'dashboard' ? (
        <div className="space-y-6 lg:space-y-8">
          {/* KPIs Principais */}
          <KPIGrid kpis={kpis} />
          
          {/* Gráficos e Análises */}
          <ChartSection data={filteredData} />
          
          {/* Informações do Dataset */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Resumo do Dataset</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <span className="text-sm text-gray-600 font-medium">Total de Registros</span>
                <div className="text-2xl font-bold text-gray-900">{filteredData.length}</div>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-gray-600 font-medium">Período Total</span>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.ceil((new Date(filteredData[filteredData.length - 1].date).getTime() - new Date(filteredData[0].date).getTime()) / (1000 * 60 * 60 * 24))} dias
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-gray-600 font-medium">Impressões/Dia</span>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(kpis.totalImpressions / filteredData.length).toLocaleString('pt-BR')}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-gray-600 font-medium">Custo Médio/Dia</span>
                <div className="text-2xl font-bold text-red-600">
                  R$ {(kpis.totalCost / filteredData.length).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeView === 'executive' ? (
        <ExecutiveDashboard data={filteredData} kpis={kpis} />
      ) : activeView === 'temporal' ? (
        <TemporalAnalysis data={filteredData} />
      ) : activeView === 'geographic' ? (
        <GeographicAnalysis data={filteredData} />
      ) : activeView === 'goals' ? (
        <GoalTracking data={filteredData} kpis={kpis} />
      ) : activeView === 'segmentation' ? (
        <AdvancedSegmentation data={filteredData} />
      ) : activeView === 'attribution' ? (
        <ROIAttribution data={filteredData} />
      ) : activeView === 'charts' ? (
        <AdvancedCharts data={filteredData} />
      ) : (
        <ReportPreview data={filteredData} kpis={kpis} />
      )}
    </div>
  );
};