import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log 404 errors for debugging
    console.warn("404: Route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="flex flex-col items-center px-6 py-8">
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
    </div>
  );
};

export default NotFound;
