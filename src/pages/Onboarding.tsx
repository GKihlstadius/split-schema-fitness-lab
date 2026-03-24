import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, TrendingDown, Zap, Heart, MapPin, ChevronLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { workoutPrograms } from '@/data/workoutPrograms';
import { saveCurrentLocationAsGym } from '@/utils/geolocation';
import { getCurrentUser, saveUserSetting, saveWorkoutProgram } from '@/utils/supabaseAuth';

const GOALS = [
  { id: 'build-muscle', label: 'Bygga muskler', icon: Dumbbell },
  { id: 'lose-weight', label: 'Gå ner i vikt', icon: TrendingDown },
  { id: 'get-stronger', label: 'Bli starkare', icon: Zap },
  { id: 'improve-health', label: 'Förbättra hälsan', icon: Heart },
] as const;

const TOTAL_STEPS = 4;

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [gymName, setGymName] = useState('');
  const [savingGym, setSavingGym] = useState(false);
  const [gymSaved, setGymSaved] = useState(false);

  const popularPrograms = workoutPrograms.slice(0, 5);

  const completeOnboarding = async () => {
    localStorage.setItem('gymquest-onboarding-complete', 'true');

    if (selectedGoal) {
      localStorage.setItem('gymquest-onboarding-goal', selectedGoal);
    }

    try {
      const result = await getCurrentUser();
      if (result.success && result.user) {
        if (selectedGoal) {
          await saveUserSetting(result.user.id, 'goal', selectedGoal);
        }
        if (selectedProgramId) {
          const program = workoutPrograms.find((p) => p.id === selectedProgramId);
          if (program) {
            await saveUserSetting(result.user.id, 'selectedWorkoutProgram', program.id);
            await saveWorkoutProgram(result.user.id, program.id, program.name);
          }
        }
      }
    } catch (e) {
      console.error('Could not persist onboarding to backend:', e);
    }

    navigate('/');
  };

  const next = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSaveGym = async () => {
    if (!gymName.trim()) return;
    setSavingGym(true);
    try {
      await saveCurrentLocationAsGym(gymName.trim());
      setGymSaved(true);
    } catch (e) {
      console.error('Could not save gym location:', e);
    } finally {
      setSavingGym(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden">
      {/* Header: back + dots */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div className="w-10">
          {step > 0 && (
            <button
              onClick={back}
              className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? 'w-8 bg-gray-900'
                  : i < step
                    ? 'w-2 bg-gray-900/60'
                    : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div className="w-10">
          {step > 0 && step < TOTAL_STEPS - 1 && (
            <button
              onClick={completeOnboarding}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Hoppa över
            </button>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        <div key={step} className="animate-slide-up px-6 pb-10">
          {/* -------- Step 1: Welcome -------- */}
          {step === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] text-center gap-8">
              {/* Logo */}
              <div className="w-28 h-28 rounded-full bg-gray-900 flex items-center justify-center shadow-sm">
                <Dumbbell className="w-14 h-14 text-white" />
              </div>

              <div className="space-y-4 max-w-sm">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Välkommen till GymQuest
                </h1>
                <p className="text-gray-500 text-lg leading-relaxed">
                  Din personliga gym-companion med XP, achievements och smarta
                  träningsprogram
                </p>
              </div>

              <Button
                onClick={next}
                className="w-full max-w-sm bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-14 text-lg font-semibold"
              >
                Kom igång
              </Button>
            </div>
          )}

          {/* -------- Step 2: Choose Goal -------- */}
          {step === 1 && (
            <div className="flex flex-col min-h-[calc(100vh-140px)]">
              <div className="pt-8 pb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900">Vad är ditt mål?</h1>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4 content-start">
                {GOALS.map((goal) => {
                  const Icon = goal.icon;
                  const selected = selectedGoal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all duration-200 ${
                        selected
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-gray-100 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 ${selected ? 'text-emerald-600' : 'text-gray-400'}`}
                      />
                      <span
                        className={`text-sm font-medium ${selected ? 'text-gray-900' : 'text-gray-500'}`}
                      >
                        {goal.label}
                      </span>
                      {selected && (
                        <div className="absolute top-3 right-3">
                          <Check className="w-4 h-4 text-emerald-600" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-6 pb-4">
                <Button
                  onClick={next}
                  disabled={!selectedGoal}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-14 text-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Nästa
                </Button>
              </div>
            </div>
          )}

          {/* -------- Step 3: Choose Program -------- */}
          {step === 2 && (
            <div className="flex flex-col min-h-[calc(100vh-140px)]">
              <div className="pt-8 pb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Välj ett träningsprogram
                </h1>
              </div>

              <div className="flex-1 space-y-3">
                {popularPrograms.map((program) => {
                  const selected = selectedProgramId === program.id;
                  return (
                    <button
                      key={program.id}
                      onClick={() => setSelectedProgramId(program.id)}
                      className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 ${
                        selected
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-gray-100 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-gray-900 font-semibold text-base pr-2">
                          {program.name}
                        </h3>
                        {selected && <Check className="w-5 h-5 text-emerald-600 shrink-0" />}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-500 font-medium">
                          {program.frequency}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-400 font-medium">
                          {program.difficulty}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-400">
                          {program.focus}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-6 pb-4">
                <Button
                  onClick={next}
                  disabled={!selectedProgramId}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-14 text-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Nästa
                </Button>
              </div>
            </div>
          )}

          {/* -------- Step 4: Save Gym -------- */}
          {step === 3 && (
            <div className="flex flex-col items-center min-h-[calc(100vh-140px)]">
              <div className="pt-8 pb-6 text-center space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Spara ditt gym</h1>
                <p className="text-gray-400 text-base">
                  Checka in när du är på gymmet och tjäna XP
                </p>
              </div>

              <div className="flex-1 flex flex-col items-center gap-8 w-full max-w-sm">
                <div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-emerald-600" />
                </div>

                <div className="w-full space-y-4">
                  <Input
                    type="text"
                    placeholder="Namn på ditt gym"
                    value={gymName}
                    onChange={(e) => setGymName(e.target.value)}
                    className="h-14 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl text-base px-4"
                  />

                  <Button
                    onClick={handleSaveGym}
                    disabled={!gymName.trim() || savingGym || gymSaved}
                    className={`w-full rounded-xl h-14 text-base font-semibold transition-all ${
                      gymSaved
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {gymSaved ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-5 h-5" /> Gym sparat!
                      </span>
                    ) : savingGym ? (
                      'Sparar...'
                    ) : (
                      <span className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" /> Spara min position
                      </span>
                    )}
                  </Button>
                </div>

                <button
                  onClick={completeOnboarding}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
                >
                  Hoppa över
                </button>
              </div>

              <div className="w-full pt-6 pb-4">
                <Button
                  onClick={completeOnboarding}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-14 text-lg font-semibold"
                >
                  Klar!
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
