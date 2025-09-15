import React, { useState } from 'react';
import { Calendar, ChevronDown, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DateRange {
  start: Date;
  end: Date;
  label: string;
}

interface DateRangePickerProps {
  onRangeChange: (range: DateRange) => void;
  availableDates: Date[];
  currentRange?: DateRange;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onRangeChange,
  availableDates,
  currentRange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(currentRange || null);

  // Predefined ranges
  const predefinedRanges = [
    {
      label: 'Últimos 7 dias',
      getValue: () => ({
        start: subDays(new Date(), 7),
        end: new Date(),
        label: 'Últimos 7 dias'
      })
    },
    {
      label: 'Últimos 30 dias',
      getValue: () => ({
        start: subDays(new Date(), 30),
        end: new Date(),
        label: 'Últimos 30 dias'
      })
    },
    {
      label: 'Esta semana',
      getValue: () => ({
        start: startOfWeek(new Date(), { weekStartsOn: 1 }),
        end: endOfWeek(new Date(), { weekStartsOn: 1 }),
        label: 'Esta semana'
      })
    },
    {
      label: 'Este mês',
      getValue: () => ({
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date()),
        label: 'Este mês'
      })
    },
    {
      label: 'Período completo',
      getValue: () => {
        if (availableDates.length === 0) return null;
        const sortedDates = [...availableDates].sort((a, b) => a.getTime() - b.getTime());
        return {
          start: sortedDates[0],
          end: sortedDates[sortedDates.length - 1],
          label: 'Período completo'
        };
      }
    }
  ];

  const handleRangeSelect = (rangeGetter: () => DateRange | null) => {
    const range = rangeGetter();
    if (range) {
      setSelectedRange(range);
      onRangeChange(range);
      setIsOpen(false);
    }
  };

  const handleClearFilter = () => {
    setSelectedRange(null);
    // Return full range
    if (availableDates.length > 0) {
      const sortedDates = [...availableDates].sort((a, b) => a.getTime() - b.getTime());
      const fullRange = {
        start: sortedDates[0],
        end: sortedDates[sortedDates.length - 1],
        label: 'Todos os dados'
      };
      onRangeChange(fullRange);
    }
  };

  const formatDateRange = (range: DateRange) => {
    return `${format(range.start, 'dd/MM/yyyy', { locale: ptBR })} - ${format(range.end, 'dd/MM/yyyy', { locale: ptBR })}`;
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="h-10 px-4 border-gray-300 hover:bg-gray-50 text-gray-700"
          >
            <Calendar className="w-4 h-4 mr-2 text-[#D21B1B]" />
            {selectedRange ? selectedRange.label : 'Selecionar período'}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">Período de Análise</h4>
                  <Filter className="w-4 h-4 text-gray-500" />
                </div>
                
                <div className="space-y-2">
                  {predefinedRanges.map((range, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRangeSelect(range.getValue)}
                      className="w-full justify-start text-left hover:bg-gray-50 text-gray-700"
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>

                {selectedRange && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-600 mb-2">Período selecionado:</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatDateRange(selectedRange)}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>

      {selectedRange && (
        <Badge 
          variant="secondary" 
          className="bg-[#D21B1B]/10 text-[#D21B1B] border-[#D21B1B]/20 hover:bg-[#D21B1B]/20"
        >
          {selectedRange.label}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilter}
            className="ml-1 h-auto p-0 hover:bg-transparent"
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      )}

      {availableDates.length > 0 && (
        <div className="text-xs text-gray-500">
          Dados disponíveis: {availableDates.length} registros
        </div>
      )}
    </div>
  );
};