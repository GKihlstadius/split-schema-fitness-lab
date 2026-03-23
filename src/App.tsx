import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Workouts from "./pages/Workouts";
import Progress from "./pages/Progress";
import NutritionHub from "./pages/NutritionHub";
import WorkoutDetails from "./pages/WorkoutDetails";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AuthCallback from "./pages/AuthCallback";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DirectAuth from "./pages/DirectAuth";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { BottomNav } from "./components/BottomNav";
import { Toaster } from "./components/ui/toaster";
import { ToastAction } from "./components/ui/toast";
import { useToast } from "./hooks/use-toast";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Komponent för att hantera auth hash redirect
const AuthHashHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/' && location.hash.includes('access_token')) {
      navigate('/auth/callback' + location.hash, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

function App() {
  const { toast } = useToast();

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<ServiceWorkerRegistration>;

      toast({
        title: "Ny version finns",
        description: "Ladda om för att få senaste innehållet.",
        action: (
          <ToastAction
            altText="Uppdatera"
            onClick={() => {
              const reg = customEvent.detail;
              const waiting = reg.waiting;
              if (waiting) {
                waiting.postMessage({ type: "SKIP_WAITING" });
              }
            }}
          >
            Uppdatera
          </ToastAction>
        ),
      });
    };

    window.addEventListener("swUpdated", handler);
    return () => window.removeEventListener("swUpdated", handler);
  }, [toast]);

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

            {/* Skyddade routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/workouts" element={
              <ProtectedRoute>
                <Workouts />
              </ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute>
                <Progress />
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

            {/* Auth catch-all */}
            <Route path="/auth/*" element={<DirectAuth />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </BrowserRouter>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
