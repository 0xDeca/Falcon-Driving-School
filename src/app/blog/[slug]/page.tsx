import type { Metadata } from "next";
import { BlogPostClient } from "@/components/public/blog-post-client";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  return {
    title: `${params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} - Falcon Driving School`,
  };
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return <BlogPostClient slug={params.slug} />;
}
