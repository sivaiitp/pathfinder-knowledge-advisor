
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Search, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth";
import { toast } from "@/components/ui/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path ? "text-brand-600" : "text-gray-600 hover:text-brand-600 transition-colors";
  };
  
  const handleSignOut = async () => {
    const { success } = await signOut();
    if (success) {
      toast.success("Successfully logged out");
    }
  };

  return (
    <nav className="w-full py-4 bg-white border-b border-gray-100">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 rounded bg-brand-600 text-white flex items-center justify-center font-bold mr-2">P</div>
            <span className="text-xl font-bold">PrepPath</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/features" className={isActive('/features')}>Features</Link>
            <Link to="/pricing" className={isActive('/pricing')}>Pricing</Link>
            <Link to="/resources" className={isActive('/resources')}>Resources</Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 py-1.5 pr-4 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="flex h-8 w-8 rounded-full items-center justify-center bg-brand-100 text-brand-700">
                    <User className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link to="/dashboard" className="w-full">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/profile" className="w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="hidden sm:inline-flex">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-brand-600 hover:bg-brand-700">Join for free</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
