
import React from 'react';
import { Button } from "@/components/ui/button";
import { Code, Network, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserHeaderProps {
  userInfo: {
    name: string;
    role: string;
    company: string;
    daysLeft: number;
  };
}

const UserHeader: React.FC<UserHeaderProps> = ({ userInfo }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">
        Your Personalized Interview Roadmap
      </h1>
      <div className="flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-x-6 mt-2">
          <div className="flex items-center">
            <Code className="mr-2 h-5 w-5 text-brand-600" />
            <span>{userInfo.role}</span>
          </div>
          <div className="flex items-center">
            <Network className="mr-2 h-5 w-5 text-brand-600" />
            <span>{userInfo.company}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-brand-600" />
            <span>{userInfo.daysLeft} days until interview</span>
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button 
            className="bg-brand-600 hover:bg-brand-700"
            onClick={() => navigate('/profile')}
          >
            Update Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
