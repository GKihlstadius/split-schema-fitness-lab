import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getSavedMealPlans, deleteMealPlan, SavedMealPlan } from '@/utils/localStorage';
import { Progress } from '@/components/ui/progress';
import { Trash2, Calendar, ArrowRight } from 'lucide-react';

interface SavedMealPlansProps {
  onLoadPlan: (plan: SavedMealPlan) => void;
}

export const SavedMealPlans: React.FC<SavedMealPlansProps> = ({ onLoadPlan }) => {
  const [savedPlans, setSavedPlans] = useState<SavedMealPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SavedMealPlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Hämta sparade planer när komponenten laddas
    const plans = getSavedMealPlans();
    setSavedPlans(plans);
  }, []);

  const handleDelete = (id: string) => {
    deleteMealPlan(id);
    setSavedPlans(prevPlans => prevPlans.filter(plan => plan.id !== id));
  };

  const handleLoadPlan = (plan: SavedMealPlan) => {
    onLoadPlan(plan);
    setIsDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'd MMMM yyyy', { locale: sv });
    } catch (error) {
      return dateString;
    }
  };

  // Beräkna procentandel av målen för en plan
  const calculatePercentage = (value: number, target: number) => {
    if (target <= 0) return 0;
    return Math.min((value / target) * 100, 100);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Calendar className="mr-2 h-4 w-4" />
          Visa sparade måltidsplaner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Sparade måltidsplaner</DialogTitle>
          <DialogDescription>
            Välj en sparad måltidsplan för att ladda in den.
          </DialogDescription>
        </DialogHeader>
        
        {savedPlans.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            Inga sparade måltidsplaner hittades.
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {savedPlans.map(plan => (
                <Card key={plan.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{plan.name}</CardTitle>
                      <span className="text-sm text-muted-foreground">{formatDate(plan.date)}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Kalorier:</span>
                          <span>{plan.totals.kcal} / {plan.targetKcal} kcal</span>
                        </div>
                        <Progress value={calculatePercentage(plan.totals.kcal, plan.targetKcal)} className="h-1.5" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="flex justify-between">
                            <span>Protein:</span>
                            <span>{plan.totals.protein}g</span>
                          </div>
                          <Progress value={calculatePercentage(plan.totals.protein, plan.targetProtein)} className="h-1" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between">
                            <span>Kolh:</span>
                            <span>{plan.totals.carbs}g</span>
                          </div>
                          <Progress value={calculatePercentage(plan.totals.carbs, plan.targetCarbs)} className="h-1" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between">
                            <span>Fett:</span>
                            <span>{plan.totals.fat}g</span>
                          </div>
                          <Progress value={calculatePercentage(plan.totals.fat, plan.targetFat)} className="h-1" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(plan.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Ta bort
                      </Button>
                      
                      <Button 
                        size="sm"
                        onClick={() => handleLoadPlan(plan)}
                      >
                        Ladda plan
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}; 