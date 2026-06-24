import type { Metadata } from "next";
import { BlogPostClient } from "@/components/public/blog-post-client";

export const metadata: Metadata = {
  title: "Blog Post - Falcon Driving School",
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostClient slug={params.slug} />;
}
