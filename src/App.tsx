import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import NutritionHub from "./pages/NutritionHub";
import WorkoutDetails from "./pages/WorkoutDetails";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AuthCallback from "./pages/AuthCallback";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/nutrition" element={
              <ProtectedRoute>
                <NutritionHub />
              </ProtectedRoute>
            } />
            <Route path="/workout/:day" element={
              <ProtectedRoute>
                <WorkoutDetails />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
