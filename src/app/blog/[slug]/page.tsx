import type { Metadata } from "next";
import { BlogPostClient } from "@/components/public/blog-post-client";

export const metadata: Metadata = {
  title: "Blog Post - Falcon Driving School",
};

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return <BlogPostClient slug={params.slug} />;
}
