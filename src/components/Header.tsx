import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingDialog } from "@/components/PricingDialog";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onToggleFilters: () => void;
}

export const Header = ({ onToggleFilters }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            className="md:hidden"
            onClick={onToggleFilters}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            <PricingDialog />
            <Button 
              variant="ghost" 
              className="hover:bg-primary-light flex items-center gap-2"
              onClick={() => navigate('/profile')}
            >
              <User className="h-5 w-5 text-primary" />
              <span className="text-primary">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};