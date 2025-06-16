import { Link } from 'react-router-dom';
import { Dumbbell, Utensils } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Gym Janne Logo" className="h-8 w-auto" />
            <span className="font-bold text-lg">Gym Janne</span>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Link to="/workout" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Dumbbell className="h-4 w-4" />
            <span>Träning</span>
          </Link>
          <Link to="/nutrition" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Utensils className="h-4 w-4" />
            <span>Kost</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}; 