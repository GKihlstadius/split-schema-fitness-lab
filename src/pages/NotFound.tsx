import { Link } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
      <div className="text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-6">
          <Dumbbell className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h1 className="text-5xl font-bold text-foreground mb-2">404</h1>
        <p className="text-muted-foreground mb-6">Sidan hittades inte</p>
        <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-8">
          <Link to="/">Tillbaka till startsidan</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
