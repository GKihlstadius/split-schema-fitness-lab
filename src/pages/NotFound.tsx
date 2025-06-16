import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from '@/components/Navbar';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Oops! Sidan hittades inte</p>
          <a href="/" className="text-primary hover:text-primary/80 underline">
            Tillbaka till startsidan
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
