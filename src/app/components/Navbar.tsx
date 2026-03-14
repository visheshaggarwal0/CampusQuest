import { Link } from "react-router";
import { Button } from "./ui/button";
import { Compass } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Compass className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold">CampusQuest</span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="sm:text-base">Log In</Button>
          </Link>
          <Link to="/login">
            <Button size="sm" className="sm:text-base">Sign Up</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}