
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ExternalLink } from "lucide-react";

const Resources = () => {
  const blogPosts = [
    {
      title: "5 Strategies to Ace Your Google Interview",
      description: "Learn the insider tips and strategies to prepare for Google's tough interview process.",
      category: "Preparation",
      date: "May 15, 2025",
      readTime: "5 min read",
      imagePlaceholder: "G"
    },
    {
      title: "System Design Interview: A Complete Guide",
      description: "Everything you need to know about system design interviews at top tech companies.",
      category: "Technical",
      date: "May 10, 2025",
      readTime: "8 min read",
      imagePlaceholder: "SD"
    },
    {
      title: "Behavioral Questions: What Interviewers Really Look For",
      description: "Decode what interviewers are actually looking for in your behavioral responses.",
      category: "Soft Skills",
      date: "May 5, 2025",
      readTime: "6 min read",
      imagePlaceholder: "BQ"
    },
    {
      title: "Dynamic Programming: From Novice to Expert",
      description: "Master the art of dynamic programming with our comprehensive guide.",
      category: "Algorithms",
      date: "April 28, 2025",
      readTime: "10 min read",
      imagePlaceholder: "DP"
    }
  ];

  const guides = [
    {
      title: "Complete Interview Preparation Guide",
      description: "A comprehensive guide to help you prepare for your technical interviews.",
      icon: "📘"
    },
    {
      title: "Data Structures Cheat Sheet",
      description: "Quick reference for common data structures and their operations.",
      icon: "📊"
    },
    {
      title: "Algorithm Patterns Guide",
      description: "Learn to recognize and apply common algorithm patterns.",
      icon: "🧩"
    },
    {
      title: "System Design Interview Preparation",
      description: "Step-by-step guide to answering system design questions.",
      icon: "🏗️"
    },
    {
      title: "Behavioral Questions Framework",
      description: "STAR method and frameworks for answering behavioral questions.",
      icon: "🗣️"
    },
    {
      title: "Mock Interview Guidelines",
      description: "How to conduct effective mock interviews with peers.",
      icon: "🎭"
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
              PrepPath <span className="text-brand-600">Resources</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Free interview preparation resources, guides, and insights to help you excel in your interviews
            </p>
          </div>
        </section>

        {/* Resources Tabs */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="blog" className="space-y-8">
              <div className="flex justify-center">
                <TabsList>
                  <TabsTrigger value="blog">Blog</TabsTrigger>
                  <TabsTrigger value="guides">Guides</TabsTrigger>
                  <TabsTrigger value="videos">Videos</TabsTrigger>
                </TabsList>
              </div>
              
              {/* Blog Posts Tab */}
              <TabsContent value="blog" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {blogPosts.map((post, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-40 bg-brand-100 flex items-center justify-center">
                        <span className="text-4xl font-bold text-brand-600">{post.imagePlaceholder}</span>
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">{post.category}</span>
                          <span className="text-sm text-gray-500">{post.date}</span>
                        </div>
                        <CardTitle>{post.title}</CardTitle>
                        <CardDescription>{post.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between">
                        <span className="text-sm text-gray-500">{post.readTime}</span>
                        <Link to="#">Read more</Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button variant="outline">View All Blog Posts</Button>
                </div>
              </TabsContent>
              
              {/* Guides Tab */}
              <TabsContent value="guides" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {guides.map((guide, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="text-4xl mb-2">{guide.icon}</div>
                        <CardTitle>{guide.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{guide.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" className="w-full flex items-center justify-center">
                          Download PDF
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Button variant="outline">View All Guides</Button>
                </div>
              </TabsContent>
              
              {/* Videos Tab */}
              <TabsContent value="videos" className="space-y-8">
                <div className="text-center py-16">
                  <h3 className="text-2xl font-bold mb-3">Video Resources Coming Soon</h3>
                  <p className="text-gray-600 mb-6">
                    We're currently working on creating high-quality video content to help you prepare for your interviews.
                    Subscribe to our newsletter to be notified when videos are available.
                  </p>
                  <Button className="bg-brand-600 hover:bg-brand-700">Subscribe for Updates</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="py-16 bg-brand-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive the latest interview tips, resources, and company insights
            </p>
            <div className="flex justify-center">
              <div className="flex flex-col sm:flex-row gap-4 max-w-md w-full">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent flex-grow"
                />
                <Button className="bg-brand-600 hover:bg-brand-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Footer content similar to other pages */}
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

export default Resources;
