import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ColumnMappingProps {
  availableColumns: string[];
  onMappingComplete: (mapping: Record<string, string>) => void;
  onCancel: () => void;
}

const requiredFields = [
  { key: 'date', label: 'Data', required: true },
  { key: 'impressions', label: 'Impressões', required: true },
  { key: 'clicks', label: 'Cliques no Link', required: true },
  { key: 'cost', label: 'Total Investido', required: true },
];

const optionalFields = [
  { key: 'conversions', label: 'Leads/Conversas/Resultados' },
  { key: 'reach', label: 'Alcance' },
  { key: 'leads', label: 'Conversas Iniciadas' },
  { key: 'revenue', label: 'Receita' },
  { key: 'campaignname', label: 'Nome da Campanha' },
];

export const ColumnMapping = ({ availableColumns, onMappingComplete, onCancel }: ColumnMappingProps) => {
  const [mapping, setMapping] = useState<Record<string, string>>({});
  
  const handleMapping = (fieldKey: string, columnName: string) => {
    setMapping(prev => ({
      ...prev,
      [fieldKey]: columnName
    }));
  };

  const handleContinue = () => {
    onMappingComplete(mapping);
  };

  const isValid = requiredFields.every(field => mapping[field.key]);

  return (
    <div className="space-y-8">
      <Alert className="border-l-4 border-l-red-600 bg-red-50 border-red-200 rounded-xl">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <AlertDescription className="text-gray-700">
          <strong>Mapeamento Manual Necessário:</strong> Não foi possível detectar automaticamente todas as colunas necessárias. 
          Por favor, mapeie as colunas do seu arquivo abaixo para prosseguir com a análise.
        </AlertDescription>
      </Alert>

      <div className="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-sm">
        <div className="flex items-center space-x-3 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Mapeamento de Colunas</h2>
          <ArrowRight className="w-6 h-6 text-red-600" />
        </div>

        <div className="space-y-8">
          {/* Campos Obrigatórios */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-semibold text-gray-900">Campos Obrigatórios</h3>
              <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full font-medium">
                Necessários
              </span>
            </div>
            
            {requiredFields.map((field) => (
              <div key={field.key} className="flex items-center justify-between space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <span className="text-sm font-medium text-gray-900 min-w-[150px]">{field.label}</span>
                  <span className="text-red-600 font-bold">*</span>
                </div>
                <div className="min-w-0 flex-1 max-w-[250px]">
                  <Select onValueChange={(value) => handleMapping(field.key, value)}>
                    <SelectTrigger className="border-gray-300 focus:border-red-600 focus:ring-red-600">
                      <SelectValue placeholder="Selecione a coluna..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableColumns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {mapping[field.key] && (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Campos Opcionais */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-semibold text-gray-900">Campos Opcionais</h3>
              <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full font-medium">
                Melhora a análise
              </span>
            </div>
            
            {optionalFields.map((field) => (
              <div key={field.key} className="flex items-center justify-between space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <span className="text-sm text-gray-700 min-w-[150px]">{field.label}</span>
                </div>
                <div className="min-w-0 flex-1 max-w-[250px]">
                  <Select onValueChange={(value) => handleMapping(field.key, value)}>
                    <SelectTrigger className="border-gray-300 focus:border-red-600 focus:ring-red-600">
                      <SelectValue placeholder="Selecione (opcional)..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none" className="text-gray-500 italic">
                        Não usar este campo
                      </SelectItem>
                      {availableColumns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {mapping[field.key] && mapping[field.key] !== 'none' && (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Colunas Disponíveis */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Colunas disponíveis no seu arquivo</h4>
              <span className="text-sm bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                {availableColumns.length} colunas
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableColumns.map((column) => (
                <span 
                  key={column} 
                  className="px-3 py-2 bg-white rounded-md text-sm font-mono border border-gray-300 shadow-sm hover:shadow-md transition-shadow"
                >
                  {column}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              💡 Dica: Escolha as colunas que melhor correspondem aos campos listados acima
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 px-6 py-2"
        >
          ← Voltar
        </Button>
        <div className="flex items-center space-x-4">
          {!isValid && (
            <p className="text-sm text-gray-500">
              Complete todos os campos obrigatórios para continuar
            </p>
          )}
          <Button 
            onClick={handleContinue} 
            disabled={!isValid}
            className={`px-6 py-2 font-semibold transition-all ${
              isValid 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Gerar Relatório →
          </Button>
        </div>
      </div>
    </div>
  );
};