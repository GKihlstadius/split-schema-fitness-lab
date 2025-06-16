import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import NutritionHub from "./pages/NutritionHub";
import Workout from "./pages/Workout";
import WorkoutDetails from "./pages/WorkoutDetails";
import { Toaster } from "./components/ui/toaster";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/nutrition" element={<NutritionHub />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/workout/:day" element={<WorkoutDetails />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
