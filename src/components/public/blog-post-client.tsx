"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface BlogPostClientProps {
  slug: string;
}

export function BlogPostClient({ slug }: BlogPostClientProps) {
  // In production, fetch from Supabase
  const post = {
    title: "10 Essential Tips for New Drivers in Nigeria",
    slug,
    content: `
      <h2>Introduction</h2>
      <p>Starting your driving journey is an exciting milestone. Whether you're learning for personal convenience or professional necessity, being a safe and skilled driver is crucial, especially on Nigerian roads.</p>
      
      <h2>1. Know Your Vehicle</h2>
      <p>Before you start driving, familiarize yourself with your vehicle's controls. Adjust your seat, mirrors, and steering wheel for comfort. Know where all controls are located.</p>
      
      <h2>2. Always Wear Your Seatbelt</h2>
      <p>This is non-negotiable. Seatbelts save lives. Ensure all passengers are buckled up before moving the vehicle.</p>
      
      <h2>3. Obey Traffic Rules</h2>
      <p>Traffic rules exist for a reason. Observe speed limits, traffic lights, and road signs at all times.</p>
      
      <h2>4. Maintain Safe Following Distance</h2>
      <p>Keep at least a 3-second gap between you and the vehicle ahead. This gives you enough time to react.</p>
      
      <h2>5. Use Your Indicators</h2>
      <p>Always signal your intentions. Indicating before turning or changing lanes communicates your actions to other road users.</p>
      
      <h2>6. Stay Focused</h2>
      <p>Avoid distractions like mobile phones. Keep your eyes on the road and hands on the wheel.</p>
      
      <h2>7. Check Your Blind Spots</h2>
      <p>Before changing lanes or reversing, check your blind spots. Don't rely solely on mirrors.</p>
      
      <h2>8. Adapt to Weather Conditions</h2>
      <p>During rainy season, reduce speed and increase following distance. Roads can be slippery.</p>
      
      <h2>9. Practice Defensive Driving</h2>
      <p>Always anticipate the actions of other drivers. Be prepared for unexpected situations.</p>
      
      <h2>10. Never Drink and Drive</h2>
      <p>Alcohol impairs judgment and reaction time. If you've been drinking, use a taxi or designated driver.</p>
      
      <h2>Conclusion</h2>
      <p>Driving is a skill that improves with practice. Stay patient, stay focused, and never stop learning. At Falcon Driving School, we're here to guide you every step of the way.</p>
    `,
    category: "Driving Tips",
    author: "Adebayo Ogunlesi",
    publishedAt: "2025-12-15",
    readTime: "5 min read",
    tags: ["new drivers", "driving tips", "Nigeria", "road safety"],
  };

  return (
    <>
      <section className="bg-gradient-to-br from-primary to-primary/95 text-white py-20">
        <div className="container mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
          <Badge variant="secondary" className="mb-4">{post.category}</Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-3xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
            <span>By {post.author}</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <article className="lg:col-span-2 prose prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="text-gray-700 leading-relaxed space-y-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-primary [&_h2]:mt-8 [&_h2]:mb-4 [&_p]:mb-4 [&_p]:leading-relaxed"
              />
              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-gray-200">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </article>

            <aside className="space-y-8">
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-primary">Share This Article</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-primary">Enroll Today</h3>
                <p className="text-sm text-gray-600">
                  Ready to start your driving journey? Join Falcon Driving School.
                </p>
                <Link href="/auth/register">
                  <Button variant="gold" className="w-full">Enroll Now</Button>
                </Link>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-primary">Related Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {["Driving Tips", "Road Safety", "Traffic Rules"].map((cat) => (
                    <Link key={cat} href={`/blog?category=${cat.toLowerCase()}`}>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-accent/80">
                        {cat}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
