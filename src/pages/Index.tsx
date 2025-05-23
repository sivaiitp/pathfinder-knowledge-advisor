
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { toast } from "@/components/ui/sonner";
import { Link } from "react-router-dom";

const Index = () => {
  const [role, setRole] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [interviewDate, setInterviewDate] = useState<Date | undefined>(undefined);
  const [hasNoDate, setHasNoDate] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleSubmit = () => {
    if ((!interviewDate && !hasNoDate) || !role || !company) {
      toast.error("Please fill out all required fields");
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Your personalized roadmap has been generated!");
      
      // Redirect to dashboard with the generated roadmap
      window.location.href = "/dashboard";
    }, 2000);
  };

  const companyLogos = [
    { name: "Netflix", logoClass: "text-red-600 font-bold" },
    { name: "Meta", logoClass: "text-blue-600 font-bold" },
    { name: "Apple", logoClass: "text-gray-800 font-bold" },
    { name: "Google", logoClass: "text-blue-500 font-bold" },
    { name: "Amazon", logoClass: "text-orange-500 font-bold" },
    { name: "Airbnb", logoClass: "text-red-500 font-bold" },
    { name: "Coinbase", logoClass: "text-blue-400 font-bold" },
    { name: "Stripe", logoClass: "text-purple-500 font-bold" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero-gradient pt-16 pb-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">Personalized</span>{" "}
                <span className="text-gray-900">Interview Prep</span>
              </h1>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-4">
                Skip the LeetCode grind with a custom roadmap that{" "}
                <span className="text-brand-600 font-medium">adapts</span> to your goals.
              </p>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Hands-on practice for{" "}
                <span className="font-medium">Coding Interviews, System Design</span>, and more.
              </p>
            </div>

            {/* Input Form Card */}
            <Card className="max-w-xl mx-auto p-8 shadow-lg relative bg-white">
              <div className="absolute -top-2 right-8 w-4 h-4 bg-brand-200 rounded-full" />
              <div className="absolute -right-2 top-8 w-2 h-2 bg-brand-300 rounded-full" />
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Role of Interest</label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry-Level Engineer</SelectItem>
                      <SelectItem value="mid">Mid-Level Engineer</SelectItem>
                      <SelectItem value="senior">Senior Engineer</SelectItem>
                      <SelectItem value="staff">Staff Engineer</SelectItem>
                      <SelectItem value="frontend">Frontend Developer</SelectItem>
                      <SelectItem value="backend">Backend Developer</SelectItem>
                      <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                      <SelectItem value="mobile">Mobile Developer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Company</label>
                  <Select value={company} onValueChange={setCompany}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="amazon">Amazon</SelectItem>
                      <SelectItem value="meta">Meta</SelectItem>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="microsoft">Microsoft</SelectItem>
                      <SelectItem value="netflix">Netflix</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Interview Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !interviewDate && !hasNoDate && "text-muted-foreground"
                        )}
                        disabled={hasNoDate}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {interviewDate ? format(interviewDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={interviewDate}
                        onSelect={setInterviewDate}
                        initialFocus
                        className="pointer-events-auto"
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox 
                      id="noDate" 
                      checked={hasNoDate}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setInterviewDate(undefined);
                        }
                        setHasNoDate(!!checked);
                      }}
                    />
                    <label
                      htmlFor="noDate"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I don't have an interview date
                    </label>
                  </div>
                </div>

                <Button 
                  className="w-full bg-brand-600 hover:bg-brand-700" 
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate my roadmap"}
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Companies Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto">
            <p className="text-center text-gray-600 mb-8">
              We have helped developers launch careers at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {companyLogos.map((company, index) => (
                <div key={index} className={`${company.logoClass} text-lg md:text-xl`}>
                  {company.name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why PrepPath Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 card-hover">
                <h3 className="text-xl font-semibold mb-3">Personalized Roadmaps</h3>
                <p className="text-gray-600">
                  Get a custom learning path based on your specific role, company, and interview timeline.
                </p>
              </Card>
              
              <Card className="p-6 card-hover">
                <h3 className="text-xl font-semibold mb-3">Targeted Practice</h3>
                <p className="text-gray-600">
                  Focus on exactly what you need to learn, not generic problems that waste your time.
                </p>
              </Card>
              
              <Card className="p-6 card-hover">
                <h3 className="text-xl font-semibold mb-3">AI-Powered Feedback</h3>
                <p className="text-gray-600">
                  Get real-time guidance and code reviews from our advanced AI tutoring system.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-brand-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to ace your next interview?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of developers who've landed their dream jobs using PrepPath.
            </p>
            <Link to="/signup">
              <Button className="bg-white text-brand-600 hover:bg-gray-100" size="lg">
                Get Started For Free
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Guides</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} PrepPath. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
