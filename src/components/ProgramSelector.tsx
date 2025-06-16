
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Dumbbell } from 'lucide-react';
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
        className="flex items-center gap-3 px-6 py-3 h-auto bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
      >
        <Dumbbell className="h-5 w-5 text-blue-600" />
        <div className="text-left">
          <div className="font-semibold text-gray-900 text-sm">{selectedProgram.name}</div>
          <div className="text-xs text-gray-500">{selectedProgram.goal}</div>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
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
          <div className="absolute top-full right-0 mt-3 w-80 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg mb-3">Välj träningsprogram</h3>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={!filterGoal ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterGoal('')}
                  className="text-xs font-medium rounded-lg"
                >
                  ALLA
                </Button>
                {goals.map(goal => (
                  <Button
                    key={goal}
                    variant={filterGoal === goal ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterGoal(filterGoal === goal ? '' : goal)}
                    className="text-xs font-medium rounded-lg"
                  >
                    {goal.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Programs List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredPrograms.map((program, index) => (
                <div
                  key={program.id}
                  className={`p-5 cursor-pointer transition-all duration-150 hover:bg-gray-50 ${
                    selectedProgram.id === program.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  } ${index !== filteredPrograms.length - 1 ? 'border-b border-gray-100' : ''}`}
                  onClick={() => {
                    onSelectProgram(program);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-gray-900 text-base">{program.name}</h4>
                    {selectedProgram.id === program.id && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <Badge variant="secondary" className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
                      {program.frequency}
                    </Badge>
                    <Badge variant="secondary" className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
                      {program.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-700 font-medium mb-1">{program.focus}</p>
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
