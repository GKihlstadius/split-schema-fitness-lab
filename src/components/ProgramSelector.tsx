
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
        className="w-full sm:w-auto flex items-center justify-between gap-3 p-4 h-auto"
      >
        <div className="text-left">
          <div className="font-semibold text-gray-900">{selectedProgram.name}</div>
          <div className="text-sm text-gray-500">{selectedProgram.goal}</div>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
          <div className="absolute top-full left-0 right-0 sm:right-auto sm:w-96 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {/* Filter */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Välj träningsprogram</h3>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={!filterGoal ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterGoal('')}
                  className="text-xs"
                >
                  ALLA
                </Button>
                {goals.map(goal => (
                  <Button
                    key={goal}
                    variant={filterGoal === goal ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterGoal(filterGoal === goal ? '' : goal)}
                    className="text-xs"
                  >
                    {goal.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Programs List */}
            <div className="max-h-80 overflow-y-auto">
              {filteredPrograms.map((program) => (
                <div
                  key={program.id}
                  className={`p-4 cursor-pointer transition-all hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                    selectedProgram.id === program.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    onSelectProgram(program);
                    setIsOpen(false);
                  }}
                >
                  <h4 className="font-semibold text-gray-900 mb-2">{program.name}</h4>
                  
                  <div className="flex gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {program.frequency}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {program.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">{program.focus}</p>
                  <p className="text-xs text-gray-500">{program.goal}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
