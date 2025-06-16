import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Star, 
  Clock, 
  ChefHat, 
  Search, 
  Filter, 
  Trash2, 
  Copy,
  Heart,
  TrendingUp,
  Calendar,
  BarChart3,
  Users,
  Target,
  ArrowRight,
  BookOpen,
  Utensils
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { 
  QuickMeal, 
  MealTemplate, 
  Meal,
  getQuickMeals, 
  saveQuickMeal, 
  deleteQuickMeal, 
  updateQuickMealUsage,
  getMealTemplates,
  saveMealTemplate,
  deleteMealTemplate,
  getMostUsedQuickMeals,
  getRecentlyUsedQuickMeals
} from '@/utils/localStorage';
import { v4 as uuidv4 } from 'uuid';

interface QuickMealsProps {
  onMealSelect: (meal: Meal) => void;
  onAddToPlanner?: (meal: Meal) => void;
  currentMeal?: Meal;
  showAddToPlanner?: boolean;
}

export const QuickMeals: React.FC<QuickMealsProps> = ({ 
  onMealSelect, 
  onAddToPlanner,
  currentMeal,
  showAddToPlanner = false
}) => {
  const [quickMeals, setQuickMeals] = useState<QuickMeal[]>([]);
  const [mealTemplates, setMealTemplates] = useState<MealTemplate[]>([]);
  const [filteredQuickMeals, setFilteredQuickMeals] = useState<QuickMeal[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<MealTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('quick');
  
  // Dialog states
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState<boolean>(false);
  const [saveType, setSaveType] = useState<'quick' | 'template'>('quick');
  const [saveName, setSaveName] = useState<string>('');
  const [saveDescription, setSaveDescription] = useState<string>('');
  const [saveCategory, setSaveCategory] = useState<string>('Frukost');
  const [saveTags, setSaveTags] = useState<string>('');
  const [savePrepTime, setSavePrepTime] = useState<number>(15);
  const [saveDifficulty, setSaveDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  
  const categories = ['Frukost', 'Lunch', 'Middag', 'Mellanmål', 'Pre-workout', 'Post-workout'];
  const difficulties = ['easy', 'medium', 'hard'];
  const difficultyLabels = { easy: 'Lätt', medium: 'Medel', hard: 'Svår' };
  
  useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    filterData();
  }, [searchQuery, selectedCategory, selectedDifficulty, quickMeals, mealTemplates]);
  
  const loadData = () => {
    setQuickMeals(getQuickMeals());
    setMealTemplates(getMealTemplates());
  };
  
  const filterData = () => {
    // Filtrera snabbmåltider
    let filtered = quickMeals.filter(meal => {
      const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (meal.tags && meal.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesCategory = selectedCategory === 'all' || meal.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || meal.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
    
    setFilteredQuickMeals(filtered);
    
    // Filtrera mallar
    let filteredTemps = mealTemplates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (template.tags && template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredTemplates(filteredTemps);
  };
  
  const handleSaveCurrentMeal = () => {
    if (!currentMeal || currentMeal.items.length === 0) {
      toast({
        title: "Ingen måltid att spara",
        description: "Lägg till livsmedel i din måltid först.",
        variant: "destructive"
      });
      return;
    }
    
    setSaveName(currentMeal.name || '');
    setIsSaveDialogOpen(true);
  };
  
  const handleSave = () => {
    if (!currentMeal || !saveName.trim()) {
      toast({
        title: "Fyll i alla obligatoriska fält",
        description: "Namn är obligatoriskt.",
        variant: "destructive"
      });
      return;
    }
    
    const tags = saveTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    if (saveType === 'quick') {
      const quickMeal: QuickMeal = {
        id: uuidv4(),
        name: saveName,
        items: currentMeal.items,
        nutrition: currentMeal.nutrition,
        category: saveCategory,
        prepTime: savePrepTime,
        difficulty: saveDifficulty,
        tags,
        createdAt: new Date().toISOString(),
        usageCount: 0
      };
      
      saveQuickMeal(quickMeal);
      setQuickMeals([...quickMeals, quickMeal]);
      
      toast({
        title: "Snabbmåltid sparad!",
        description: `"${saveName}" har sparats som snabbmåltid.`
      });
    } else {
      const template: MealTemplate = {
        id: uuidv4(),
        name: saveName,
        description: saveDescription,
        meal: currentMeal,
        category: saveCategory,
        tags,
        createdAt: new Date().toISOString(),
        usageCount: 0
      };
      
      saveMealTemplate(template);
      setMealTemplates([...mealTemplates, template]);
      
      toast({
        title: "Mall sparad!",
        description: `"${saveName}" har sparats som mall.`
      });
    }
    
    // Återställ formulär
    setSaveName('');
    setSaveDescription('');
    setSaveTags('');
    setSavePrepTime(15);
    setSaveDifficulty('easy');
    setIsSaveDialogOpen(false);
  };
  
  const handleSelectQuickMeal = (quickMeal: QuickMeal) => {
    const meal: Meal = {
      id: uuidv4(),
      name: quickMeal.name,
      items: quickMeal.items,
      nutrition: quickMeal.nutrition,
      category: quickMeal.category
    };
    
    updateQuickMealUsage(quickMeal.id);
    onMealSelect(meal);
    
    toast({
      title: "Måltid vald!",
      description: `"${quickMeal.name}" har valts för redigering.`
    });
    
    // Uppdatera data för att reflektera ändrad usageCount
    loadData();
  };

  const handleAddToPlannerQuickMeal = (quickMeal: QuickMeal) => {
    if (!onAddToPlanner) return;
    
    const meal: Meal = {
      id: uuidv4(),
      name: quickMeal.name,
      items: quickMeal.items,
      nutrition: quickMeal.nutrition,
      category: quickMeal.category
    };
    
    updateQuickMealUsage(quickMeal.id);
    onAddToPlanner(meal);
    
    toast({
      title: "Måltid tillagd!",
      description: `"${quickMeal.name}" har lagts till i din dagliga plan.`
    });
    
    // Uppdatera data för att reflektera ändrad usageCount
    loadData();
  };
  
  const handleSelectTemplate = (template: MealTemplate) => {
    const meal: Meal = {
      id: uuidv4(),
      name: template.name,
      items: template.meal.items,
      nutrition: template.meal.nutrition,
      category: template.category
    };
    
    onMealSelect(meal);
    
    toast({
      title: "Mall vald!",
      description: `"${template.name}" har valts för redigering.`
    });
  };

  const handleAddToPlannerTemplate = (template: MealTemplate) => {
    if (!onAddToPlanner) return;
    
    const meal: Meal = {
      id: uuidv4(),
      name: template.name,
      items: template.meal.items,
      nutrition: template.meal.nutrition,
      category: template.category
    };
    
    onAddToPlanner(meal);
    
    toast({
      title: "Mall tillagd!",
      description: `"${template.name}" har lagts till i din dagliga plan.`
    });
  };
  
  const handleDeleteQuickMeal = (id: string) => {
    deleteQuickMeal(id);
    setQuickMeals(quickMeals.filter(meal => meal.id !== id));
    toast({
      title: "Snabbmåltid borttagen",
      description: "Måltiden har tagits bort."
    });
  };
  
  const handleDeleteTemplate = (id: string) => {
    deleteMealTemplate(id);
    setMealTemplates(mealTemplates.filter(template => template.id !== id));
    toast({
      title: "Mall borttagen",
      description: "Mallen har tagits bort."
    });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE');
  };

  // Beräkna statistik
  const getStats = () => {
    const totalQuickMeals = quickMeals.length;
    const totalTemplates = mealTemplates.length;
    const totalUsage = quickMeals.reduce((sum, meal) => sum + meal.usageCount, 0);
    const mostUsedMeals = getMostUsedQuickMeals().slice(0, 3);
    const recentlyUsed = getRecentlyUsedQuickMeals().slice(0, 5);
    
    return {
      totalQuickMeals,
      totalTemplates,
      totalUsage,
      mostUsedMeals,
      recentlyUsed,
      avgUsage: totalQuickMeals > 0 ? Math.round(totalUsage / totalQuickMeals) : 0
    };
  };

  const stats = getStats();
  
  const renderQuickMealCard = (quickMeal: QuickMeal) => (
    <Card key={quickMeal.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{quickMeal.name}</CardTitle>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary">{quickMeal.category}</Badge>
              <Badge variant="outline" className="text-xs">
                {difficultyLabels[quickMeal.difficulty]}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSelectQuickMeal(quickMeal)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Copy className="h-4 w-4" />
            </Button>
            {showAddToPlanner && onAddToPlanner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddToPlannerQuickMeal(quickMeal)}
                className="text-green-600 hover:text-green-800"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteQuickMeal(quickMeal.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2 text-sm">
            <div className="text-center">
              <div className="font-medium">{quickMeal.nutrition.kcal}</div>
              <div className="text-xs text-muted-foreground">kcal</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{quickMeal.nutrition.protein}g</div>
              <div className="text-xs text-muted-foreground">protein</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{quickMeal.nutrition.carbs}g</div>
              <div className="text-xs text-muted-foreground">kolh</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{quickMeal.nutrition.fat}g</div>
              <div className="text-xs text-muted-foreground">fett</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{quickMeal.prepTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>{quickMeal.usageCount} ggr</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(quickMeal.createdAt)}</span>
            </div>
          </div>
          
          {quickMeal.tags && quickMeal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {quickMeal.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {showAddToPlanner && onAddToPlanner && (
            <Button 
              onClick={() => handleAddToPlannerQuickMeal(quickMeal)}
              className="w-full mt-2" 
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Lägg till i planeraren
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderTemplateCard = (template: MealTemplate) => (
    <Card key={template.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <Badge variant="secondary" className="mt-1">{template.category}</Badge>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSelectTemplate(template)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Copy className="h-4 w-4" />
            </Button>
            {showAddToPlanner && onAddToPlanner && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddToPlannerTemplate(template)}
                className="text-green-600 hover:text-green-800"
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteTemplate(template.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {template.description && (
            <p className="text-sm text-muted-foreground">{template.description}</p>
          )}
          
          <div className="grid grid-cols-4 gap-2 text-sm">
            <div className="text-center">
              <div className="font-medium">{template.meal.nutrition.kcal}</div>
              <div className="text-xs text-muted-foreground">kcal</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{template.meal.nutrition.protein}g</div>
              <div className="text-xs text-muted-foreground">protein</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{template.meal.nutrition.carbs}g</div>
              <div className="text-xs text-muted-foreground">kolh</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{template.meal.nutrition.fat}g</div>
              <div className="text-xs text-muted-foreground">fett</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(template.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>{template.usageCount} ggr</span>
            </div>
          </div>
          
          {template.tags && template.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {template.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {showAddToPlanner && onAddToPlanner && (
            <Button 
              onClick={() => handleAddToPlannerTemplate(template)}
              className="w-full mt-2" 
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Lägg till i planeraren
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Statistik sektion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Översikt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalQuickMeals}</div>
              <div className="text-sm text-muted-foreground">Snabbmåltider</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalTemplates}</div>
              <div className="text-sm text-muted-foreground">Mallar</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalUsage}</div>
              <div className="text-sm text-muted-foreground">Total användning</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.avgUsage}</div>
              <div className="text-sm text-muted-foreground">Snitt/måltid</div>
            </div>
          </div>
          
          {stats.mostUsedMeals.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Mest använda
              </h4>
              <div className="flex flex-wrap gap-2">
                {stats.mostUsedMeals.map(meal => (
                  <Badge key={meal.id} variant="secondary" className="cursor-pointer" onClick={() => handleSelectQuickMeal(meal)}>
                    {meal.name} ({meal.usageCount}x)
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Spara aktuell måltid */}
      {currentMeal && currentMeal.items.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Heart className="h-5 w-5" />
              Spara aktuell måltid
            </CardTitle>
            <CardDescription>
              Du har en måltid med {currentMeal.items.length} livsmedel som du kan spara som snabbmåltid eller mall.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 text-sm mb-4">
              <div className="text-center">
                <div className="font-medium">{currentMeal.nutrition.kcal}</div>
                <div className="text-xs text-muted-foreground">kcal</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{currentMeal.nutrition.protein}g</div>
                <div className="text-xs text-muted-foreground">protein</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{currentMeal.nutrition.carbs}g</div>
                <div className="text-xs text-muted-foreground">kolh</div>
              </div>
              <div className="text-center">
                <div className="font-medium">{currentMeal.nutrition.fat}g</div>
                <div className="text-xs text-muted-foreground">fett</div>
              </div>
            </div>
            <Button onClick={handleSaveCurrentMeal} className="w-full">
              <Heart className="h-4 w-4 mr-2" />
              Spara måltid
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sök och filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Sök måltider och mallar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla kategorier</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Svårighet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla</SelectItem>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficultyLabels[difficulty]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flikar för snabbmåltider och mallar */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quick" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Snabbmåltider ({filteredQuickMeals.length})
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Mallar ({filteredTemplates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="space-y-4">
          {filteredQuickMeals.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Inga snabbmåltider hittades.</p>
                  <p className="text-sm">Skapa en måltid och spara den som snabbmåltid!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuickMeals.map(renderQuickMealCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          {filteredTemplates.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Inga mallar hittades.</p>
                  <p className="text-sm">Skapa en måltid och spara den som mall!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(renderTemplateCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Spara dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Spara måltid</DialogTitle>
            <DialogDescription>
              Spara din måltid som en snabbmåltid eller mall för framtida användning.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={saveType === 'quick' ? 'default' : 'outline'}
                onClick={() => setSaveType('quick')}
                className="flex items-center gap-2"
              >
                <Utensils className="h-4 w-4" />
                Snabbmåltid
              </Button>
              <Button
                variant={saveType === 'template' ? 'default' : 'outline'}
                onClick={() => setSaveType('template')}
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Mall
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="saveName">Namn *</Label>
              <Input
                id="saveName"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="t.ex. Proteinrik frukost"
              />
            </div>
            
            {saveType === 'template' && (
              <div className="space-y-2">
                <Label htmlFor="saveDescription">Beskrivning</Label>
                <Textarea
                  id="saveDescription"
                  value={saveDescription}
                  onChange={(e) => setSaveDescription(e.target.value)}
                  placeholder="Beskriv mallen..."
                  rows={2}
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="saveCategory">Kategori</Label>
                <Select value={saveCategory} onValueChange={setSaveCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {saveType === 'quick' && (
                <div className="space-y-2">
                  <Label htmlFor="saveDifficulty">Svårighet</Label>
                                     <Select value={saveDifficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setSaveDifficulty(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map(difficulty => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficultyLabels[difficulty]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            {saveType === 'quick' && (
              <div className="space-y-2">
                <Label htmlFor="savePrepTime">Beredningstid (minuter)</Label>
                <Input
                  id="savePrepTime"
                  type="number"
                  value={savePrepTime}
                  onChange={(e) => setSavePrepTime(parseInt(e.target.value) || 15)}
                  min={1}
                  max={120}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="saveTags">Taggar (kommaseparerade)</Label>
              <Input
                id="saveTags"
                value={saveTags}
                onChange={(e) => setSaveTags(e.target.value)}
                placeholder="t.ex. protein, snabb, hälsosam"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              Avbryt
            </Button>
            <Button onClick={handleSave}>
              Spara {saveType === 'quick' ? 'snabbmåltid' : 'mall'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 