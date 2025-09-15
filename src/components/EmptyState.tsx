import { FileSpreadsheet, PieChart, BarChart } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="text-center space-y-12 px-4">
      {/* Hero Section */}
      <div className="space-y-6">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
          Transforme seus dados em
          <span className="text-red-600"> insights poderosos</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Faça upload dos seus dados de tráfego e receba automaticamente um relatório profissional 
          com KPIs, gráficos e análises estratégicas.
        </p>
      </div>
      
      {/* Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-50 rounded-lg mx-auto mb-6">
            <FileSpreadsheet className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Simples</h3>
          <p className="text-gray-600 leading-relaxed">
            Arraste seu arquivo CSV ou XLSX com dados de tráfego e deixe o sistema processar automaticamente.
          </p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-lg mx-auto mb-6">
            <PieChart className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Análise Automática</h3>
          <p className="text-gray-600 leading-relaxed">
            KPIs calculados automaticamente com visualizações interativas e insights estratégicos.
          </p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-50 rounded-lg mx-auto mb-6">
            <BarChart className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Relatório Premium</h3>
          <p className="text-gray-600 leading-relaxed">
            Exportação em PDF/PPTX com design profissional pronto para apresentação executiva.
          </p>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-gray-900 rounded-2xl p-8 lg:p-12 text-white max-w-4xl mx-auto">
        <div className="space-y-4 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold">
            Pronto para começar?
          </h3>
          <p className="text-gray-300 text-lg">
            Faça upload do seu arquivo abaixo e transforme seus dados em relatórios profissionais
          </p>
          <div className="pt-4">
            <span className="inline-flex items-center text-sm font-medium text-white bg-red-600 px-4 py-2 rounded-lg">
              100% Gratuito • Sem Cadastro • Processamento Instantâneo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};