import type { Metadata } from "next";
import { BlogListClient } from "@/components/public/blog-list-client";

export const metadata: Metadata = {
  title: "Blog - Falcon Driving School",
  description: "Driving tips, road safety advice, and updates from Falcon Driving School.",
};

export default function BlogPage() {
  return <BlogListClient />;
}
