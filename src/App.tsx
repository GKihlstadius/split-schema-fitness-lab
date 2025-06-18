import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import Index from "./pages/Index";
import NutritionHub from "./pages/NutritionHub";
import WorkoutDetails from "./pages/WorkoutDetails";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AuthCallback from "./pages/AuthCallback";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DirectAuth from "./pages/DirectAuth";
import EmailConfirmation from "./pages/EmailConfirmation";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Komponent för att hantera auth hash redirect
const AuthHashHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Kontrollera om vi har auth tokens i hash på hem-sidan
    if (location.pathname === '/' && location.hash.includes('access_token')) {
      console.log('🔄 Hittade auth tokens på hem-sidan, omdirigerar till auth callback');
      // Omdirigera till auth callback med hash
      navigate('/auth/callback' + location.hash, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <BrowserRouter>
          <AuthHashHandler />
          <Routes>
            {/* Publika routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/email-confirmation" element={<EmailConfirmation />} />
            
            {/* Skyddade routes */}
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
            
            {/* Catch-all route för auth */}
            <Route path="/auth/*" element={<DirectAuth />} />
            
            {/* 404 sida */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
