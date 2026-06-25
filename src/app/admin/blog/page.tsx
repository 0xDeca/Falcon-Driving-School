"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { FileText, Plus, Edit, Eye, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category_id: "",
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
  });
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const [postsRes, catsRes] = await Promise.all([
        supabase.from("blog_posts").select("*, blog_categories(name)").order("created_at", { ascending: false }),
        supabase.from("blog_categories").select("*"),
      ]);
      setPosts(postsRes.data ?? []);
      setCategories(catsRes.data ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async (status: "draft" | "published") => {
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...postData, status }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(`Post ${status === "published" ? "published" : "saved as draft"} successfully!`);
      setShowEditor(false);
    } catch {
      toast.error("Failed to save post");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="admin" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">Blog Management</h1>
            <Button variant="gold" onClick={() => setShowEditor(!showEditor)}>
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Button>
          </div>

          {showEditor && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create New Post</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        placeholder="Post title"
                        value={postData.title}
                        onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Slug *</Label>
                      <Input
                        placeholder="post-url-slug"
                        value={postData.slug}
                        onChange={(e) => setPostData({ ...postData, slug: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Excerpt</Label>
                    <Textarea
                      placeholder="Brief summary"
                      rows={2}
                      value={postData.excerpt}
                      onChange={(e) => setPostData({ ...postData, excerpt: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Content *</Label>
                    <Textarea
                      placeholder="Write your post content here (HTML supported)..."
                      rows={12}
                      value={postData.content}
                      onChange={(e) => setPostData({ ...postData, content: e.target.value })}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <select
                        className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm"
                        value={postData.category_id}
                        onChange={(e) => setPostData({ ...postData, category_id: e.target.value })}
                      >
                        <option value="">Select category</option>
                        {categories.map((cat: any) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Featured Image</Label>
                      <Input type="file" accept="image/*" />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-primary mb-4">SEO Metadata</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>SEO Title</Label>
                        <Input
                          placeholder="Meta title"
                          value={postData.seo_title}
                          onChange={(e) => setPostData({ ...postData, seo_title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>SEO Description</Label>
                        <Input
                          placeholder="Meta description"
                          value={postData.seo_description}
                          onChange={(e) => setPostData({ ...postData, seo_description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>SEO Keywords</Label>
                        <Input
                          placeholder="keyword1, keyword2"
                          value={postData.seo_keywords}
                          onChange={(e) => setPostData({ ...postData, seo_keywords: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="gold" onClick={() => handleSave("published")}>
                      Publish
                    </Button>
                    <Button variant="outline" onClick={() => handleSave("draft")}>
                      Save as Draft
                    </Button>
                    <Button variant="ghost" onClick={() => setShowEditor(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Title</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Category</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-medium">Published</th>
                    <th className="text-left py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {posts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">No posts found</td>
                    </tr>
                  ) : (
                    posts.map((post: any) => (
                      <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-primary">{post.title}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="text-xs">{post.blog_categories?.name ?? "Uncategorized"}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={post.status === "published" ? "success" : "warning"}>
                            {post.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{post.published_at?.split("T")[0] ?? "-"}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
