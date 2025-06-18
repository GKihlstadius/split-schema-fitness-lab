import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';
import { WorkoutProgram } from '@/types/workout';

interface ProgramSelectorProps {
  programs: WorkoutProgram[];
  selectedProgram: WorkoutProgram;
  onSelectProgram: (program: WorkoutProgram) => void;
}

export const ProgramSelector: React.FC<ProgramSelectorProps> = ({
  programs,
  selectedProgram,
  onSelectProgram
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterGoal, setFilterGoal] = useState<string>('');

  const filteredPrograms = programs.filter(program => 
    !filterGoal || program.goal.toLowerCase().includes(filterGoal.toLowerCase())
  );

  const goals = [...new Set(programs.map(p => p.goal))];

  return (
    <div className="relative">
      {/* Program Selector Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-4 py-3 h-auto min-w-[280px] border-gray-200 hover:bg-gray-50 text-gray-900 font-light"
      >
        <div className="text-left flex-1">
          <div className="font-medium">{selectedProgram.name}</div>
          <div className="text-xs text-gray-500 mt-0.5">Välj träningsprogram</div>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 md:left-auto md:right-0 md:transform-none mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-gray-100 rounded-lg shadow-sm z-50 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-50">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={!filterGoal ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilterGoal('')}
                  className="text-xs font-light px-3 py-1 h-auto bg-gray-900 hover:bg-gray-800 text-white"
                >
                  Alla
                </Button>
                {goals.map(goal => (
                  <Button
                    key={goal}
                    variant={filterGoal === goal ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilterGoal(filterGoal === goal ? '' : goal)}
                    className="text-xs font-light px-3 py-1 h-auto"
                  >
                    {goal}
                  </Button>
                ))}
              </div>
            </div>

            {/* Programs List */}
            <div className="max-h-80 overflow-y-auto">
              {filteredPrograms.map((program, index) => (
                <div
                  key={program.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-25 ${
                    selectedProgram.id === program.id ? 'bg-gray-25' : ''
                  }`}
                  onClick={() => {
                    onSelectProgram(program);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-light text-gray-900">{program.name}</h4>
                    {selectedProgram.id === program.id && (
                      <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs font-light px-2 py-0.5 bg-gray-50 text-gray-600 border-0">
                      {program.frequency}
                    </Badge>
                    <Badge variant="secondary" className="text-xs font-light px-2 py-0.5 bg-gray-50 text-gray-600 border-0">
                      {program.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-500 font-light">{program.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
