
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Check } from "lucide-react";

const Pricing = () => {
  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Basic interview preparation",
      features: [
        "Basic personalized roadmap",
        "Limited practice problems",
        "Basic progress tracking",
        "Community support"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline",
      highlighted: false,
      path: "/signup"
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "For serious candidates",
      features: [
        "Advanced personalized roadmap",
        "Unlimited practice problems",
        "Company-specific questions",
        "AI-powered feedback",
        "Advanced analytics",
        "Email support"
      ],
      buttonText: "Start 7-Day Free Trial",
      buttonVariant: "default",
      highlighted: true,
      path: "/signup"
    },
    {
      name: "Team",
      price: "$49",
      period: "/month",
      description: "For recruiting teams",
      features: [
        "Everything in Pro",
        "Multiple user accounts",
        "Team analytics dashboard",
        "Custom company questions",
        "Interview simulation",
        "Priority support"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline",
      highlighted: false,
      path: "/contact"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent <span className="text-brand-600">Pricing</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-2">
              Choose the plan that's right for your interview preparation needs
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
              All plans come with a 100% satisfaction guarantee
            </p>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`p-8 rounded-lg border ${
                    plan.highlighted 
                      ? "border-brand-600 shadow-lg relative" 
                      : "border-gray-200"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white text-sm py-1 px-4 rounded-full font-medium">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-end mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-gray-500 ml-1">{plan.period}</span>}
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={plan.path}>
                    <Button 
                      className={`w-full ${
                        plan.buttonVariant === "default" 
                          ? "bg-brand-600 hover:bg-brand-700" 
                          : "border-brand-600 text-brand-600 hover:bg-brand-50"
                      }`}
                      variant={plan.buttonVariant === "default" ? "default" : "outline"}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-semibold mb-4">Need a custom plan?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                We offer custom solutions for larger teams and organizations. 
                Contact our sales team to learn more.
              </p>
              <Link to="/contact">
                <Button variant="outline" className="border-brand-600 text-brand-600">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Can I cancel anytime?</h3>
                <p className="text-gray-600">Yes, you can cancel your subscription at any time with no cancellation fees.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">What payment methods do you accept?</h3>
                <p className="text-gray-600">We accept all major credit cards, PayPal, and some regional payment methods.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Do you offer refunds?</h3>
                <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">How often is content updated?</h3>
                <p className="text-gray-600">We continuously update our content to reflect current interview trends and practices.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Footer content similar to Features page */}
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

export default Pricing;
