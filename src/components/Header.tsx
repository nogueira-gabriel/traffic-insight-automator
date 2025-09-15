import { BarChart3, TrendingUp } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-lg shadow-md">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Traffic Insight Automator
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                Sistema Automático de Relatórios de Tráfego
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="hidden sm:flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            <BarChart3 className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-gray-700">Relatórios Profissionais</span>
          </div>
        </div>
      </div>
    </header>
  );
};