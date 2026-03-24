import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Check } from 'lucide-react';
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
        className="flex items-center justify-between gap-2 px-4 py-3 h-auto min-w-[280px] border-border bg-card hover:bg-muted text-foreground font-light shadow-sm"
      >
        <div className="text-left flex-1">
          <div className="font-medium">{selectedProgram.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Välj träningsprogram</div>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 md:left-auto md:right-0 md:transform-none mt-2 w-80 max-w-[calc(100vw-2rem)] bg-card border border-border rounded-2xl shadow-lg z-50 overflow-hidden">
            {/* Filter chips */}
            <div className="px-4 py-3 border-b border-border">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={!filterGoal ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilterGoal('')}
                  className={`text-xs font-light px-3 py-1 h-auto rounded-full ${
                    !filterGoal
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  Alla
                </Button>
                {goals.map(goal => (
                  <Button
                    key={goal}
                    variant={filterGoal === goal ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilterGoal(filterGoal === goal ? '' : goal)}
                    className={`text-xs font-light px-3 py-1 h-auto rounded-full ${
                      filterGoal === goal
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    {goal}
                  </Button>
                ))}
              </div>
            </div>

            {/* Programs List */}
            <div className="max-h-80 overflow-y-auto">
              {filteredPrograms.map((program) => (
                <div
                  key={program.id}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:bg-muted ${
                    selectedProgram.id === program.id ? 'bg-primary/10 border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'
                  }`}
                  onClick={() => {
                    onSelectProgram(program);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-foreground text-sm">{program.name}</h4>
                    {selectedProgram.id === program.id && (
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex gap-2 mb-1.5">
                    <Badge variant="secondary" className="text-[10px] font-light px-2 py-0.5 bg-secondary text-muted-foreground border-0 rounded-full">
                      {program.frequency}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] font-light px-2 py-0.5 bg-secondary text-muted-foreground border-0 rounded-full">
                      {program.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-light">{program.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
