
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <nav className="w-full py-4 bg-white border-b border-gray-100">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 rounded bg-brand-600 text-white flex items-center justify-center font-bold mr-2">P</div>
            <span className="text-xl font-bold">PrepPath</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/features" className="text-gray-600 hover:text-brand-600 transition-colors">Features</Link>
            <Link to="/pricing" className="text-gray-600 hover:text-brand-600 transition-colors">Pricing</Link>
            <Link to="/resources" className="text-gray-600 hover:text-brand-600 transition-colors">Resources</Link>
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
          <Link to="/login">
            <Button variant="outline" className="hidden sm:inline-flex">Log In</Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-brand-600 hover:bg-brand-700">Join for free</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
