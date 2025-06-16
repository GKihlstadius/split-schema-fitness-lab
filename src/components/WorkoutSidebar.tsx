import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, Calendar, Dumbbell, BarChart2 } from 'lucide-react';
import { WorkoutProgram } from '@/types/workout';

interface WorkoutSidebarProps {
  programs: WorkoutProgram[];
  selectedProgram: WorkoutProgram;
  onSelectProgram: (program: WorkoutProgram) => void;
}

export const WorkoutSidebar: React.FC<WorkoutSidebarProps> = ({
  programs,
  selectedProgram,
  onSelectProgram
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [filterGoal, setFilterGoal] = useState<string>('');

  const filteredPrograms = programs.filter(program => 
    !filterGoal || program.goal.toLowerCase().includes(filterGoal.toLowerCase())
  );

  const goals = [...new Set(programs.map(p => p.goal))];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <span className="font-semibold text-gray-900">Workout Programs</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isCollapsed ? '-translate-x-full' : 'translate-x-0'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Programs</h2>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={!filterGoal ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterGoal('')}
              className="text-xs"
            >
              ALL
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
        <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                selectedProgram.id === program.id
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => onSelectProgram(program)}
            >
              <h3 className="font-semibold text-gray-900 mb-3">{program.name}</h3>
              
              <div className="flex gap-2 mb-3">
                <Badge variant="outline" className="text-xs">
                  {program.frequency}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {program.difficulty}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{program.focus}</p>
              <p className="text-xs text-gray-500">{program.goal}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 p-4 border-t">
          <Button variant="ghost" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Veckoöversikt
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            Dagens Pass
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Statistik
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
};
