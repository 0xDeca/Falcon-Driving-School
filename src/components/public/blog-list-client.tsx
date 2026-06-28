"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import { formatDate, truncateText } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Driving Tips",
  "Road Safety",
  "Driver Licensing",
  "Traffic Rules",
  "Student Success Stories",
  "Falcon Updates",
];

const BLOG_POSTS = [
  {
    id: 1,
    title: "10 Essential Tips for New Drivers in Nigeria",
    slug: "essential-tips-new-drivers-nigeria",
    excerpt: "Starting your driving journey? Here are the most important tips every new driver in Nigeria should know before hitting the road.",
    category: "Driving Tips",
    author: "Adebayo Ogunlesi",
    publishedAt: "2025-12-15",
    readTime: "5 min read",
    featured: true,
  },
  {
    id: 2,
    title: "Understanding Nigerian Road Signs: A Complete Guide",
    slug: "understanding-nigerian-road-signs",
    excerpt: "From regulatory signs to warning signs, learn everything you need to know about road signs in Nigeria.",
    category: "Road Safety",
    author: "Ngozi Eze",
    publishedAt: "2025-12-10",
    readTime: "8 min read",
    featured: false,
  },
  {
    id: 3,
    title: "How to Get Your Driver's License in Nigeria: Step by Step",
    slug: "how-to-get-drivers-license-nigeria",
    excerpt: "A comprehensive guide to the driver's license application process in Nigeria, from start to finish.",
    category: "Driver Licensing",
    author: "Chidi Okonkwo",
    publishedAt: "2025-12-05",
    readTime: "10 min read",
    featured: false,
  },
  {
    id: 4,
    title: "Defensive Driving Techniques Every Nigerian Driver Should Master",
    slug: "defensive-driving-techniques-nigeria",
    excerpt: "Stay safe on Nigerian roads with these essential defensive driving techniques.",
    category: "Driving Tips",
    author: "Folake Adeleke",
    publishedAt: "2025-11-28",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 5,
    title: "Common Traffic Violations in Nigeria and Their Penalties",
    slug: "common-traffic-violations-nigeria-penalties",
    excerpt: "Know the rules of the road. Here are the most common traffic violations in Nigeria and what they cost you.",
    category: "Traffic Rules",
    author: "Emeka Okafor",
    publishedAt: "2025-11-20",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: 6,
    title: "From Nervous Beginner to Confident Driver: Chioma's Story",
    slug: "nervous-beginner-to-confident-driver-chioma",
    excerpt: "Read how Chioma overcame her fear of driving and passed her test on the first attempt.",
    category: "Student Success Stories",
    author: "Zainab Abdullah",
    publishedAt: "2025-11-15",
    readTime: "4 min read",
    featured: false,
  },
];

export function BlogListClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = BLOG_POSTS.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = BLOG_POSTS.find((p) => p.featured);

  return (
    <>
      <section className="bg-gradient-to-br from-primary to-primary/95 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Driving tips, road safety advice, and updates from Falcon Driving School
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {featuredPost && (
            <Card className="mb-12 bg-gradient-to-r from-primary/5 to-accent/5 border-accent/20">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <Badge variant="secondary">Featured Post</Badge>
                    <h2 className="text-2xl lg:text-3xl font-bold text-primary">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(featuredPost.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                    <Link href={`/blog/${featuredPost.slug}`}>
                      <Button variant="gold">
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="hidden lg:flex bg-gray-100 rounded-xl h-64 items-center justify-center" role="img" aria-label="Featured post image placeholder">
                    <span className="text-gray-400" aria-hidden="true">Featured Image</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-accent text-primary"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="group hover:shadow-lg transition-all h-full">
                    <div className="bg-gray-100 h-48 rounded-t-xl flex items-center justify-center" role="img" aria-label="Post image placeholder">
                      <span className="text-gray-400" aria-hidden="true">Post Image</span>
                    </div>
                    <CardContent className="p-6 space-y-3">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <h3 className="font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
