import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Features = () => {
  const featuresList = [
    {
      title: "Personalized Roadmaps",
      description: "Create a custom learning path tailored to your specific interview needs",
      icon: "🗺️"
    },
    {
      title: "Company-Specific Practice",
      description: "Practice problems commonly asked by your target company",
      icon: "🎯"
    },
    {
      title: "AI-Powered Feedback",
      description: "Get real-time guidance and code reviews as you practice",
      icon: "🤖"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your progress and identify areas for improvement",
      icon: "📊"
    },
    {
      title: "Time-Based Planning",
      description: "Optimize your study schedule based on your interview date",
      icon: "⏱️"
    },
    {
      title: "Comprehensive Topics",
      description: "From data structures to system design and behavioral questions",
      icon: "📚"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Features that <span className="text-brand-600">Accelerate</span> Your Interview Prep
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              PrepPath offers everything you need to prepare efficiently and effectively for your technical interviews.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuresList.map((feature, index) => (
                <div key={index} className="p-6 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-brand-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to experience these features?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of developers who've transformed their interview preparation with PrepPath.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/signup">
                <Button className="bg-brand-600 hover:bg-brand-700" size="lg">
                  Get Started For Free
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" className="border-brand-600 text-brand-600" size="lg">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link to="/resources" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/resources" className="hover:text-white">Blog</Link></li>
                <li><Link to="/resources" className="hover:text-white">Guides</Link></li>
                <li><Link to="/resources" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Cookie Policy</Link></li>
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

export default Features;
